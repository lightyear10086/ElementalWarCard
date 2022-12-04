const { ALL } = require('dns');
const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server);
var ALLPLAYERS=new Map();

class Player{
    constructor(id,sock){
        this.id=id;
        this.sock=sock;
        ALLPLAYERS.set(id,this);
        this.enamy=null;
        this.matching=false;
    }
}
class Card{
    constructor(name,cost,effectinfo){
        this.name=name;
        this.cost=cost;
        this.effectinfo=effectinfo;
    }
    OnUse(){

    }
}
class soldier{
    constructor(id){
        this.id=id;
    }
}

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/citywar.html');
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
        if(aname=='matchgame'){
            PLAYER.matching=true;
            for(let i of ALLPLAYERS){
                if(i[1]!=PLAYER && i[1].matching && i[1].enamy==null){
                    i[1].enamy=PLAYER;
                    PLAYER.enamy=i[1];
                    socket.emit('action',{
                        'name':'matchgamestat',
                        'stat':'success',
                        'enamyid':i[0]
                    });
                    i[1].sock.emit('action',{
                        'name':'matchgamestat',
                        'stat':'success',
                        'enamyid':PLAYER.id
                    })
                    break;
                }
            }
        }
    });
});

server.listen(8808,()=>{
    console.log('listening on *:8808');
})