exports.Effect=class Effect{
    static etypes={
        'immediately':1,
        'onhurt':2,
        'keep':3
    }
    static aimtypes={
        'gameplayer':1,
        'mark':2,
        'card':3,
        'land':4,
        'grid':5,
        'cardpackage':6,
        'grave':7,
        'any':8,
        'playerrole':9
    }
    constructor(name,type_,aimtype_){
        this.enable=true;
        this.name=name;
        this.effecttype=type_;
        this.aimtype=aimtype_;
    }
    effectFunc(){}
}