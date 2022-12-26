/**
 * Abstraction around logging/console
 */

// Dependencies
import ProgressBar from "progress";
import chalk from "chalk";

const topListMark = chalk.magenta("•");
const subListMark = chalk.magenta("-");

function outputTopItem(item) {
  console.log(`${topListMark} ${item}`);
}

function outputItem(item) {
  console.log(`     ${subListMark} ${item}`);
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
  console.error(`\n\n${chalk.red(item)}\n`);
}

function outputDone(item) {
  console.log(`\n${chalk.green("✓ Done.")}`);
}

export { outputTopItem, outputItem, outputProgress, outputDone, outputError };
