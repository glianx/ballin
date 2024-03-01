import { rawIDs as rawPlayerIDs } from "$lib/playerIDs";
import { rawIDs as rawTeamIDs } from "$lib/teamIDs";

const playerIDs: string[] = rawPlayerIDs.split("\n");
const teamIDs: string[] = rawTeamIDs.split("\n");

export function getPlayerID(name: string) {
    for (let i = 0; i < playerIDs.length; i++) {
        let nameID: string[] = playerIDs[i].split(",");
        if (name === nameID[0]) {
            return nameID[1];
        }
    }
    return "";
}

export function getTeamID(name: string) {
    for (let i = 0; i < teamIDs.length; i++) {
        let nameID: string[] = teamIDs[i].split(",");
        if (name === nameID[0]) {
            return nameID[1];
        }
    }
    return "";
}

export function getTeamName(name: string) {
    for (let i = 0; i < teamIDs.length; i++) {
        let nameID: string[] = teamIDs[i].split(",");
        if (name === nameID[0]) {
            return nameID[2];
        }
    }
    return "";
}