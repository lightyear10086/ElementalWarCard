let Card = require('../CardClass.js').Card;
let m_zhouchaoganghua=require('../Marks/1_m_zhouchaoganghua').m_zhouchaoganghua;

exports.zhouchaoganghua = class zhouchaoganghua extends Card{
    constructor(){
        super(0,null,0,0,0,0,0,0);
        this.name="咒潮钢华";
        this.text="在你的凝聚阶段结束时，你+1金元素";
        this.mark=new m_zhouchaoganghua();
    }

}