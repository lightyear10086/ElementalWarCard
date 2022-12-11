const { randomInt } = require('crypto');
const { ALL } = require('dns');
const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server);
var mysql=require('mysql');
process.env.PWD=process.cwd();
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'317406110',
    database:'elemental',
    port:'3306'
});
console.log("连接数据库");
connection.connect(function(err){
    if(err) throw err;
    console.log("连接成功");
});

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/CardGameIndex.html');
});
app.use(express.static(process.env.PWD+'/public'));



io.on('connection',(socket)=>{
    console.log('a user connected');
    
    socket.on('disconnect',(reason)=>{
        console.log('disconnect'+reason);
        
    });
    socket.on('action',function(value){
        console.log(value);
        if(value.name=='register'){
            var addsql="INSERT INTO player(id,playername,playerpassword) VALUES (0,'"+value.accountname+"','"+value.password+"')";
            connection.query(addsql,function(err,result){
                if(err) throw err;
                console.log('1 record inserted');
            })
            
        }
        if(value.name=="login"){
            var accountname=value.accountname;
            var accountpass=value.password;
            let sql="SELECT * FROM player WHERE playername='"+accountname+"' AND playerpassword='"+accountpass+"'";
            connection.query(sql,function(err,res,fields){
                if(err) throw err;
                console.log(res,res.length);
                if(res.length>0){
                    socket.emit('action',{
                        'name':'loginstate',
                        'state':'success'
                    })
                }else{
                    socket.emit('action',{
                        'name':'loginstate',
                        'state':'failed'
                    })
                }
            })
        }
    });
});

server.listen(8808,()=>{
    console.log('listening on *:8808');
})


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
游戏回合 +
回合阶段 +
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
    //凝聚阶段
    static Part_Condensation = "Condensation";
    //移动阶段
    static Part_Move = "Move";
    //出牌阶段
    static Part_PlayHand = "PlayHand";
    //结束阶段
    static Part_Finish = "Finish";
    //属性-金
    static Part_Jin = "Jin";
    //属性-木
    static Part_Mu = "Mu";
    //属性-水
    static Part_Shui = "Shui";
    //属性-火
    static Part_Huo = "Huo";
    //属性-土
    static Part_Tu = "Tu";
}

//网络中心
class NetWorkCenter {

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

//对局玩家
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

    getHandCardList() {
        return this.handCardList;
    }
}

//地块
class Land {
    constructor(x, property) {
        this.x = x;
        this.property = property; //属性
        this.markList1 = []; //己方的标记集合
        this.markList2 = []; //对方的标记集合
    }

    getMarkList1() {
        return this.markList1;
    }

    getMarkList2() {
        return this.markList2;
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

class Mark {
    constructor(x, property, card) {
        this.name = "";
        this.text = "";
        this.refCard = card;

    }
}

//牌库
class CardLibrary {
    constructor(cardSource) {
        this.cards = [];
        this.cardSource = cardSource;
    }

    //添加一张牌到牌库
    putCard(card){
        this.cards.push(card);
    }

    //添加一张牌到牌库
    putCardAll(cardList){
        for(let i=0; i<cardList.length; i++){
            this.cards.push(cardList[i]);
        }
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
    constructor(mainControl) {
        this.mainControl = mainControl;//当前主控制器
        this.roundNum = 0;//当前回合数
        this.roundPartNum = 0;//当前阶段数
        this.roundPart = "";//当前回合阶段(凝聚、移动、出牌、结束)
    }

    //下个回合
    nextRound(){
        this.roundPart = GameStatic.Part_Condensation;
        this.roundNum++;
        this.roundPartNum = 0;
    }

    //下个阶段
    nextPart(){
        this.roundPartNum++;
        if(this.roundPartNum == 1){
            this.roundPart = GameStatic.Part_Condensation;
            this.dealPartCondensationEvent();
        }else if(this.roundPartNum == 2){
            this.roundPart = GameStatic.Part_Move;
            this.dealPartMoveEvent();
        }else if(this.roundPartNum == 3){
            this.roundPart = GameStatic.Part_PlayHand;
            this.dealPartPlayHandEvent();
        }else if(this.roundPartNum == 4){
            this.roundPart = GameStatic.Part_Finish;
            this.dealPartFinishEvent();
        }else{
            this.nextRound();
        }
    }

    //凝聚阶段事件
    dealPartCondensationEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onCondensation();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onCondensation();
            }
        }

    }

    //移动阶段事件
    dealPartMoveEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onMove();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onMove();
            }
        }
    }

    //出牌阶段事件
    dealPartPlayHandEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onPlayHand();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onPlayHand();
            }
        }
    }

    //结束阶段事件
    dealPartFinishEvent(){
        //触发所有卡牌标记的事件
        const landList = this.mainControl.landList;
        for(let i=0;i<landList.length;i++){
            const land = landList[i];
            let markList1 = land.getMarkList1();
            let markList2 = land.getMarkList2();
            for(let j=0;j<markList1.length;j++){
                markList1.events.onFinish();
            }
            for(let j=0;j<markList2.length;j++){
                markList2.events.onFinish();
            }
        }
    }
}

//主控制器
class MainControl {
    constructor() {
        this.websocket = null;//TODO websocket对象
        this.cardSource = [];//TODO 卡牌资源对象
        this.netWorkCenter = new NetWorkCenter(this);
        this.roundControl = new RoundControl(this);
        this.cardLibrary = new CardLibrary(this.cardSource);
        this.landList = [];
        this.landList.push(new Land(0, GameStatic.Part_Jin));
        this.landList.push(new Land(1, GameStatic.Part_Mu));
        this.landList.push(new Land(2, GameStatic.Part_Shui));
        this.landList.push(new Land(3, GameStatic.Part_Huo));
        this.landList.push(new Land(4, GameStatic.Part_Tu));
    }

    //游戏开始调用
    gameStart(){
        //初始化牌库
        this.cardLibrary.putCardAll(this.cardSource);

        //TODO 广播客户端游戏开始
        this.netWorkCenter.sendMsgAll();
        this.roundControl.nextRound();

    }

    //下个回合
    nextRound(){
        this.roundControl.nextRound();
    }



}