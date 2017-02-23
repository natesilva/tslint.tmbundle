# TSLint TextMate Bundle

Use the [TSLint](https://palantir.github.io/tslint/) TypeScript validator in [TextMate 2](https://github.com/textmate/textmate).

<img src="https://natesilva.github.io/tslint.tmbundle/images/gutter-popup.gif" width="526" alt="TSLint problems in the TextMate gutter">

## Features

* Validate automatically when you save your file, and on-demand.
* Auto-fix problems using the TSLint `--fix` command.
* Clickable problem icons are displayed in the TextMate gutter.
* Optionally get a detailed problem report by pressing <kbd>Shift</kbd>-<kbd>Ctrl</kbd>-<kbd>V</kbd>.

<img src="https://natesilva.github.io/tslint.tmbundle/images/menu.png" width="300" style="width:300px;" alt="Use TSLint to auto-fix problems">

<img src="https://natesilva.github.io/tslint.tmbundle/images/report.png" width="550" style="width:550px;" alt="Optional validation report">


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

* How do I get TypeScript syntax highlighting?
    * Download [this zipfile](https://github.com/Microsoft/TypeScript-TmLanguage/archive/master.zip)
      from [Microsoft/TypeScript-TmLanguage](https://github.com/Microsoft/TypeScript-TmLanguage).
      Extract and double-click `TypeScript.tmLanguage`.
* How do I run the `--fix` command?
    * Call up the TextMate “Select Bundle Item” shortcut (<kbd>Ctrl</kbd>-<kbd>Cmd</kbd>-<kbd>T</kbd>)
      and search for “Fix”.
* Which version of TSLint is used?
    * Whichever version you have installed locally in your project. If you don’t
      have it installed locally, then whichever version was installed globally.
* Why doesn’t the validator include its own copy of TSLint?
    * Because it might be outdated or the wrong version. Best practice is to install
      tslint locally in your project, so that all of your developers are on the same
      version.
* Shouldn’t you be using Visual Studio Code?
    * If there is an “official” text editor for writing TypeScript, it would have to be
      VS Code. It includes rich Intellisense auto-completion and is itself written in
      TypeScript. But some developers prefer TextMate, and they need linting support.
