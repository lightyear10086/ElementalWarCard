const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server);
const SHA256=require("crypto-js/sha256");

class Block{
    constructor(index,timestamp,data,previousHash=''){
        this.index=index;
        this.previousHash=previousHash;
        this.timestamp=timestamp;
        this.data=data;
        this.hash=this.calculateHash();
    }
    calculateHash(){
        return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)).toString();
    }
}
class Blockchain{
    constructor(){
        this.chain=
    }
    createGenesisBlock(){
        return new Block(0,"01/01/2017","Genesis block","0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }
    addBlock(newBlock){
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.hash=newBlock.calculateHash();
        this.chain.push(newBlock);
    }
    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock=this.chain[i];
            const previousBlock=this.chain[i-1];

            if(currentBlock.hash!=currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash!==previousBlock.hash)
        }
    }
}

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});
 
io.on('connection',(socket)=>{
    console.log('a user connected');

    socket.on('action',function(value){
        console.log(value);
        if(value.name=='setfirst'){
            console.log(value.x,value.y);
        }
    })
})

server.listen(8888,()=>{
    console.log('listening on *:8888');
})