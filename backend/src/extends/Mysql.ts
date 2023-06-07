import { Connection, createConnection } from "mysql";

const user = "root";
const password = "123456";
const host = "127.0.0.1";
const port = 3306;
const database = "chat_assitant";

let url = "mysql://"+user+":"+password+"@"+host+":"+port+"/"+database+"?debug=false&charset=utf8mb4&timezone=GMT%2B8&useConnectionPooling=true";

export class Mysql{
    client!: Connection;
    pingInterval!: NodeJS.Timeout;
    _tableName:string = "";
    _sql:string="";
    _where:string = "";
    _order:string = "";
    _field:string = "";
    _page:number = 1;
    _limit:number = 0;

	constructor(){
        this.connectionEstablishment();
	}
        
    // 如果数据连接出错，则重新连接
    handleError(err:Object) {
        console.log(err);
        
    }
    
    // 建立数据库连接
    connectionEstablishment() {

        this.client = createConnection(url);
        this.client.connect( (err) => {
            if (err) {
                console.log("error when connecting to db,reConnecting after 2 seconds:", err);
            }else{
                console.log('Mysql client connected !');
                console.log('Client url is "'+url+'" .');
            }

        });
        this.client.on("error", this.handleError);

        // 每个小时ping一次数据库，保持数据库连接状态
        clearInterval(this.pingInterval as NodeJS.Timeout);
        this.pingInterval = setInterval(() => {
            console.log('Mysql ping...');
            this.client.ping((err) => {
                if (err) {
                    console.log('ping error: ' + JSON.stringify(err));
                }
            });
        }, 3600000);
    }

    query(sql:string,params:Object=[]){
        return new Promise((resolve, reject) => {
            this.client.query(sql,params,(error,result,fields) => {
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            })
        })
    }

    db(tableName:string){
        this._tableName = tableName;
        return this;
    }

    where(where:string){
        this._where = where;
        return this;  
    }

    order(order:string){
        this._order = order;
        return this;  
    }

    field(field:string){
        this._field = field;
        return this;  
    }

    page(page:number){
        this._page = page;
        return this;  
    }

    limit(limit:number){
        this._limit = limit;
        return this;  
    }

    async find(){
        this._sql = this.createSelectSql(this._tableName,this._where,this._order,this._limit,this._page,this._field);
        console.log(this._sql);
        this.format();
        let res = await this.query(this._sql);
        return res;
    }

    async select(){
        this._sql = this.createSelectSql(this._tableName,this._where,this._order,this._limit,this._page,this._field);
        console.log(this._sql);
        this.format();
        let res = await this.query(this._sql);
        return res;
    }
    //未开发完的column 取出数组将数组重新构造为对象
    async column(){
        this._sql = this.createSelectSql(this._tableName,this._where,this._order,this._limit,this._page,this._field);
        console.log(this._sql);
        this.format();
        let res = await this.query(this._sql);
        return res;
    }
    async insert(obj:{[key:string]:[value:string]}){
        let fields = [];
        let prepares = [];
        let values = [];
        for(var key in obj) {
            fields.push("`"+key+"`");
            prepares.push("?");
            values.push(obj[key]);
        }
        this._sql = "Insert into "+this._tableName+" ("+fields+") values ("+prepares+")";
        console.log(this._sql);
        let res = await this.query(this._sql,values);
        return res;     
    }
    async insertGetId(obj:{[key:string]:[value:string]}){
        let fields = [];
        let prepares = [];
        let values = [];
        for(var key in obj) {
            fields.push("`"+key+"`");
            prepares.push("?");
            values.push(obj[key]);
        }
        this._sql = "Insert into "+this._tableName+" ("+fields+") values ("+prepares+")";
        console.log(this._sql);
        let res = await this.query(this._sql,values);
        return res;     
    }

    async delete(){
        this._sql = "Delete from "+this._tableName+" where "+this._where;
        console.log(this._sql);
        let res = await this.query(this._sql);
        return res;
    }

    createSelectSql(tableName:string, where = "", order = "", limit = 0, page = 1, field = "") {
        if(!field){
            field = "*"
        }
        let sql = "select "+field+" from "+tableName;
        if(where){
            sql = sql + " where " + where;
        }
        if(order){
            sql = sql + " order by "+order;
        }
        if(limit){
            let start = (page - 1) * limit;
            sql = sql + " limit "+start+", "+limit;
        }
        return sql;
    }

    format(){
        this._tableName = "";
        this._where = "";
        this._order = "";
        this._field = "";
        this._page = 1;
        this._limit = 0;
    }
}