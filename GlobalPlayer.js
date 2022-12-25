var GameStatic=require('../Code/GameStatic').GameStatic;
var OnlinePlayerMap=require('../Code/OnlinePlayerMap').OnlinePlayerMap;
exports.GlobalPlayer=//全局玩家
class GlobalPlayer{
    constructor(playername,socket_){
        this.playername=playername;
        this.matching=false;//是否在匹配
        this.enamy=null;//(GlobalPlayer)正在对战的敌人
        this.playerSocket=socket_;
        this.duelConfirm=1;
        this.gamePlayer=null;//对局玩家
        this.beginArea=GameStatic.Part_Jin;//出生点，默认金
        OnlinePlayerMap.set(socket_.id,this);
    }
    SetArea(){
        this.playerSocket.emit('action',{
            'name':'setArea',
            'area':this.gamePlayer.area
        });
        this.enamy.playerSocket.emit('action',{
            'name':'enamySetArea',
            'area':this.gamePlayer.area
        });
    }
    MatchEnamy(enamyplayer){
        this.enamy=enamyplayer;
        this.matching=false; 
        this.playerSocket.emit('action',{
            'name':'findenamy'
        })
        this.playerSocket.emit('message',{
            'content':'已找到敌人:'+enamyplayer.playername
        })
    }
    //拒绝对战
    RejectDuel(){
        this.duelConfirm=0;
        if(this.enamy!=null){
            this.enamy.playerSocket.emit('action',{
                'name':'enamyRejectDuel'
            });
        }
        this.enamy=null;
        this.matching=false;
    }
    OffLine(){
        if(this.enamy!=null){
            this.enamy.playerSocket.emit('message',{
                'content':'enamyOffLine'
            });
        }

        OnlinePlayerMap.delete(this.playerSocket);
    }
    GameOver(){
        this.enamy=null;
        this.beginArea=GameStatic.Part_Jin;
        this.gamePlayer=null;
        this.duelConfirm=1;
        this.matching=false;
    }
}