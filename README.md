# TSLint TextMate Bundle

Use the [TSLint](https://palantir.github.io/tslint/) TypeScript validator in [TextMate 2](https://github.com/textmate/textmate).

Status: Works, but still under development.

## Features

* Validate automatically when you save your file, and on-demand.
* Auto-fix problems using the TSLint `--fix` command.
* Clickable problem icons are displayed in the TextMate gutter.
* Optionally get a detailed problem report by pressing <kbd>Shift</kbd>-<kbd>Ctrl</kbd>-<kbd>V</kbd>.

## Install

First install TSLint:

* In your project
  * `npm install --save-dev tslint typescript`
* Or globally
  * `[sudo] npm install -g tslint typescript`

(Optional) Create a starter configuration: `tslint --init`

Now install the bundle:

1. [Download the latest release .zip file](https://github.com/natesilva/tslint.tmbundle/releases/latest).
2. Extract it and double-click to install in TextMate.

## FAQ

* Which version of TSLint is used?
    * Whichever version of TSLint you have installed locally in your project. If you don’t
      have it installed locally, then whichever version was installed globally.
* Why doesn’t the validator include its own copy of TSLint?
    * Because it might be outdated or the wrong version. Best practice is to install
      tslint locally in your project, so that all of your developers are on the same
      version.
* Shouldn’t you be using Visual Studio Code?
    * If there is an “official” text editor for writing TypeScript, it would have to be
      VS Code. It includes rich Intellisense auto-completion and is itself written in
      TypeScript. But some developers prefer TextMate, and they need linting support. Here
      are some of the reasons I’ve heard (and, yes, they are subjective):
        * TextMate is faster
        * VS Code doesn’t feel native enough
        * TextMate font rendering is better
        * I know how to use TextMate and don’t want to switch editors
