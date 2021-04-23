# POS Web Plugins Template Draft

This project contains a Draft to create a template for building Plugins.

---

- [Framework Documentation](https://pos-web-sdk-documentation.azurewebsites.net/)

---

## Table of contents

- [POS Web Plugins Template Draft](#pos-web-plugins-template-draft)
  - [Setup](#setup)
  - [Run](#run)
  - [Build](#build)
  - [Tests](#tests)
  - [Prettier](#prettier)
  - [Update dependencies](#update-dependencies)

## Setup

We use yarn to manage the dependencies of the project:

```bash
$ yarn
```

## Run

This project requires of the DevMode to be used.

```bash
$ yarn start
```

```bash
$ yarn tunnel
```

## Build

To build the solution, run the following command:

```bash
$ yarn build
```

Only production bundles:

```bash
$ yarn build:prod
```

Only development bundles:

```bash
$ yarn build:dev
```

Keep watching files to re-compile automatically (development):

```bash
$ yarn build:watch
```

## Tests

Tests are coded an run using `Jest`.

To run tests, run the following command:

```bash
$ yarn test
```

If you'd like to run them in watch mode, run this other command:

```bash
$ yarn test:watch
```

## Linting

`ESLint` is used as linting tool.

To run the linting, run:

```bash
$ yarn lint
```

## Prettier

Use `prettier` to format the code.

To format all the code, run:

```bash
$ yarn prettier
```

To check if all the code is well-formated:

```bash
$ yarn prettier:diff
```

## Update dependencies

In order to support upgrading dependencies, we recommend to use:

```bash
yarn upgrade-interactive --latest
```
