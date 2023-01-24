/**
 * Run a migration
 */

// Dependencies
import migrations from "./migrations/index.js";

export default async function migrate(id) {
  if (!migrations[id]) {
    throw new Error(`Migration ${id} not found.`);
  }

  return await migrations[id]();
}
