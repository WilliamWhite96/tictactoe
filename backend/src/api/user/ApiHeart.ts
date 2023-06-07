import { ApiCall, WsConnection } from "tsrpc";
import { ReqHeart, ResHeart } from "../../shared/protocols/user/PtlHeart";

export default async function (call: ApiCall<ReqHeart, ResHeart>) {
    let now:number = Date.parse(new Date().toString())/1000;
    call.conn.onTime = now;
    return call.succ({now})
}
