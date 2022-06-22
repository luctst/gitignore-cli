<div align="center">
  <br>
  <br>
  <p>
    <b>cli-gitignore</b>
  </p>
  <p>
     <i>Generate .gitignore file with template for your project</i>
  </p>
  <p>

[![Build Status](https://travis-ci.com/luctst/cli-gitignore.svg?branch=master)](https://travis-ci.com/luctst/cli-gitignore)
[![NPM version](https://img.shields.io/npm/v/cli-gitignore?style=flat-square)](https://img.shields.io/npm/v/cli-gitignore?style=flat-square)
[![Package size](https://img.shields.io/bundlephobia/min/cli-gitignore)](https://img.shields.io/bundlephobia/min/cli-gitignore)
[![Dependencies](https://img.shields.io/david/luctst/cli-gitignore.svg?style=popout-square)](https://david-dm.org/luctst/cli-gitignore)
[![devDependencies Status](https://david-dm.org/luctst/cli-gitignore/dev-status.svg?style=flat-square)](https://david-dm.org/luctst/cli-gitignore?type=dev)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

  </p>
</div>

---

**Content**

* [Features](##features)
* [Install](##install)
* [Usage](##usage)
* [Exemples](##exemples)
* [Contributing](##contributing)
* [Maintainers](##maintainers)

## Features ✨
* Choose a template based on [https://github.com/github/gitignore](https://github.com/github/gitignore)
* Choose a custom path to create `.gitignore` file

## Install 🐙
```
npm i -g cli-gitignore
```

## Usage 💡
```
cli-gitignore <commands> [options]
```

OR

```
npx cli-gitignore <commands> [options]
```
*Use this if you don't want install this package globally.*

### Commands
*Commands are optional but allow you to skip question for choosing template*.

You can find the template availables in this [github repository](https://github.com/github/gitignore) where template name is filename without the extension.

> **Example** - Supposing you'like to create a `.gitignore` file and your project works with NodeJs you should run this `cli-gitignore Node`

### Options
* `--path` **optional**, The path to create the `.gitignore` file.

## Exemples 🖍
*With template name*
```
cli-gitignore Node
```

*With custom path*
```
cli-gitignore --path dev/foo/
```

*With template and custom path*
```
cli-gitignore C --path dev/foo/
```

## Contributing 🍰
Please make sure to read the [Contributing Guide]() before making a pull request.

Thank you to all the people who already contributed to this project!

## Maintainers 👷
List of maintainers, replace all `href`, `src` attributes by your maintainers datas.
<table>
  <tr>
    <td align="center"><a href="https://lucastostee.now.sh/"><img src="https://avatars3.githubusercontent.com/u/22588842?s=460&v=4" width="100px;" alt="Tostee Lucas"/><br /><sub><b>Tostee Lucas</b></sub></a><br /><a href="#" title="Code">💻</a></td>
  </tr>
</table>

## License ⚖️
Enter what kind of license you're using.

---
<div align="center">
	<b>
		<a href="https://www.npmjs.com/package/get-good-readme">File generated with get-good-readme module</a>
	</b>
</div>
