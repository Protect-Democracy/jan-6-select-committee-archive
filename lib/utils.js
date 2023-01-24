/**
 * Some utils
 */

// Dependencies
import { createInterface } from "readline";

/**
 * Promise based sleep.
 *
 * @param {*} seconds
 * @returns
 */
async function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

/**
 * Get input from command line.
 *
 * @param {*} question
 * @returns
 */
function cliInput(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

/**
 * Turn URL into an identifier.
 *
 * @param {*} url
 * @returns
 */
function urlToIdentifier(url) {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()
    .substring(0, 100);
}

export { sleep, cliInput, urlToIdentifier };
