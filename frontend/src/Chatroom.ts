import { getClient } from "./getClient";
import { MsgChat } from "./shared/protocols/MsgChat";


export class Chatroom {

    elem: HTMLDivElement;

    showUserIdInput: HTMLInputElement;

    sinput: HTMLInputElement;
    lInput: HTMLInputElement;

    list: HTMLUListElement;

    userId: number;

    client = getClient();

    constructor(elem: HTMLDivElement) {
        this.userId = 0;
        this.elem = elem;
        this.list = this.elem.querySelector('ul.list')!;
        this.showUserIdInput = this.elem.querySelector('#showUserId')!;

        //登陆取值
        this.lInput = this.elem.querySelector('#userLogin')!;
        //登陆发送
        let userLoginDom=this.elem.querySelector('#userLoginBtn')! as HTMLButtonElement;
        userLoginDom.onclick = () => { 
            this.userLogin();
        };
        //心跳发送
        let heartDom=this.elem.querySelector('#heartBtn')! as HTMLButtonElement;
        heartDom.onclick = () => { 
            this.heart();
        };
        //聊天取值
        this.sinput = this.elem.querySelector('#send')!;
        //聊天发送
        let sendDom = this.elem.querySelector('#sendBtn')! as HTMLButtonElement
        sendDom.onclick = () => { 
            this.send();
        };   
        //监听聊天消息
        this.client.listenMsg('Chat', v => { this.onChatMsg(v) })
        // Connect at startup
        this.client.connect().then(v => {
            if (!v.isSucc) {
                alert('= Client Connect Error =\n' + v.errMsg);
            }
        });
        // When disconnected
        this.client.flows.postDisconnectFlow.push(v => {
            console.log('Server disconnected');
            return v;
        })
    }
    async userLogin() {
        let ret = await this.client.callApi('user/UserLogin', {
            userId: Number(this.lInput.value),
        });

        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);
            return;
        }

        // Success
        this.lInput.value = '';
        this.showUserIdInput.value = ret.res.userId.toString();
        this.onResMsg(JSON.stringify(ret.res));
    }
    async heart(){
        let ret = await this.client.callApi('user/Heart', {
            userId: Number(this.lInput.value),           
        });        
        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);
            return;
        }
        this.onResMsg(JSON.stringify(ret.res));
    }
    async send() {
        let ret = await this.client.callApi('game/Send', {
            content: this.sinput.value
        });

        // Error
        if (!ret.isSucc) {
            alert(ret.err.message);
            return;
        }

        // Success
        this.sinput.value = '';
        this.onResMsg(JSON.stringify(ret.res));
    }

    onResMsg(ret: string){
        let li = document.createElement('li');
        li.innerHTML = `<div class="content"></div><div class="time"></div>`;
        (li.querySelector('.content') as HTMLDivElement).innerText = ret;
        (li.querySelector('.time') as HTMLDivElement).innerText = "18:18:18";

        this.list.appendChild(li);
        this.list.scrollTo(0, this.list.scrollHeight);
    }
    onChatMsg(msg: MsgChat) {
        let li = document.createElement('li');
        li.innerHTML = `<div class="content"></div><div class="time"></div>`;
        (li.querySelector('.content') as HTMLDivElement).innerText = msg.content;
        (li.querySelector('.time') as HTMLDivElement).innerText = msg.time.toLocaleTimeString();

        this.list.appendChild(li);
        this.list.scrollTo(0, this.list.scrollHeight);
    }
}