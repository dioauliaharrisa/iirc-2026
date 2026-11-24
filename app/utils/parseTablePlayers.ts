export type TablePlayer = { id: string; name: string; score: string };

// Player IDs look like A05, B12, IDN008, OVS011.
const PLAYER_ID = /^[A-Z]{1,3}\d{2,3}$/;

/**
 * Parse one Display_Match_Up cell, e.g.
 *   "A05, Dio Aulia Harrisa, 12.3, B05, Deandry Ganda Permana, -4.1, ..."
 * The score after each name is optional (it is missing before a hanchan is
 * played), so players are split on their IDs instead of in fixed groups of 3.
 */
export function parseTablePlayers(cell: unknown): TablePlayer[] {
  const parts = String(cell ?? "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const players: TablePlayer[] = [];
  for (const part of parts) {
    const current = players[players.length - 1];
    if (PLAYER_ID.test(part)) {
      players.push({ id: part, name: "", score: "" });
    } else if (current && !current.name) {
      current.name = part;
    } else if (current && !current.score) {
      current.score = part;
    }
  }
  return players;
}

/**
 * Seat winds in sheet order: the 1st player listed sits East, then South,
 * West, North. Players are always shown in this seat order, not by score.
 */
export const SEATS = ["E", "S", "W", "N"] as const;
export const seatOf = (index: number) => SEATS[index] ?? "";
