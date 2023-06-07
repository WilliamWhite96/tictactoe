import express  from "express";
import { server } from "../src/index";
import {config} from "./util/ConfigUtil";

const port = config("HTTP_PORT");

export const serverExpress = express();

serverExpress.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

serverExpress.get('*', function (req, res) {
    server.broadcastMsg("Chat", {
        content: "短链接推送长链接消息",
        time: new Date,
    });
    res.send('Hello world!');
});
serverExpress.listen(port);
console.log("Short client connected !");
console.log('Client url is "127.0.0.1:'+port+'"');
