import 'source-map-support/register';
import { Validator, Issue } from './validator';
import * as path from 'path';
import * as utils from './utils';
import * as pug from 'pug';

const SUPPORT_DIR = path.resolve(path.join(__dirname, '..'));

/** helper to run the validator with current settings */
async function runValidator() {
  let filename = process.env.TM_FILEPATH || null;
  if (!filename) {
    console.error('only saved files can be checked using tslint');
    process.exit(1);
  }
  filename = path.resolve(filename);
  const cwd = process.env.TM_PROJECT_DIRECTORY || process.env.TM_DIRECTORY;
  const validator = new Validator(cwd);
  return await validator.run(filename);
}

/** Update the gutter marks in TextMate that indicate an issue on a particular line. */
async function updateGutterMarks(filename: string, issues: Issue[]) {
  await utils.execFilePromise(process.env.TM_MATE, ['--clear-mark=warning']);

  const argSets = utils.chunks(issues, 10).map(chunk => {
    const args = [];
    chunk.forEach(issue => {
      let msg = issue.failure;
      if (issue.ruleName) { msg += ` (${issue.ruleName})`; }
      args.push(`--set-mark=warning:[TSLint] ${msg}`);
      args.push(`--line=${issue.startPosition.line + 1}:${issue.startPosition.character}`);
    });
    args.push(filename);
    return args;
  });

  for (const argSet of argSets) {
    await utils.execFilePromise(process.env.TM_MATE, argSet);
  }
}

/** Run tslint --fix to correct any problems that can automatically be fixed. */
async function fix() {
  let filename = process.env.TM_FILEPATH || null;
  if (!filename) {
    console.error('only saved files can be checked using tslint');
    process.exit(1);
  }
  filename = path.resolve(filename);
  const cwd = process.env.TM_PROJECT_DIRECTORY || process.env.TM_DIRECTORY;
  const validator = new Validator(cwd);
  const fixResponse = await validator.fix(filename);
  await utils.execFilePromise(process.env.TM_MATE, ['--clear-mark=warning']);
  console.log(fixResponse);
}

/** Run tslint and report the results. */
async function main() {
  try {
    const issues = await runValidator();
    updateGutterMarks(path.resolve(process.env.TM_FILEPATH), issues);

    if (issues.length) {
      const msg = `TSLint: ${issues.length} problem` + (issues.length === 1 ? '' : 's') +
        ' found\n\nPress Shift-Ctrl-V for full report';
      console.log(msg);
    }
  } catch (e) {
    const msg = 'There was a problem running TSLint\n\n' +
      'Press Shift-Ctrl-V for full report';
    console.log(msg);
  }
}

/** Run the validation report, which pops up in a separate window. */
async function report() {
  // context that will be used to build the HTML output
  const now = new Date;
  const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

  const context: pug.LocalsObject = {
    SUPPORT_DIR: SUPPORT_DIR,
    timestamp: timestamp,
    issues: [],
    targetFilename: process.env.TM_FILEPATH,
    relativeFilename: path.relative(
      process.env.TM_PROJECT_DIRECTORY || process.env.TM_DIRECTORY, process.env.TM_FILEPATH
    ),
    targetUrl: `txmt://open?url=file://${process.env.TM_FILEPATH}`
  };

  try {
    context['issues'] = await runValidator();
    const report = pug.compileFile(
      path.join(SUPPORT_DIR, 'templates', 'report.pug'),
      { doctype: 'html' }
    );
    console.log(report(context));
  } catch (e) {
    const errorReport = pug.compileFile(
      path.join(SUPPORT_DIR, 'templates', 'error.pug'),
      { doctype: 'html' }
    );
    context['errorMessage'] = e.message;
    context['searchPath'] = e.path;
    console.log(errorReport(context));
  }
}

switch (process.argv[2]) {
  case '--lint':
    // console.log('would lint');
    main();
    break;
  case '--fix':
    console.log('would fix');
    // fix();
    break;
  case '--report':
    report();
    break;
}
