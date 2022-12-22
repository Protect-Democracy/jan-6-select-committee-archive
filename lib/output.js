/**
 * Abstraction around logging/console
 */

function outputTopItem(item) {
  console.log(`- ${item}`);
}

function outputItem(item) {
  console.log(`     - ${item}`);
}

export { outputTopItem, outputItem };
