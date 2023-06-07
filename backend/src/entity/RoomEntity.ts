import { promises } from "fs";
import { GameUserParams,GameChessboardParams } from "../shared/model/RoomModel";
import { roomKey } from "../util/KeysUtil";
import { BaseEntity } from "./BaseEntity";
export class RoomEntity extends BaseEntity {

    roomId: number;                         //房间号
    intervalTime: number;                   //间隔时间
    startTime: number;                      //房间创建时间
    status: number;                         //游戏状态 1未开始 2进行中 3已结束
    fullmoveNumber: number;                 //回合数
    lastPlayTime: number;                   //上位玩家下棋时间
    lastPlayer: number;                     //上位玩家id
    users: GameUserParams[];                //房间内玩家信息
    gameInfo: GameChessboardParams[];       //游戏详情

    constructor(id:number) {
        let key:string = roomKey(id);
        super();
        this.key = key;
        this.roomId = id;
        this.users = [];
        this.intervalTime = 15;
        this.startTime = Date.parse(new Date().toString())/1000;
        this.status = 1;
        this.fullmoveNumber = 1;
        this.lastPlayTime = 0;
        this.lastPlayer = 0;
        this.gameInfo = [];
    }

    async load():Promise<RoomEntity>{
        return await this.get();
    }
}