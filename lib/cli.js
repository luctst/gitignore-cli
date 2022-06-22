#!/usr/bin/env node

import select from "@inquirer/select";
import chalk from "chalk";
import { request } from "https";
import process from "process";
import { access } from "fs/promises";
import { resolve } from "path";
import { createWriteStream } from "fs";
import { createInterface } from "readline";

(async function () {
  function getUserData(args) {
    let nextItemIsFlagValue = false;
    const argsSpliced = args.slice(2);

    return argsSpliced.reduce(
      (prev, next, index) => {
        const oldPrev = { ...prev };

        if (nextItemIsFlagValue) {
          nextItemIsFlagValue = false;
          return oldPrev;
        }

        if (next.includes("-")) {
          if (next.includes("=")) {
            const strSplit = next.split("=");
            const value = strSplit[1].length ? strSplit[1] : true;
            const keySplit = strSplit[0].split("-");
            const key = keySplit[keySplit.length - 1];

            oldPrev.options[key] = value;
            return oldPrev;
          }

          const flagSplit = next.split("-");

          oldPrev.options[flagSplit[flagSplit.length - 1]] =
            argsSpliced[index + 1] || true;
          nextItemIsFlagValue = true;
          return oldPrev;
        }

        oldPrev.commands.push(next);
        return oldPrev;
      },
      { commands: [], options: {} }
    );
  }

  function hasGitgnore(path = process.cwd()) {
    return access(resolve(path, ".gitignore"));
  }

  function displayErrorMessage(content) {
    return chalk.red(content);
  }

  function getPathGitignoreFile(path) {
    return path || process.cwd();
  }

  function formatChoicesTemplates(array) {
    return array.reduce((prev, next) => {
      const newPrev = [...prev];
      const templateArray = next.name.split(".gitignore");

      if (templateArray.length < 2) return newPrev;
      newPrev.push({ value: templateArray[0] });
      return newPrev;
    }, []);
  }

  function selectTemplate(choices) {
    return select({
      message: "Select a template.",
      choices,
    });
  }

  function requestPromise(path, hostname) {
    return new Promise((resolv, reject) => {
      const requestOps = {
        hostname: hostname || "api.github.com",
        method: "GET",
        headers: {
          "User-Agent": "luctst",
        },
      };
      const req = request(
        {
          ...requestOps,
          path,
        },
        (res) => {
          let d = "";

          res
            .on("data", (chunk) => {
              d = d.concat(chunk.toString());
            })
            .on("end", () => resolv(JSON.parse(d)));
        }
      );

      req.on("error", (err) => reject(err.message));
      req.end();
    });
  }

  try {
    const userInput = getUserData(process.argv);
    await hasGitgnore(userInput.options.path);
    const p = getPathGitignoreFile(userInput.options.path);

    process.stderr.write(
      chalk.cyan(
        `.gitignore file already exist here ${chalk.yellow(
          resolve(p, ".gitignore")
        )} to specify a path use the --path option.`
      )
    );
    return process.exit(0);
  } catch (error) {
    if (error.syscall === "access") {
      let tp;
      let content;
      const uInput = getUserData(process.argv);
      const path = getPathGitignoreFile(uInput.options.path);
      const choices = formatChoicesTemplates(
        await requestPromise("/repos/github/gitignore/contents")
      );

      if (uInput.commands.length) {
        tp = await requestPromise(
          `/repos/github/gitignore/contents/${uInput.commands[0]}.gitignore?ref=main`
        );

        if (tp.message) {
          process.stderr.write(
            displayErrorMessage(
              `Template ${uInput.commands[0]} is not correct, please check this repo to see all templates availables https://github.com/github/gitignore`
            )
          );
          return process.exit(-1);
        }

        content = Buffer.from(tp.content, "base64");
      }

      if (!uInput.options.path) {
        let input;
        const questionContent = chalk.cyan(
          `No path was defined, we will create .gitignore file at this path ${chalk.yellow(
            path
          )}, do you confirm ? (Write Yes or No and press enter)`
        );
        const rl = createInterface({
          input: process.stdin,
          output: process.stdout,
          prompt: questionContent,
        });

        rl.prompt();
        return rl
          .on("line", (i) => {
            input = i.trim().toLowerCase();
            return rl.close();
          })
          .on("close", async () => {
            if (input === "no") {
              process.stdout.write(
                chalk.cyan("Process aborted - To specify a path use the --path option.")
              );
              process.exit(0);
            }

            if (!tp) {
              const template = await selectTemplate(choices);
              content = Buffer.from(
                (
                  await requestPromise(
                    `/repos/github/gitignore/contents/${template}.gitignore?ref=main`
                  )
                ).content,
                "base64"
              );
            }

            createWriteStream(resolve(path, ".gitignore")).write(content.toString());
            process.stdout.write(
              chalk.green(
                `It's all good, new .gitignore file created here, ${chalk.yellow(
                  resolve(path, ".gitignore")
                )}`
              )
            );
            return true;
          });
      }

      if (!tp) {
        const template = await selectTemplate(choices);
        content = Buffer.from(
          (
            await requestPromise(
              `/repos/github/gitignore/contents/${template}.gitignore?ref=main`
            )
          ).content,
          "base64"
        );
      }

      createWriteStream(resolve(path, ".gitignore")).write(content.toString());
      process.stdout.write(
        chalk.green(
          `It's all good, new .gitignore file created here, ${chalk.yellow(
            resolve(path, ".gitignore")
          )}`
        )
      );
      return true;
    }

    if (error.code === "ENOENT") {
      process.stderr.write(displayErrorMessage("Path do not exist, enter a valid path"));
      return process.exit(-1);
    }

    process.stderr.write(displayErrorMessage(error.message));
    return process.exit(-1);
  }
})();
