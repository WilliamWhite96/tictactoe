import {config} from "./ConfigUtil";

const game = config("PROJECT_NAME");

export function roomKey(roomId:number): string{
    return game+":pvp:room:"+roomId;
};

export function poolKey(): string{
    return game+":pvp:pool";
}

