import { redis } from "..";
export class BaseEntity {

    key: string = "";                            //key

    async save(){
        let that:any = {};
        for(let key in this){
            if(key!="key"){
                that[key] = JSON.stringify(this[key]);
            }
        }
        return await redis.hSet(this.key,that);
    }

    async get(){
        let info = await redis.hGetAll(this.key);
        let that:any = this;
        for(let key in info){
            that[key] = JSON.parse(info[key]);
        }
        return that;
    }
}