import { ServiceProto } from 'tsrpc-proto';
import { ReqSend, ResSend } from './game/PtlSend';
import { MsgChat } from './MsgChat';
import { ReqHeart, ResHeart } from './user/PtlHeart';
import { ReqUserLogin, ResUserLogin } from './user/PtlUserLogin';

export interface ServiceType {
    api: {
        "game/Send": {
            req: ReqSend,
            res: ResSend
        },
        "user/Heart": {
            req: ReqHeart,
            res: ResHeart
        },
        "user/UserLogin": {
            req: ReqUserLogin,
            res: ResUserLogin
        }
    },
    msg: {
        "Chat": MsgChat
    }
}

export const serviceProto: ServiceProto<ServiceType> = {
    "version": 13,
    "services": [
        {
            "id": 18,
            "name": "game/Send",
            "type": "api"
        },
        {
            "id": 19,
            "name": "Chat",
            "type": "msg"
        },
        {
            "id": 17,
            "name": "user/Heart",
            "type": "api",
            "conf": {}
        },
        {
            "id": 8,
            "name": "user/UserLogin",
            "type": "api",
            "conf": {}
        }
    ],
    "types": {
        "game/PtlSend/ReqSend": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                }
            ]
        },
        "game/PtlSend/ResSend": {
            "type": "Interface",
            "properties": [
                {
                    "id": 1,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 0,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "MsgChat/MsgChat": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "content",
                    "type": {
                        "type": "String"
                    }
                },
                {
                    "id": 1,
                    "name": "time",
                    "type": {
                        "type": "Date"
                    }
                }
            ]
        },
        "user/PtlHeart/ReqHeart": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "base/BaseRequest": {
            "type": "Interface",
            "properties": [
                {
                    "id": 0,
                    "name": "userId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "user/PtlHeart/ResHeart": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "now",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        },
        "base/BaseResponse": {
            "type": "Interface"
        },
        "user/PtlUserLogin/ReqUserLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseRequest"
                    }
                }
            ]
        },
        "user/PtlUserLogin/ResUserLogin": {
            "type": "Interface",
            "extends": [
                {
                    "id": 0,
                    "type": {
                        "type": "Reference",
                        "target": "base/BaseResponse"
                    }
                }
            ],
            "properties": [
                {
                    "id": 0,
                    "name": "userId",
                    "type": {
                        "type": "Number"
                    }
                }
            ]
        }
    }
};