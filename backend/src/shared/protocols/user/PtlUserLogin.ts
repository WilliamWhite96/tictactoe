import { BaseRequest, BaseResponse, BaseConf } from "../base";

export interface ReqUserLogin extends BaseRequest {

}

export interface ResUserLogin extends BaseResponse {
    userId:number
}

export const conf: BaseConf = {
    
}