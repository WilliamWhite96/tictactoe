import { WsConnection } from "tsrpc";
import { redis, server } from "..";
import { ServiceType } from "../shared/protocols/serviceProto";
import { GameChessboardParams, RoomConnectionParams, roomIntevalParams } from "../shared/model/RoomModel";
import { RoomEntity } from "../entity/RoomEntity"

export class Room {
    //行数
    rowNums: number = 11;
    //列数
    columnNums: number = 11;
    //房间自毁时间
    closeTime: number = 24*60*60;
    //房间连接池
    roomConnections: RoomConnectionParams[] = [];
    //定时器数据关联
    roomIntevals: roomIntevalParams[] = [];

    async initChessboard(): Promise<GameChessboardParams[]>{
        let chessboard:GameChessboardParams[] = [];
        for(let i=1;i<=this.rowNums;i++){
            for(let j=1;j<=this.columnNums;j++){
                chessboard.push({
                    rowId: i,
                    columnId: j,
                    playerId: 0,
                    stepNumber: 0,
                });
            }
        }
        return chessboard;
    }
    async info(roomId:number): Promise<RoomEntity>{
        let r = new RoomEntity(roomId);
        return r.load();
    }
    async create(userId: number,conn: WsConnection): Promise<number>{
        let roomId:number = Date.parse(new Date().toString()); 
        let closeTime:number = Date.parse(new Date().toString())/1000+this.closeTime;
        //将用户加入连接池
        this.roomConnections.push({
            roomId: roomId,
            closeTime: closeTime,
            connection: [conn]
        });
        //创建房间
        let r = new RoomEntity(roomId);
        r.roomId = roomId;
        //加入用户
        r.users = [{
            playerId:userId,
            readyStatus:false,
            playTimes:0,
            playerOrder:1,
        }];
        //完成创建
        r.save();
        return roomId;
    }
    async join(roomId: number,userId: number,conn: WsConnection){
        //将用户加入连接池
        let roomConnection:RoomConnectionParams = this.roomConnections.find((v)=>v.roomId==roomId) as RoomConnectionParams;
        roomConnection.connection.push(conn);
        //获取房间
        let r:RoomEntity = await this.info(roomId);
        //加入用户
        r.users.push({
            playerId:userId,
            readyStatus:false,
            playTimes:0,
            playerOrder:1,
        });
        r.save();
        return roomId;
    }
    // gamePrepare(roomId: number,userId: number){
    //     let roomInfo: RoomParams = this.roomGameInfos[roomId];
    //     let roomUsers: UserParams[] = roomInfo.users;
    //     let readyNum:number = 0;
    //     let userNum:number = roomUsers.length;
    //     for(let i=0;i<userNum;i++){
    //         if(roomUsers[i].playerId==userId){
    //             roomUsers[i].readyStatus = true;
    //             readyNum++;
    //             //发送准备消息
    //             // this.sendRoomMsg("UserPrepare",{user:roomUsers[i]},roomId);
    //         }else{
    //             if(roomUsers[i].readyStatus){
    //                 readyNum++;
    //             }
    //         }
    //     }
    //     if(userNum>=2 && userNum==readyNum){
    //         roomInfo.status = 2;
    //         roomInfo.lastThrowTime = Date.parse(new Date().toString())/1000; 
    //         //发送游戏开始消息
    //         // this.sendRoomMsg("GameStart",{
    //         //     roomId:roomId,
    //         //     status:this.roomGameInfos[roomId].status,
    //         //     lastThrowPlayer:this.roomGameInfos[roomId].lastThrowPlayer,
    //         //     lastThrowTime:this.roomGameInfos[roomId].lastThrowTime
    //         // },roomId);
    //         //下位玩家超时自动下棋
    //         let auto = setInterval(()=>{
    //             this.autoThrowDice(roomId);
    //         },1000);    
    //         this.roomIntevals.push({roomId:roomId,intevalId:auto});
    //     }
    // }
    // throwDice(roomId: number,userId: number){
    //     let roomInfo: RoomParams = this.roomGameInfos[roomId];
    //     let roomUsers: UserParams[] = roomInfo.users;
    //     let num:number = random(1,6);
    //     let userkey:number = 0;
    //     for(let i=0;i<roomUsers.length;i++){
    //         if(roomUsers[i].playerId==userId){
    //             roomUsers[i].lastScore = num;
    //             roomUsers[i].throwTimes++;
    //             userkey = i;
    //             break;
    //         }
    //     }
    //     roomInfo.lastThrowPlayer = userId;
    //     roomInfo.lastThrowTime = Date.parse(new Date().toString())/1000;
    //     //如果是最后一位回合数增加1
    //     if(roomUsers[roomUsers.length-1].playerId == userId){
    //         roomInfo.fullmoveNumber++;
    //     }

