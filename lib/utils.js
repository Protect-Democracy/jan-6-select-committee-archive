/**
 * Some utils
 */

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

export { sleep, urlToIdentifier };
