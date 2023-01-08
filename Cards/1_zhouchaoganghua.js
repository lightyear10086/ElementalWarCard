let Card = require('../CardClass.js').Card;
let m_zhouchaoganghua=require('../Marks/1_m_zhouchaoganghua').m_zhouchaoganghua;

exports.zhouchaoganghua = class zhouchaoganghua extends Card{
    constructor(){
        super(0,null,0,5,2,4,2,0);
        this.name="咒潮钢华";
        this.text="①你每移动1次，【咒潮钢华】+1维持度，获得2点金元素<br>②当你移动到【金】元素区时，对敌人造成3点伤害";
        this.mark=new m_zhouchaoganghua();
    }

}