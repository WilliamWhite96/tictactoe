import { WsConnection } from "tsrpc";
import { server,redis,room } from "..";
import { poolKey } from "../util/KeysUtil";
import { RoomEntity } from "../entity/RoomEntity";

export class Game {

    constructor(){
        setInterval(()=>{this.clearUsers();},10000);
        setInterval(()=>{this.deelPvP();},500);
    }

    clearUsers(){
        console.log("当前连接数量："+server.connections.length);
        let now:number = Date.parse(new Date().toString())/1000;
        server.connections.forEach((conn:WsConnection)=>{
            if(conn.onTime<now-10){
                conn.close();
            }
        })
    }

    joinPvP(userId:number){
        let value:string = userId.toString();
        let now:number = Date.parse(new Date().toString())/1000;
        redis.zAdd(poolKey(),value,now);
    }

    async deelPvP(): Promise<void>{
        let pool = await redis.zRangeWithScores(poolKey(),0,1);
        console.log("当前匹配池用户数量："+pool.length);
        if(pool.length==2){
            let p1 = pool[0].value;
            let p2 = pool[1].value;
            let p1Conn:WsConnection = server.connections.find(conn=>{conn.userId==Number(p1)}) as WsConnection;
            let p2Conn:WsConnection = server.connections.find(conn=>{conn.userId==Number(p2)}) as WsConnection;
            let roomId:number = await room.create(Number(p1),p1Conn);
            room.join(roomId,Number(p2),p2Conn);
            //匹配结束移除匹配池
            redis.zRem(poolKey(),[p1,p2]);
        }
    }
    
}