import dotenv from "dotenv";
export function config(key:string){
    dotenv.config();
    dotenv.config({ path: '.env.'+process.env.NODE_ENV });
    return process.env[key];
};


