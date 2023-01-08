const { m_guihuo } = require('../Marks/5_m_guihuo.js');

let Card = require('../CardClass.js').Card;

exports.guihuo = class guihuo extends Card{
    constructor(){
        super(0,null,0,0,0,0,3,0);
        this.name="鬼火";
        this.text="当敌人受伤时，你获得1点火元素";
        this.mark=new m_guihuo();
    }

}