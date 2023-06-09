import { ApiCall } from "tsrpc";
import { ReqSend, ResSend } from "../../shared/protocols/game/PtlSend";
import { game,room } from "../..";
export default async function (call: ApiCall<ReqSend, ResSend>) {
    let content:string = call.req.content;
      if(!content){
        return call.error('参数错误');
      }
      let userId1:number = 111111;
      game.joinPvP(userId1);
      let userId2:number = 222222;
      game.joinPvP(userId2);
      return call.succ({
        content:content,
        time:new Date,
      })
}