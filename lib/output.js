/**
 * Abstraction around logging/console
 */

// Dependencies
import ProgressBar from "progress";

function outputTopItem(item) {
  console.log(`- ${item}`);
}

function outputItem(item) {
  console.log(`     - ${item}`);
}

const progressBars = {};
function outputProgress(id, message, current, total) {
  // Make bar if needed
  if (!progressBars[id]) {
    progressBars[id] = new ProgressBar(`     - ${message} :bar [:percent]`, {
      total: total,
      width: 15,
    });
  }

  progressBars[id].update(current / total);
}

export { outputTopItem, outputItem, outputProgress };
