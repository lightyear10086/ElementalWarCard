const { randomInt } = require('crypto');
var Land=require('../Code/Land').Land;
var SystemCardsDic= require('../Code/SystemCardList').SystemCardsDic;
var SystemCardList=require('../Code/SystemCardList').SystemCardList;
var CardLibrary=require('../Code/CardLibrary').CardLibrary;
var RoundControl=require('../Code/RoundControl').RoundControl;
var NetWorkCenter=require('../Code/NetWorkCenter').NetWorkCenter;
var GameStatic=require('../Code/GameStatic').GameStatic;

exports.MainControl=//主控制器
class MainControl {
    constructor(p1,p2) {
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
        this.p1=p1;
        this.p2=p2;
        //当前回合玩家
        this.roundPlayer=null;
        this.gameCardCount=0;
        this.p1.gamePlayer.GameController=this;
        this.p2.gamePlayer.GameController=this;
    }
    //给指定玩家手牌发指定牌
    putCard(p,card_,params){
        if(card_){
            this.gameCardCount++;
            p.gamePlayer.handCardList.push(card_);
            card_.cid=this.gameCardCount;
            p.gamePlayer.playerSocket.emit('action',{
                'name':'getcard',
                'card':JSON.stringify(card_)
            });
            return card_;
        }
        if(p.gamePlayer.playerCardLibrary.length<=0){
            return;
        }
        this.gameCardCount++;
        let randIndex=randomInt(0,p.gamePlayer.playerCardLibrary.length);
        card_=new SystemCardsDic[p.gamePlayer.playerCardLibrary[randIndex]]();
        card_.cid=this.gameCardCount;
        p.gamePlayer.handCardList.push(card_);
        p.playerSocket.emit('action',{
            'name':'getcard',
            'card':card_
        });
        p.gamePlayer.playerCardLibrary.splice(randIndex,1);
        return card_;
    }

    //游戏开始调用
    gameStart(p){
        //初始化牌库
        this.cardLibrary.putCardAll(this.cardSource);

        //TODO 广播客户端游戏开始
        this.netWorkCenter.sendMsgAll();
        
        if(p==this.p1){
            this.roundPlayer=this.p1;
        }else if(p==this.p2){
            this.roundPlayer=this.p2;
        }
        this.roundControl.nextRound();
    }
}