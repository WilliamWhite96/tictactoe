import { serverTsrpc }  from "./tsrpcMain";
import { serverExpress }  from "./expressMain";
import { serverWeb }  from "./webMain";
import { Room } from "./service/RoomService";
import { Game } from "./service/GameService";
import { Mysql } from "./extends/Mysql";
import { Redis } from "./extends/Redis";

//tsrpc
//ws-client-server
export const server = serverTsrpc;
//express
//http-client-server
export const server2 = serverExpress;
//express-hbs
//http-admin-server
export const server3 = serverWeb;

//extends
export const mysql = new Mysql();
export const redis = new Redis();

//game-main-service
export const room = new Room();
export const game = new Game();