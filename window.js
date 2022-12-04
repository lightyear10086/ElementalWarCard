class card{
    constructor(name){
        this.name=name;
        this.tag="";
        this.tapped=false;
        this.div="<div>"+name+"</div>";
    }
    tap(){
        this.tapped=true;
        this.tag="已横置";
        console.log("已横置"+this.name);
    }
    reset(){
        this.tapped=false;
    }
}

$(function(){
    var testcard=new card("测试卡牌");
    $("body").append(testcard.div);
    
})