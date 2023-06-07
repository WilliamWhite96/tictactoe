import { RedisClientType, createClient } from "redis";

const host = "127.0.0.1";
const port = 6379;
const password = "000000";

const url:string = "redis://"+host+":"+port;

export class Redis{
    client!: RedisClientType;

    constructor(){
        this.connectionEstablishment();
    }

    connectionEstablishment(){
        let clientParams:{[key:string]:Object} = {url:url};
        if(password){
            clientParams["password"] = password;
        }
        var client:RedisClientType = createClient(clientParams);
        client.on('connect', function() {
            console.log('Redis client connected !');
            console.log('Client url is "'+url+'" .');
        });
        client.connect();
        this.client = client;
    }

    async setKey(key:string, value:string){
        await this.client.set(key, value);
    }
    
    async getKey(key:string){
        let value = await this.client.get(key);
        return value;
    };
    async zAdd(key:string,value:string,score:number){
        return await this.client.zAdd(key,[{score,value}]);
    }
    async zRangeWithScores(key:string,start:number,end:number){
        return await this.client.zRangeWithScores(key, start,end);
    }
    async zRem(key:string,value:string[]){
        return await this.client.zRem(key,value);
    }
    async hSet(key:string,values:any){
        return await this.client.hSet(key,values);
    }
    async hGetAll(key:string){
        let values = await this.client.hGetAll(key);
        return values;
    }   
}
