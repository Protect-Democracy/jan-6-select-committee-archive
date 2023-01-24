/**
 * Abstraction around logging/console
 */

// Dependencies
import ProgressBar from "progress";
import chalk from "chalk";

const topListMark = chalk.magenta("•");
const subListMark = chalk.magenta("-");
const doneMark = chalk.green("✓");
const warningMark = chalk.yellow("⚠️");
const errorMark = chalk.red("✖");

function outputTopItem(item) {
  outputLine(`${topListMark} ${item}`);
}

function outputItem(item, options = {}) {
  const mark =
    options.status === "done"
      ? doneMark
      : options.status === "warning"
      ? warningMark
      : options.status === "error"
      ? errorMark
      : subListMark;

  if (options.update) {
    updateLine(`     ${mark} ${item}`);
  } else {
    outputLine(`     ${mark} ${item}`);
  }
}

const progressBars = {};
function outputProgress(id, message, current, total, level = "sub") {
  const prefix = level === "top" ? `${topListMark} ` : `     ${subListMark} `;

  // Make bar if needed
  if (!progressBars[id]) {
    progressBars[id] = new ProgressBar(`${prefix}${message} :bar [:percent]`, {
      total: total,
      width: 15,
    });
  }

  progressBars[id].update(current / total);
}

function outputError(item) {
  console.error(`\n\n${errorMark}  ${chalk.red(item)}\n`);
}

function outputWarning(item) {
  console.error(`\n\n${warningMark}  ${chalk.yellow(item)}\n`);
}

function outputDone(item) {
  outputLine(`\n${doneMark} ${chalk.green("Done.")}`);
}

function output(message) {
  process.stdout.write(message);
}

function outputLine(message) {
  process.stdout.write(`${message}\n`);
}

function updateLine(message) {
  process.stdout.moveCursor(0, -1);
  process.stdout.clearLine(1);
  process.stdout.write(`${message}\n`);
}

export {
  outputTopItem,
  outputItem,
  outputProgress,
  outputDone,
  outputWarning,
  outputError,
};
