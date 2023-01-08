const { m_jici } = require('../Marks/6_m_jici.js');


let Card = require('../CardClass.js').Card;

exports.jici = class jici extends Card{
    constructor(){
        super(0,null,0,0,0,0,3,0);
        this.name="棘刺";
        this.text="回合开始时，对敌人造成1伤害，此标记位于【金元素区】时，改为造成2伤害";
        this.mark=new m_jici();
    }

}