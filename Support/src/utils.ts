import * as child_process from 'child_process';

/** wrap execFile in a Promise */
export function execFilePromise(
  file: string,
  args: string[],
  options: child_process.ExecFileOptions = {}
): Promise<{stdout: string, stderr: string}> {
  return new Promise((resolve, reject) => {
    child_process.execFile(file, args, options, (err, stdout, stderr) => {
      if (err) { return reject(err); }
      resolve({stdout: stdout, stderr: stderr});
    });
  });
}

/** break an array into chunks */
export function chunks<T>(array: T[], size: number): T[][] {
  if (size < 1) { return chunks(array, 1); }
  const results = [];
  let index = 0;
  while (index < array.length) {
    results.push(array.slice(index, index + size));
    index += size;
  }
  return results;
}

