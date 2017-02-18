/**
 * Run TSLint and return structured results.
 */

import * as fs from 'fs';
import * as path from 'path';
import { execFilePromise } from './utils';

interface IssuePosition {
  character: number;
  line: number;
  position: number;
}

export interface Issue {
  startPosition: IssuePosition;
  endPosition: IssuePosition;
  failure: string;
  ruleName: string;
}

export class Validator {
  private cwd: string;

  /**
   * @param {string} cwd -- the project directory, or the file’s directory if no project
   *  is open
   */
  constructor(cwd: string) {
    this.cwd = cwd;
  }

  /**
   * Get the PATH to use when running tslint.
   * @return {string} -- the value to be used as the PATH
   */
  public static getPath() {
    let pathParts: string[] = (process.env.PATH || '').split(':').filter(x => x);

    if (process.env.NODE_PATH) {
      const nodePath: string[] = process.env.NODE_PATH.split(':').filter(x => x);
      pathParts = pathParts.concat(nodePath);
    }

    // if there is a node_modules/.bin in the current project, prepend it to the path
    if (process.env.TM_PROJECT_DIRECTORY) {
      const nodeBin = path.resolve(
        path.join(process.env.TM_PROJECT_DIRECTORY, 'node_modules', '.bin')
      );
      if (fs.existsSync(nodeBin)) {
        const stats = fs.statSync(nodeBin);
        if (stats.isDirectory()) { pathParts.unshift(nodeBin); }
      }
    }

    if (pathParts.indexOf('/bin') === -1) { pathParts.push('/bin'); }
    if (pathParts.indexOf('/usr/bin') === -1) { pathParts.push('/usr/bin'); }
    if (pathParts.indexOf('/usr/local/bin') === -1) { pathParts.push('/usr/local/bin'); }

    return pathParts.join(':');
  }

  /**
   * Run tslint.
   * @param {string} filename - the file to check
   * @returns {Promise<Issue[]>} - array of discovered issues
   */
  public async run(filename: string): Promise<Issue[]> {
    const env = Object.assign(process.env);
    env.PATH = Validator.getPath();

    const args = [
      '-t json',
      '--force',
      filename
    ];

    const options = {
      cwd: this.cwd,
      env: env
    };

    const results = await execFilePromise('tslint', args, options);
    if (!results.stdout.trim().length) { return []};
    return JSON.parse(results.stdout);
  }

  /**
   * Run the tslint --fix command.
   * @param {string} filename - the file to fix
   * @returns {Promise<string>} - response from tslint --fix
   */
  public async fix(filename: string): Promise<string> {
    const env = Object.assign(process.env);
    env.PATH = Validator.getPath();

    const args = [
      '--fix',
      filename
    ];

    const options = {
      cwd: this.cwd,
      env: env
    };

    const results = await execFilePromise('tslint', args, options);
    return results.stdout;
  }
}
