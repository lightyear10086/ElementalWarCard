const { randomInt } = require('crypto');
const { ALL } = require('dns');
const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server);
var SystemCardsDic= require('../Code/SystemCardList').SystemCardsDic;
var SystemCardList=require('../Code/SystemCardList').SystemCardList;
var OnlinePlayerMap=require('../Code/OnlinePlayerMap').OnlinePlayerMap;
var GameStatic=require('../Code/GameStatic').GameStatic;
var Player=require('../Code/PlayerClass').Player;

var GlobalPlayer=require('../Code/GlobalPlayer').GlobalPlayer;
var MainControl=require('../Code/MainControl').MainControl;


var mysql=require('mysql');
process.env.PWD=process.cwd();
var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'317406110',
    database:'elemental',
    port:'3306'
});
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
    let PlayerSelf=null;
    socket.on('disconnect',(reason)=>{
        console.log('disconnect'+reason);
        if(!PlayerSelf){
            return;
        }
        PlayerSelf.OffLine();
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
                if(res.length>0){
                    socket.emit('action',{
                        'name':'loginstate',
                        'state':'success'
                    });
                    PlayerSelf= new GlobalPlayer(accountname,socket);
                    sql="SELECT cards FROM playerallcards WHERE playername='"+accountname+"'";
                    connection.query(sql,function(err,res,fields){
                        if(err) throw err;
                        if(res.length<=0){
                            return;
                        }
                        for(let j of JSON.parse(res[0].cards)){
                            sql="SELECT id,cardname,cardinfo,cardjson,forbidden FROM cardinfo WHERE id="+parseInt(j.id);
                            connection.query(sql,function(err,res){
                                if(err) throw err;
                                socket.emit('action',{
                                    'name':'cardinfo',
                                    'card':res,
                                    'count':j.count
                                })
                            })
                        }
                    })
                }else{
                    socket.emit('action',{
                        'name':'loginstate',
                        'state':'failed'
                    })
                }
            })
        }
        if(value.name=='match'){
            console.log("玩家匹配");
            if(PlayerSelf.matching && PlayerSelf.enamy==null){
                PlayerSelf.matching=false;
                return;
            }
            PlayerSelf.matching=true;
            for(let i of OnlinePlayerMap){
                if(i[1]!=PlayerSelf && i[1].matching && i[1].enamy==null){
                    i[1].MatchEnamy(PlayerSelf);
                    PlayerSelf.MatchEnamy(i[1]);
                    break;
                }
            }
        }
        if(value.name=='duel'){
            if(value.val=='confirm'){
                PlayerSelf.duelConfirm=2;
                if(PlayerSelf.enamy!=null && PlayerSelf.enamy.duelConfirm==2){
                    var duelroom=new GameRoom(PlayerSelf,PlayerSelf.enamy);
                    duelroom.GameInit();
                }else if(PlayerSelf.enamy==null || PlayerSelf.enamy.duelConfirm==0){
                    PlayerSelf.playerSocket.emit('message',{
                        'content':'对手已离开'
                    });
                    PlayerSelf.enamy=null;
                    PlayerSelf.matching=true;
                    for(let i of OnlinePlayerMap){
                        if(i[1]!=PlayerSelf && i[1].matching && i[1].enamy==null){
                            i[1].MatchEnamy(PlayerSelf);
                            PlayerSelf.MatchEnamy(i[1]);
                            break;
                        }
                    }
                }else if(PlayerSelf.enamy!=null && PlayerSelf.enamy.duelConfirm==1){
                    PlayerSelf.playerSocket.emit('message',{
                        'content':'正在等待对手确认'
                    });
                }
            }else{
                PlayerSelf.RejectDuel();
            }
        }
        if(value.name=='next'){
            PlayerSelf.gamePlayer.GameController.roundControl.nextPart();
            if(PlayerSelf.gamePlayer.nowStepinRound==GameStatic.Part_Condensation){
                PlayerSelf.gamePlayer.nowStepinRound=GameStatic.Part_Move;
                socket.emit('action',{
                    'name':'step',
                    'step':'移动阶段'
                })
            }else if(PlayerSelf.gamePlayer.nowStepinRound==GameStatic.Part_Move){
                PlayerSelf.gamePlayer.nowStepinRound=GameStatic.Part_PlayHand;
                socket.emit('action',{
                    'name':'step',
                    'step':'出牌阶段'
                })
            }else if(PlayerSelf.gamePlayer.nowStepinRound==GameStatic.Part_PlayHand){
                
                socket.emit('action',{
                    'name':'step',
                    'step':'结束阶段'
                });
                PlayerSelf.gamePlayer.EndTurn();
            }
        }
        if(value.name=='setBornArea'){
            if(PlayerSelf.gamePlayer!=null){
                if(PlayerSelf.gamePlayer.nowStepinRound==GameStatic.Part_Move){
                    switch(value.area){
                        case 'goldenarea':
                            PlayerSelf.gamePlayer.area=GameStatic.Part_Jin;
                        break;
                        case 'woodenarea':
                            PlayerSelf.gamePlayer.area=GameStatic.Part_Mu;
                            break;
                        case 'waterarea':
                            PlayerSelf.gamePlayer.area=GameStatic.Part_Shui;
                            break;
                        case 'firearea':
                            PlayerSelf.gamePlayer.area=GameStatic.Part_Huo;
                            break;
                        case 'landarea':
                            PlayerSelf.gamePlayer.area=GameStatic.Part_Tu;
                            break;
                    }
                    PlayerSelf.SetArea();
                    return;
                }
            }

            let hassetarea='';
            switch(value.area){
                case 'goldenarea':
                    PlayerSelf.beginArea=GameStatic.Part_Jin;
                    hassetarea="金";
                break;
                case 'woodenarea':
                    PlayerSelf.beginArea=GameStatic.Part_Mu;
                    hassetarea="木";
                    break;
                case 'waterarea':
                    PlayerSelf.beginArea=GameStatic.Part_Shui;
                    hassetarea="水";
                    break;
                case 'firearea':
                    PlayerSelf.beginArea=GameStatic.Part_Huo;
                    hassetarea="火";
                    break;
                case 'landarea':
                    PlayerSelf.beginArea=GameStatic.Part_Tu;
                    hassetarea="土";
                    break;
            }
            socket.emit('tipalert',{
                'content':'你的出生点已设置为'+hassetarea
            })
        }
        if(value.name=='chosedcard'){
            console.log("玩家选中了卡牌",value.card);
            let chosedcard= PlayerSelf.gamePlayer.handCardList.find((currentval,index)=>{
                return value.card== "cid_"+currentval.cid;
            });
            
        }
        if(value.name=='usecard'){
            console.log("玩家使用卡牌",value.card,'目标区域id',value.grid);
            let card_=PlayerSelf.gamePlayer.handCardList.find((cur,index)=>{
                return value.card=="cid_"+cur.cid;
            });
            if(card_!=null){
                PlayerSelf.gamePlayer.UseCardFromHand(card_);
            }
            
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

var ALLROOMS=[];
class GameRoom{
    constructor(p1,p2){
        this.p1=p1;
        this.p2=p2;
        this.battlecontroller=null;
        
        ALLROOMS.push(this);
    }
    GameInit(){
        this.p1.gamePlayer=new Player(this.p1.playerSocket);
        this.p2.gamePlayer=new Player(this.p2.playerSocket);
        this.p1.gamePlayer.playerCardLibrary=['咒潮钢华','炽暗焰冢'];
        this.p2.gamePlayer.playerCardLibrary=['咒潮钢华','炽暗焰冢'];
        this.battlecontroller=new MainControl(this.p1,this.p2);
        //先后手
        if(randomInt(0,100)>50){
            this.p1.playerSocket.emit('action',{
                'name':'先后手',
                'val':1
            });
            this.p2.playerSocket.emit('action',{
                'name':'先后手',
                'val':0
            });
            this.battlecontroller.gameStart(this.p1);
        }else{
            this.p1.playerSocket.emit('action',{
                'name':'先后手',
                'val':0
            });
            this.p2.playerSocket.emit('action',{
                'name':'先后手',
                'val':1
            });
            this.battlecontroller.gameStart(this.p2);
        }
        this.p1.gamePlayer.area=this.p1.beginArea;
        this.p2.gamePlayer.area=this.p2.beginArea;
        this.p1.SetArea();
        this.p2.SetArea();
        this.p1.playerSocket.emit('action',{
            'name':'GameInit'
        });
        this.p2.playerSocket.emit('action',{
            'name':'GameInit'
        });
    }
    GameUpdate(){}
    GameOver(){}
}
class GameUtils {
}



// //网络中心
// class NetWorkCenter {

//     constructor(mainControl) {
//         this.init(mainControl);
//     }

//     init(mainControl) {
//         //websocket对象
//         this.websocket = mainControl.websocket;
//         if(this.websocket == undefined || this.websocket == null){
//             return;
//         }
//         this.websocket.onopen = this.events.onopen;
//         this.websocket.onmessage = this.events.onmessage;
//         this.websocket.onclose = this.events.onclose;
//         this.websocket.onerror = this.events.onerror;
//         this.messageHandle = new MessageHandle(mainControl);
//     }

//     events = {
//         onopen: function (){
//             //链接成功 TODO
//         },
//         onmessage: function (data){
//             //接收消息 TODO
//             //请求交给消息中心处理
//             this.messageHandle.handle(data);
//         },

//         onclose: function (){
//             //关闭 TODO
//         },
//         onerror: function (){
//             // websocket发生错误 TODO
//         }
//     }

//     sendMsg(msg){
//         //TODO 发送消息

//     }

//     sendMsgAll(msg){

//     }

//     close(){
//         //TODO 关闭网络
//     }
// }

// //消息中心
// class MessageHandle {

//     constructor(mainControl) {
//         this.msgQueue = [];
//         this.MessageAsync = GameStatic.MessageAsync;
//         this.mainControl = mainControl;
//     }

//     handle(data){
//         this.msgQueue.push(data);
//         if(!this.MessageAsync){
//             this.next();
//         }
//     }

//     next(){
//         if(this.msgQueue.length>0){
//             const data = this.msgQueue[0];
//             //TODO

//         }
//         this.next();
//     }


// }
// //全局玩家
// class GlobalPlayer{
//     constructor(playername,socket_){
//         this.playername=playername;
//         this.matching=false;//是否在匹配
//         this.enamy=null;//(GlobalPlayer)正在对战的敌人
//         this.playerSocket=socket_;
//         this.duelConfirm=1;
//         this.gamePlayer=null;//对局玩家
//         this.beginArea=GameStatic.Part_Jin;//出生点，默认金
//         OnlinePlayerMap.set(socket_.id,this);
//     }
//     SetArea(){
//         this.playerSocket.emit('action',{
//             'name':'setArea',
//             'area':this.gamePlayer.area
//         });
//         this.enamy.playerSocket.emit('action',{
//             'name':'enamySetArea',
//             'area':this.gamePlayer.area
//         });
//     }
//     MatchEnamy(enamyplayer){
//         this.enamy=enamyplayer;
//         this.matching=false; 
//         this.playerSocket.emit('action',{
//             'name':'findenamy'
//         })
//         this.playerSocket.emit('message',{
//             'content':'已找到敌人:'+enamyplayer.playername
//         })
//     }
//     //拒绝对战
//     RejectDuel(){
//         this.duelConfirm=0;
//         if(this.enamy!=null){
//             this.enamy.playerSocket.emit('action',{
//                 'name':'enamyRejectDuel'
//             });
//             this.enamy=null;
//             this.matching=true;
//         }
//     }
//     OffLine(){
//         if(this.enamy!=null){
//             this.enamy.playerSocket.emit('message',{
//                 'content':'enamyOffLine'
//             });
//         }

//         OnlinePlayerMap.delete(this.playerSocket);
//     }
// }
// //对局玩家
// class Player {
//     constructor(socket_) {
//         this.sock=socket_;
//         this.HP = GameStatic.HP;
//         this.pointJin = 0;
//         this.pointJin_=0;
//         this.pointMu = 0;
//         this.pointMu_=0;
//         this.pointShui = 0;
//         this.pointShui_=0;
//         this.pointHuo = 0;
//         this.pointHuo_=0;
//         this.pointTu = 0;
//         this.pointTu_=0;
//         this.area=null;
//         this.area_=null;
//         this.handCardList = new Array();
//         this.playerCardLibrary=new Array();
        
//         this.nowStepinRound=GameStatic.Part_Condensation;
//         this.GameController=null;

//         this.canCollectElement_Jin=true;//玩家是否能凝聚金元素
//         this.collectElementCount_Jin=2;//玩家在凝聚阶段能凝聚多少金元素
//         this.canCollectElement_Mu=true;//玩家是否能凝聚金元素
//         this.collectElementCount_Mu=2;//玩家在凝聚阶段能凝聚多少金元素
//         this.canCollectElement_Shui=true;//玩家是否能凝聚金元素
//         this.collectElementCount_Shui=2;//玩家在凝聚阶段能凝聚多少金元素
//         this.canCollectElement_Huo=true;//玩家是否能凝聚金元素
//         this.collectElementCount_Huo=2;//玩家在凝聚阶段能凝聚多少金元素
//         this.canCollectElement_Tu=true;//玩家是否能凝聚金元素
//         this.collectElementCount_Tu=2;//玩家在凝聚阶段能凝聚多少金元素
//     }
//     CollectElement(elementtype,count){
//         console.log("玩家位于",elementtype,GameStatic.Part_Jin);
//         if(elementtype==GameStatic.Part_Jin){
//             if(this.canCollectElement_Jin){
//                 this.pointJin+=this.collectElementCount_Jin;
//             }
//         }
//         if(elementtype==GameStatic.Part_Mu){
//             if(this.canCollectElement_Mu){
//                 this.pointMu+=this.collectElementCount_Mu;
//             }
//         }
//         if(elementtype==GameStatic.Part_Shui){
//             if(this.canCollectElement_Shui){
//                 this.pointShui+=this.collectElementCount_Shui;
//             }
//         }
//         if(elementtype==GameStatic.Part_Huo){
//             if(this.canCollectElement_Huo){
//                 this.pointHuo+=this.collectElementCount_Huo;
//             }
//         }
//         if(elementtype==GameStatic.Part_Tu){
//             if(this.canCollectElement_Tu){
//                 this.pointTu+=this.collectElementCount_Tu;
//             }
//         }
//     }

//     SyncPlayerInfo(){
//         this.sock.emit('action',{
//             'name':'sync',
//             'Jin':this.pointJin,
//             'Mu':this.pointMu,
//             'Shui':this.pointShui,
//             'Huo':this.pointHuo,
//             'Tu':this.pointTu
//         })
//     }
    
//     get pointJin(){
//         return this.pointJin_;
//     }
//     set pointJin(val){
//         this.pointJin_=val;
//         this.SyncPlayerInfo();
//     }
//     get pointMu(){
//         return this.pointMu_;
//     }
//     set pointMu(val){
//         this.pointMu_=val;
//         this.SyncPlayerInfo();
//     }
//     get pointShui(){
//         return this.pointShui_;
//     }
//     set pointShui(val){
//         this.pointShui_=val;
//         this.SyncPlayerInfo();
//     }
//     get pointHuo(){
//         return this.pointHuo_;
//     }
//     set pointHuo(val){
//         this.pointHuo_=val;
//         this.SyncPlayerInfo();
//     }
//     get pointTu(){
//         return this.pointTu_;
//     }
//     set pointTu(val){
//         this.pointTu_=val;
//         this.SyncPlayerInfo();
//     }
    
//     get area(){
//         return this.area_;
//     }
//     set area(val){
//         if(val!=null){
//             this.area_=val;
//         }
//     }

//     getHandCardList() {
//         return this.handCardList;
//     }
//     TurnBegin(){

//     }
//     EndTurn(){
//         this.GameController.roundControl.nextRound();
//     }
// }

//地块
// class Land {
//     constructor(x, property) {
//         this.x = x;
//         this.property = property; //属性
//         this.markList1 = []; //己方的标记集合
//         this.markList2 = []; //对方的标记集合
//         this.markPlayerList=[];//地块上的玩家列表
//     }

//     getMarkList1() {
//         return this.markList1;
//     }

//     getMarkList2() {
//         return this.markList2;
//     }
// }

// //牌库
// class CardLibrary {
//     constructor(cardSource) {
//         this.cards = [];
//         this.cardSource = cardSource;
//     }

//     //添加一张牌到牌库
//     putCard(card){
//         this.cards.push(card);
//     }

//     //添加一张牌到牌库
//     putCardAll(cardList){
//         for(let i=0; i<cardList.length; i++){
//             this.cards.push(cardList[i]);
//         }
//     }

//     //抽一张牌
//     getCard(){
//         const card = this.cards[this.cards.length-1];
//         this.cards.splice(this.cards.length-1, 1);
//         return card;
//     }
// }

//回合控制器
// class RoundControl {
//     constructor(mainControl) {
//         this.mainControl = mainControl;//当前主控制器
//         this.roundNum = 0;//当前回合数
//         this.roundPartNum = 0;//当前阶段数
//         this.roundPart = "";//当前回合阶段(凝聚、移动、出牌、结束)
//     }

//     //下个回合
//     nextRound(){
//         this.roundPart = GameStatic.Part_Condensation;
//         this.roundNum++;
//         this.roundPartNum = 0;
        
//         if(this.roundNum==1){
//             this.mainControl.roundPlayer.playerSocket.emit('action',{
//                 'name':'roundbegin'
//             });
//             this.mainControl.putCard(this.mainControl.roundPlayer);
//             this.mainControl.roundPlayer.enamy.playerSocket.emit('action',{
//                 'name':'notround'
//             });
//             this.mainControl.roundPlayer.nowStepinRound=GameStatic.Part_Condensation;
//             return;
//         }
//         if(this.mainControl.p1!=this.mainControl.roundPlayer){
//             this.mainControl.p2.playerSocket.emit('action',{
//                 'name':'notround'
//             });
//             this.mainControl.p1.playerSocket.emit('action',{
//                 'name':'roundbegin'
//             });
//             this.mainControl.p1.gamePlayer.nowStepinRound=GameStatic.Part_Condensation;
//             this.mainControl.roundPlayer=this.mainControl.p1;
//         }else{
//             this.mainControl.p1.playerSocket.emit('action',{
//                 'name':'notround'
//             });
//             this.mainControl.p2.playerSocket.emit('action',{
//                 'name':'roundbegin'
//             });
            
//             this.mainControl.p2.gamePlayer.nowStepinRound=GameStatic.Part_Condensation;
//             this.mainControl.roundPlayer=this.mainControl.p2;
//         }
//         this.mainControl.putCard(this.mainControl.roundPlayer);
//     }

//     //下个阶段
//     nextPart(){
//         this.roundPartNum++;
//         if(this.roundPartNum == 1){
//             this.roundPart = GameStatic.Part_Condensation;
//             this.dealPartCondensationEvent();
//         }else if(this.roundPartNum == 2){
//             this.roundPart = GameStatic.Part_Move;
//             this.dealPartMoveEvent();
//         }else if(this.roundPartNum == 3){
//             this.roundPart = GameStatic.Part_PlayHand;
//             this.dealPartPlayHandEvent();
//         }else if(this.roundPartNum == 4){
//             this.roundPart = GameStatic.Part_Finish;
//             this.dealPartFinishEvent();
//         }else{
//             this.nextRound();
//         }
//     }

//     //凝聚阶段事件
//     dealPartCondensationEvent(){
//         //触发所有卡牌标记的事件
//         const landList = this.mainControl.landList;
//         for(let i=0;i<landList.length;i++){
//             const land = landList[i];
//             let markList1 = land.getMarkList1();
//             let markList2 = land.getMarkList2();
//             for(let j=0;j<markList1.length;j++){
//                 markList1.events.onCondensation();
//             }
//             for(let j=0;j<markList2.length;j++){
//                 markList2.events.onCondensation();
//             }
//         }
//         this.mainControl.roundPlayer.gamePlayer.CollectElement(this.mainControl.roundPlayer.gamePlayer.area);
//     }

//     //移动阶段事件
//     dealPartMoveEvent(){
//         //触发所有卡牌标记的事件
//         const landList = this.mainControl.landList;
//         for(let i=0;i<landList.length;i++){
//             const land = landList[i];
//             let markList1 = land.getMarkList1();
//             let markList2 = land.getMarkList2();
//             for(let j=0;j<markList1.length;j++){
//                 markList1.events.onMove();
//             }
//             for(let j=0;j<markList2.length;j++){
//                 markList2.events.onMove();
//             }
//         }
//     }

//     //出牌阶段事件
//     dealPartPlayHandEvent(){
//         //触发所有卡牌标记的事件
//         const landList = this.mainControl.landList;
//         for(let i=0;i<landList.length;i++){
//             const land = landList[i];
//             let markList1 = land.getMarkList1();
//             let markList2 = land.getMarkList2();
//             for(let j=0;j<markList1.length;j++){
//                 markList1.events.onPlayHand();
//             }
//             for(let j=0;j<markList2.length;j++){
//                 markList2.events.onPlayHand();
//             }
//         }
//     }

//     //结束阶段事件
//     dealPartFinishEvent(){
//         //触发所有卡牌标记的事件
//         const landList = this.mainControl.landList;
//         for(let i=0;i<landList.length;i++){
//             const land = landList[i];
//             let markList1 = land.getMarkList1();
//             let markList2 = land.getMarkList2();
//             for(let j=0;j<markList1.length;j++){
//                 markList1.events.onFinish();
//             }
//             for(let j=0;j<markList2.length;j++){
//                 markList2.events.onFinish();
//             }
//         }
        
//     }
// }

// //主控制器
// class MainControl {
//     constructor(p1,p2) {
//         this.websocket = null;//TODO websocket对象
//         this.cardSource = [];//TODO 卡牌资源对象
//         this.netWorkCenter = new NetWorkCenter(this);
//         this.roundControl = new RoundControl(this);
//         this.cardLibrary = new CardLibrary(this.cardSource);
//         this.landList = [];
//         this.landList.push(new Land(0, GameStatic.Part_Jin));
//         this.landList.push(new Land(1, GameStatic.Part_Mu));
//         this.landList.push(new Land(2, GameStatic.Part_Shui));
//         this.landList.push(new Land(3, GameStatic.Part_Huo));
//         this.landList.push(new Land(4, GameStatic.Part_Tu));
//         this.p1=p1;
//         this.p2=p2;
//         //当前回合玩家
//         this.roundPlayer=null;
//         this.gameCardCount=0;
//         this.p1.gamePlayer.GameController=this;
//         this.p2.gamePlayer.GameController=this;
//     }
//     //给指定玩家手牌发指定牌
//     putCard(p,card_,params){
//         if(card_){
//             this.gameCardCount++;
//             p.gamePlayer.handCardList.push(card_);
//             card_.cid=this.gameCardCount;
//             p.gamePlayer.playerSocket.emit('action',{
//                 'name':'getcard',
//                 'card':JSON.stringify(card_)
//             });
//             return card_;
//         }
//         if(p.gamePlayer.playerCardLibrary.length<=0){
//             return;
//         }
//         this.gameCardCount++;
//         let randIndex=randomInt(0,p.gamePlayer.playerCardLibrary.length);
//         card_=new SystemCardsDic[p.gamePlayer.playerCardLibrary[randIndex]]();
//         card_.cid=this.gameCardCount;
//         p.gamePlayer.handCardList.push(card_);
//         p.playerSocket.emit('action',{
//             'name':'getcard',
//             'card':card_
//         });
//         p.gamePlayer.playerCardLibrary.splice(randIndex,1);
//         return card_;
//     }

//     //游戏开始调用
//     gameStart(p){
//         //初始化牌库
//         this.cardLibrary.putCardAll(this.cardSource);

//         //TODO 广播客户端游戏开始
//         this.netWorkCenter.sendMsgAll();
        
//         if(p==this.p1){
//             this.roundPlayer=this.p1;
//         }else if(p==this.p2){
//             this.roundPlayer=this.p2;
//         }
//         this.roundControl.nextRound();
//     }
// }