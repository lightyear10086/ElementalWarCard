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
                if((value.area=='goldenarea' && PlayerSelf.gamePlayer.area==GameStatic.Part_Jin) || (value.area=='woodenarea' && PlayerSelf.gamePlayer.area==GameStatic.Part_Mu) || (value.area=='waterarea' && PlayerSelf.gamePlayer.area==GameStatic.Part_Shui) || (value.area=='firearea' && PlayerSelf.gamePlayer.area==GameStatic.Part_Huo) || (value.area=='landarea' && PlayerSelf.gamePlayer.area==GameStatic.Part_Tu)){
                    return;
                }
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
            if(PlayerSelf==null){
                console.log("玩家未创建");
                return;
            }
            let card_=PlayerSelf.gamePlayer.handCardList.find((cur,index)=>{
                return value.card=="cid_"+cur.cid;
            });
            if(card_!=null){
                console.log("card不为空");
                PlayerSelf.gamePlayer.UseCardFromHand(card_,value.grid);
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
        this.p1.gamePlayer.enamy=this.p2.gamePlayer;
        this.p2.gamePlayer.enamy=this.p1.gamePlayer;
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