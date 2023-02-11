const { m_huanjinzhefeiao } = require('../Marks/7_m_huanjinzhefeiao.js');
let Card = require('../CardClass.js').Card;

exports.huanjinzhefeiao = class huanjinzhefeiao extends Card{
    constructor(){
        super(0,null,0,0,0,0,0,0);
        this.name="唤金者菲奥";
        this.text="①唤金者菲奥只会在你移动时减少1点维持度。<br>②回合开始时，你+1金元素。<br>你手牌中所有需要消耗金元素的牌-1金元素消耗。";
        this.mark=new m_huanjinzhefeiao();
    }

}