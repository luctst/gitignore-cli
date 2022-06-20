#!/usr/bin/env node
'use strict';

import chalk from 'chalk';
import process from 'process';
import { access } from 'fs/promises';
import { resolve } from 'path';

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
        
        if (next.includes('-')) {
          if (next.includes('=')) {
            const strSplit = next.split('=');
            const value = strSplit[1].length ? strSplit[1] : true;
            const keySplit = strSplit[0].split('-');
            const key = keySplit[keySplit.length - 1];

            oldPrev.options[key] = value;
            return oldPrev;
          }

          const flagSplit = next.split('-');

          oldPrev.options[flagSplit[flagSplit.length - 1]] = argsSpliced[index + 1] || true;
          nextItemIsFlagValue = true;
          return oldPrev;
        }

        oldPrev.commands.push(next);
        return oldPrev;
      },
      { commands: [], options: {} },
    );
  }
  function hasGitgnore(path = process.cwd()) {
    return access(resolve(path, '.gitignore'));
  }

  try {
    const userInput = getUserData(process.argv);
    await hasGitgnore(userInput.options.path);
  } catch (error) {
    if (error.syscall === 'access') {
      process.stderr.write(chalk`{cyan .gitignore file already exist.}`);
      return process.exit(3);
    }

    process.stderr.write(error.message);
    return process.exit(3);
  }
})()