const { m_tiejili } = require('../Marks/3_m_tiejili.js');

let Card = require('../CardClass.js').Card;

exports.tiejili = class tiejili extends Card{
    constructor(){
        super(0,null,0,3,0,0,0,0);
        this.name="铁蒺藜";
        this.text="【敌落】对敌人造成2点伤害";
        this.mark=new m_tiejili();
    }

}