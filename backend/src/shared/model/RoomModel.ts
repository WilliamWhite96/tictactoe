import { WsConnection } from "tsrpc";

export interface GameUserParams {
    playerId: number,      //玩家id
    readyStatus: boolean,  //玩家准备状态
    playTimes: number,     //下棋次数
    playerOrder: number,   //玩家先后手
}

export interface GameChessboardParams {
    rowId: number,       //行号
    columnId: number,    //列号
    playerId: number,      //玩家id
    stepNumber: number,    //步数
}

export interface RoomConnectionParams {
    roomId: number,              //房间号
    closeTime: number,           //房间自毁时间
    connection: WsConnection[],  //连接池
}

export interface roomIntevalParams {
    roomId: number,              //房间号
    intevalId: NodeJS.Timeout,   //定时器id  
}