    //     //发送投骰子信息以及游戏的回合数和游戏状态
    //     // this.sendRoomMsg("GameInfo",{
    //     //     roomId:roomId,
    //     //     user:roomUsers[userkey],
    //     //     fullmoveNumber:roomInfo.fullmoveNumber,
    //     //     lastThrowTime:roomInfo.lastThrowTime,
    //     //     lastThrowPlayer:roomInfo.lastThrowPlayer
    //     // },roomId);

    //     if(roomInfo.fullmoveNumber>roomInfo.maxFullmoveNumber && roomUsers[roomUsers.length-1].playerId==userId){
    //         roomInfo.status=3;
    //     }

    //     //游戏结束销毁房间
    //     if(roomInfo.status==3){
    //         // this.sendRoomMsg("GameOver",{
    //         //     roomId:roomId,
    //         //     status:roomInfo.status,
    //         //     fullmoveNumber:roomInfo.fullmoveNumber,
    //         //     lastThrowTime:roomInfo.lastThrowTime,
    //         //     lastThrowPlayer:roomInfo.lastThrowPlayer,
    //         // },roomId);
    //         //销毁房间
    //         setTimeout(()=>{
    //             this.closeRoom(roomId);
    //         },1000);
    //     }
    // }
    // autoThrowDice(roomId: number){  
    //     let now:number =  Date.parse(new Date().toString())/1000;
    //     let roomInfo = this.roomGameInfos[roomId];
    //     let status = roomInfo?roomInfo.status:3;
    //     if(status==3){
    //         clearInterval(this.roomIntevalObj[roomId]);
    //         Reflect.deleteProperty(this.roomIntevalObj,roomId);
    //         return;
    //     }
    //     let roomUsers = roomInfo.users;
    //     if(now-roomInfo.lastThrowTime<roomInfo.intervalTime){
    //         return;
    //     }
    //     //通过上一个用户查到下一个要掷骰子的人
    //     let nextKey = 0;
    //     for(let i=0;i<roomUsers.length;i++){
    //         if(roomInfo.lastThrowPlayer==roomUsers[i].playerId){
    //             if(roomInfo.lastThrowPlayer!=roomUsers[roomUsers.length-1].playerId){
    //                 nextKey = i+1;
    //             }
    //         }
    //     }
    //     let userId:number = roomUsers[nextKey].playerId;
    //     this.throwDice(roomId,userId);
    // }
    // leave(roomId: number,conn: WsConnection){
    //     this.roomConnections[roomId].removeOne(v => v === conn);
    // }
    // closeRoom(roomId: number){
    //     //房间内用户信息
    //     let roomUsers: UserParams[] = this.roomGameInfos[roomId].users;
    //     //销毁房间信息
    //     Reflect.deleteProperty(this.roomGameInfos,roomId);
    //     //销毁房间连接池
    //     Reflect.deleteProperty(this.roomConnections,roomId);
    //     //清空所有用户的房间关联信息
    //     this.roomIdList = this.roomIdList.filter(item => item !== roomId);
    //     for(let i=0;i<roomUsers.length;i++){
    //         Reflect.deleteProperty(this.userRoomObjs,roomUsers[i].playerId);
    //     }
    //     //清空所有用户链接上的房间号
    //     server.connections.filter(v=>v.roomId==roomId).forEach(conn=>{
    //         conn.roomId=0;
    //     })
    // }
    // sendRoomMsg<T extends keyof ServiceType['msg']>(msgName: T, msg: ServiceType['msg'][T],roomId:number) {
    //     return server.broadcastMsg(msgName, msg, this.roomConnections[roomId]);
    // }
}