//消息中心
class MessageHandle {

    constructor(mainControl) {
        this.msgQueue = [];
        this.MessageAsync = GameStatic.MessageAsync;
        this.mainControl = mainControl;
    }

    handle(data){
        this.msgQueue.push(data);
        if(!this.MessageAsync){
            this.next();
        }
    }

    next(){
        if(this.msgQueue.length>0){
            const data = this.msgQueue[0];
            //TODO

        }
        this.next();
    }


}
//网络中心
exports.NetWorkCenter= class NetWorkCenter {

    constructor(mainControl) {
        this.init(mainControl);
    }

    init(mainControl) {
        //websocket对象
        this.websocket = mainControl.websocket;
        if(this.websocket == undefined || this.websocket == null){
            return;
        }
        this.websocket.onopen = this.events.onopen;
        this.websocket.onmessage = this.events.onmessage;
        this.websocket.onclose = this.events.onclose;
        this.websocket.onerror = this.events.onerror;
        this.messageHandle = new MessageHandle(mainControl);
    }

    events = {
        onopen: function (){
            //链接成功 TODO
        },
        onmessage: function (data){
            //接收消息 TODO
            //请求交给消息中心处理
            this.messageHandle.handle(data);
        },

        onclose: function (){
            //关闭 TODO
        },
        onerror: function (){
            // websocket发生错误 TODO
        }
    }

    sendMsg(msg){
        //TODO 发送消息

    }

    sendMsgAll(msg){

    }

    close(){
        //TODO 关闭网络
    }
}