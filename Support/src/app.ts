import { Validator, Issue } from './validator';
import * as path from 'path';
import * as utils from './utils';

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
    let filename = process.env.TM_FILEPATH || null;
    if (!filename) {
      console.error('only saved files can be checked using tslint');
      process.exit(1);
    }
    filename = path.resolve(filename);
    const cwd = process.env.TM_PROJECT_DIRECTORY || process.env.TM_DIRECTORY;
    const validator = new Validator(cwd);
    const issues = await validator.run(filename);
    updateGutterMarks(filename, issues);

    if (issues.length) {
      const msg = `TSLint: ${issues.length} problem` + (issues.length === 1 ? '' : 's') +
        ' found';
      console.log(msg);
    }
}

switch (process.argv[2]) {
  case '--lint':
    main();
    break;
  case '--fix':
    fix();
    break;
}
