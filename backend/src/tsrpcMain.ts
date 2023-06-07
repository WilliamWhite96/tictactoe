import * as path from "path";
import {  WsServer } from "tsrpc";
import {  serviceProto } from './shared/protocols/serviceProto';
import {config} from "./util/ConfigUtil";

const port = config("WS_PORT");

export const serverTsrpc = new WsServer(serviceProto, {
    port: Number(port),
    json: true
});

serverTsrpc.autoImplementApi(path.resolve(__dirname, 'api'));

serverTsrpc.start();

declare module 'tsrpc' {
    export interface BaseConnection {
        userId: number;
        roomId: number;
        onTime: number;
    }
}

