import type { Player } from "src/routes/+page.svelte";

export function quickSortPlayers(
    players: Player[],
    left: number,
    right: number
): Player[] {
    let l = left;
    let r = right;

    let p: number = players[Math.floor((l + r) / 2)].fgp;

    while (l <= r) {
        while (players[l].fgp > p) {
            l++;
        }
        while (players[r].fgp < p) {
            r--;
        }

        if (l <= r) {
            [players[l], players[r]] = [players[r], players[l]];
            l++;
            r--;
        }
    }
    if (left < r) quickSortPlayers(players, left, r);
    if (l < right) quickSortPlayers(players, l, right);

    return players;
}

