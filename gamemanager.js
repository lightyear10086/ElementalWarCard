/*
主体：
静态变量 +
网络中心 +
消息中心 +
页面渲染
玩家操作
玩家角色 +
地块 +
卡牌 +
卡库 +
标记 +
游戏回合
回合阶段
 */

class GameUtils {


}

class GameStatic {
    //是否异步处理网络消息
    static MessageAsync = false;
    //玩家血量
    static HP = 10;
    //玩家初始手牌数
    static HandCardLimit = 5;
}

//网络中心
class NetworkCenter {

    constructor(websocket) {
        this.init(websocket);
    }

    init(websocket) {
        //websocket对象
        this.websocket = websocket;
        if(this.websocket == undefined || this.websocket == null){
            return;
        }
        this.websocket.onopen = this.events.onopen;
        this.websocket.onmessage = this.events.onmessage;
        this.websocket.onclose = this.events.onclose;
        this.websocket.onerror = this.events.onerror;
        this.messageHandle = new MessageHandle();
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

    close(){
        //TODO 关闭网络
    }




}

//消息中心
class MessageHandle {

    constructor() {
        this.msgQueue = [];
        this.MessageAsync = GameStatic.MessageAsync;
    }

    handle(data){
        this.msgQueue.push(data);
        if(!this.MessageAsync){
            this.next();
        }
    }

    next(){
        if(this.msgQueue.length>0){
            const data = this.msgQueue[this.msgQueue.length-1];
            //TODO

        }
    }


}

//玩家
class Player {
    constructor() {
        this.HP = GameStatic.HP;
        this.pointJin = 0;
        this.pointMu = 0;
        this.pointShui = 0;
        this.pointHuo = 0;
        this.pointTu = 0;
        this.handCardList = [];
    }
}

//地块
class Land {
    constructor(x, property) {
        this.x = x;
        this.property = property; //属性
        this.selfMarkList = []; //己方的标记集合
        this.otherMarkList = []; //对方的标记集合

    }
}

//卡牌
class Card {
    constructor(x, property) {
        this.name = "";
        this.text = "";

    }

    //各阶段结算效果回调
    events = {
        //凝聚阶段
        onCondensation: function () {
            //TODO
        },
        //移动阶段
        onMove: function () {
            //TODO

        },
        //出牌阶段
        onPlayHand: function () {
            //TODO

        },
        //结束阶段
        onFinish: function () {
            //TODO

        },
    }


}

//牌库
class CardLibrary {
    constructor() {
        this.cards = [];
    }

    //添加一张牌到牌库
    putCard(card){
        this.cards.push(card);
    }

    //抽一张牌
    getCard(){
        const card = this.cards[this.cards.length-1];
        this.cards.splice(this.cards.length-1, 1);
        return card;
    }
}

//回合控制器
class RoundControl {
    constructor() {
        this.roundNum = 1;//当前回合数
    }

}

//主控制器
class MainControl {
    constructor() {
        this.websocket = null;//TODO
        this.networkCenter = new NetworkCenter(this.websocket);

    }



}