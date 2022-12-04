const { randomInt } = require('crypto');
const { ALL } = require('dns');
const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server);
var ALLPLAYERS=new Map();
class Room{
    constructor(player1,player2){
        this.player1=player1;
        this.player2=player2;
        this.MAP=new Map();
    }
}

class MapGrid{
    constructor(posx,posy){
        this.posx=posx;
        this.posy=posy;
        this.master=null;
        this.master_=null;
    }
    set master(val){
        this.master_=val;
        updateMap(val,val.enamy);
    }
    get master(){
        return this.master_;
    }
}

var MAP=new Map();
class Card{
    constructor(name,cost,des){
        this.name=name;
        this.cost=cost;
        this.des=des;
        this.master=null;
    }
    OnUse(aimgrid){}
}
class qizhi extends Card{
    constructor(){
        super("旗帜",0,"占领目标地格");
    }
    OnUse(user,aimgrid){
        aimgrid.master=user;
    }
}
var systemcards=[qizhi];
class Player{
    constructor(id,sock){
        this.id=id;
        this.sock=sock;
        ALLPLAYERS.set(id,this);
        this.enamy=null;
        this.matching=false;
        this.life=0;
        this.attackforce=1;
        this.attackforce_=1;
        this.life_=0;
        this.turn=false;
        this.active=0;
        this.active_=0;
        this.activemax=1;
        this.critrate=0;
        this.critrate_=0;
        this.nowchosedcard=null;
    }
    get critrate(){
        return this.critrate_;
    }
    set critrate(val){
        this.critrate_=val;
        this.UpdateInfo();
    }
    get active(){
        return this.active_;
    }
    set active(val){
        this.active_=val;
        this.UpdateInfo();
    }
    get attackforce(){
        return this.attackforce_;
    }
    set attackforce(val){
        this.attackforce_=val;
        this.UpdateInfo();
    }
    Exercise(){
        this.attackforce+=randomInt(1,5);
        this.critrate+=Number(Math.random().toFixed(2))/100;
    }
    GameOver(){
        this.enamy=null;
        this.matching=false;
        this.activemax=1;
    }
    Attack(){
        if(this.active>=1){
            Math.random()<=this.critrate?this.enamy.life-=this.attackforce*2:this.enamy.life-=this.attackforce;
            this.active--;
        }
    }
    UpdateInfo(){
        this.sock.emit("action",{
            'name':'updateinfo',
            'info':{
                'attackforce':this.attackforce,
                'active':this.active,
                'critrate':this.critrate
            }
        })
    }
    get life(){
        return this.life_;
    }
    set life(val){
        
        this.life_=val;
        this.sock.emit("action",{
            "name":"updatelife",
            "life":this.life
        })
        if(this.enamy!=null){
            this.enamy.sock.emit("action",{
                "name":"updateenamylife",
                "life":this.life
            })
        }else{
            return;
        }
        if(val<=0 && this.enamy.life>0){
            this.sock.emit('action',{
                'name':'gameresult',
                'res':0
            });
            this.enamy.sock.emit('action',{
                'name':'gameresult',
                'res':1
            });
            this.enamy.GameOver();
            this.GameOver();
        }else if(val<=0 && this.enamy.life<=0){
            this.sock.emit('action',{
                'name':'gameresult',
                'res':2
            });
            this.enamy.sock.emit('action',{
                'name':'gameresult',
                'res':2
            });
            this.enamy.GameOver();
            this.GameOver();
        }
    }
}
function GameRoomInit(player1,player2){
    player1.life=100;
    player2.life=100;
    if(Math.random()>0.5){
        player1.sock.emit("action",{
            "name":"turnbegin"
        });
        player1.turn=true;
        TurnBegin(player1);
    }else{
        player2.sock.emit("action",{
            "name":"turnbegin"
        });
        player2.turn=true;
        TurnBegin(player2);
    }

    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            MAP.set(i+"_"+j,new MapGrid(i,j));
        }
    }
    updateMap(player1,player2);
}
function updateMap(p1,p2){
    for(let i of MAP){
        p1.sock.emit('action',{
            'name':'syncmap',
            'grid':i[1]
        });
        p2.sock.emit('action',{
            'name':'syncmap',
            'posx':i[1].posx,
            'posy':i[1].posy,
            'master':i[1].master
        });
    }
}
function TurnBegin(player_){
    if(!player_.turn){
        return;
    }
    player_.active=player_.activemax;
    player_.sock.emit('action',{
        'name':'draw',
        'card':new systemcards[randomInt(0,systemcards.length)]()
    })
}
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/game3.html');
});

io.on('connection',(socket)=>{
    console.log('a user connected');
    socket.emit('action',{
        'name':'playerid',
        'id':socket.id
    })
    if(ALLPLAYERS.size>0){
        for(let i of ALLPLAYERS){
            console.log(i[0]);
        }
    }
    
    let PLAYER=new Player(socket.id,socket);
    socket.on('disconnect',(reason)=>{
        console.log('disconnect'+reason);
        ALLPLAYERS.delete(PLAYER.id);
        if(PLAYER.enamy!=null){
            PLAYER.enamy.sock.emit('action',{
                'name':'battlewin',
                'reason':'enamyoffline'
            });
        }
    });
    socket.on('action',function(value){
        console.log(value);
        let aname=value.name;
        if(value.name=="turnend"){
            PLAYER.turn=false;
            PLAYER.enamy.sock.emit("action",{
                'name':'turnbegin'
            });
            PLAYER.enamy.turn=true;
            TurnBegin(PLAYER.enamy);
        }
        if(value.name=='attack'){
            PLAYER.Attack();
        }
        if(value.name=='exercise'){
            PLAYER.Exercise();
        }
        if(value.name=="matchgame"){
            if(PLAYER.enamy!=null){
                return;
            }
            PLAYER.matching=!PLAYER.matching;
            for(let i of ALLPLAYERS){
                if(i[1]!=PLAYER && i[1].matching && !i[1].enamy){
                    i[1].sock.emit("action",{
                        "name":"matchenamy",
                        "id":PLAYER.id
                    });
                    PLAYER.sock.emit("action",{
                        "name":"matchenamy",
                        "id":i[1].id
                    });
                    i[1].enamy=PLAYER;
                    PLAYER.enamy=i[1];
                    GameRoomInit(PLAYER,i[1]);
                    break;
                }
            }
        }
    });
});

server.listen(8808,()=>{
    console.log('listening on *:8808');
})