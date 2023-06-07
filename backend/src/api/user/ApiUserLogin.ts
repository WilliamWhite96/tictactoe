import { ApiCall } from "tsrpc";
import { ReqUserLogin, ResUserLogin } from "../../shared/protocols/user/PtlUserLogin";
import { room } from "../..";

export default async function (call: ApiCall<ReqUserLogin, ResUserLogin>) {
    let userId:number = call.req.userId;
      if(!userId){
        return call.error('参数错误');
      }
      let now:number = Date.parse(new Date().toString())/1000;
      call.conn.userId = userId;
      call.conn.onTime = now;
      return call.succ({
        userId:userId
      })
}
