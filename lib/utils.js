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

export { sleep };
