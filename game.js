//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊





//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// ＊グローバル変数
var game = null;


//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 起動時に実行
window.onload = function () {

    enchant();


    game = new Game(320,320);
    game.fps = 10;
    game.time = 300;
    game.preload(
    //ミクさん画像を読み込み
    //'face_01.png',
    //'face_02.png',
    //'face_03.png',
    //'face_04.png',
    //'face_05.png'
    
    //ミクさん音楽読み込み
    );

    game.onload = function () {
        //game.pushScene(rootScean()); //shebangで指定があればそちらを取得
        game.rootScene.backgroundColor = '#000000';
        game.rootScene.$.addClass('stage')
        
	    game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
	    game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
        
        //枠
        var w = new Entity();
        w.$.css("border","solid red 1px");
        w.width = 20; w.height=20;
        w.moveTo(150,200);
        game.rootScene.addChild(w);
        //プロンプト
        var p = new Label("point");p.moveTo(230);
        game.rootScene.addChild(p);
        game.c = new Label("0");game.c.moveTo(265);
        game.rootScene.addChild(game.c);
        
        //クリックイベント
        game.rootScene.addEventListener(enchant.Event.TOUCH_START, touchFunc)
    };
    game.start();
};

var p = 0
function log(txt){
	var pd = 0;//点数
	if(txt == "great"){ 
		pd = 100;
	}
	if(txt == "good"){
		pd = 30;
	}
	p += pd;
	if(pd){
		game.c.$.css("color","red");
		game.c.$.keyframe({
              start: {
				  "font-size":"200%"
                  },
              100: {"font-size":"100%"
              }
		})
	}else{
		game.c.$.css("color","black");
	}
	
    game.c.text = p;
	console.log(f +":"+ txt)
}

var touchFunc = function(e){
	log("clicked")
	if(arr.length){
		var h = arr[0];
		if(h.frame == f){
			log("great");
			arr.shift();
		}else if(h.frame < f +2 || h.frame < f - 2){
			log("good");
			arr.shift();
		}
		
	}
}

var f = 1;
var arr = [];
var frameEvent = function(e) {
        
        f++;
        //NG判定 --------
        if(arr.length){
            var h = arr[0];
            
            if(h.frame + 2== f){//2フレームオーバー
                log("over")
                arr.shift();
            }
        }
        
        //設定JSON読み込み ------
        d = karaok[f];
      if(!d) return;
      
      if(d.p){//セリフ
          console.log(d.p)
      }
      if(d.t){//ボタン
          var hit = new Hit(f+13);
          hit.moveTo(20,0);
          game.rootScene.addChild(hit);
          hit.$.keyframe({
              start: {
                  top: 20, left: 0,
                  width: 20, height:20,
                  },
              100: {
                  top:0, left: 20,
                  opacity: 1
              },
              257: {
                  left: 150,
              },
              560: {
                  top: 30
              },
              1300: {
                  top: [300, 'easeInExpo'],
                  'line-height': '60px',
                  
                  left: 150,
              },
              1500:{
                    left : 400
              }
          });
		  arr.push(hit)
      }
      //設定JSONおわり
}

//タイミングに合わせて押す感じの演出のボタン
Hit = enchant.Class.create(enchant.Entity, {
    initialize: function(frame) {
        enchant.Entity.call(this);
		
		this.frame = frame;
        
        this.$.css("border","solid 2px black");
        
        this.arrow =  new Sprite(10, 10);
        this.arrow.image = game.assets['arrow'];

        
        this.target =  new Sprite(10, 10);
        this.target.image = game.assets['target'];
        
        this.speed = 10;
        
        //この書き方OKなん？
        this.width = this.arrow.width = this.target.width = 20;
        this.height = this.arrow.height = this.target.height = 20;
        
        this.$.append(this.arrow.$);

    },
    move2 : function(x,y){
        this.tareget.moveTo(x,y);
        this.moveTo(x,y);
    
    },
    fire : function(){
    }

});


//口パクミクさんオブジェクト
enchant.OK = enchant.Class.create(enchant.Sprite, {
    initialize: function(w,h) {
        enchant.Sprite.call(this);
        this.image = game.assets['arrow'];
    },
    face: function(n){
        this.image = game.assets['face' + n + '.png'];
    }
});

//大元のシーン管理
var rootScean = function(){
    sceneMap = new Scene();
}


//どうやるか知らないがフレーム単位で呼び出されるやつ
var frameHoge = function(){
    //吹き出しすすめる
    //表情判定
    //ボタン判定
}


//JSONの設定データ
var karaok = {
        0 : {p:'わん、つー、さん、しー'},
      10 : {t:1,s:10},//タイプ：１（１しかねぇ）、スピード：１０
      
      10 : {t:1,s:10},
      15 : {t:1,s:10},
      25 : {t:1,s:10},
      35 : {t:1,s:10},
      20 : {t:1,s:10},
      30 : {t:1,s:10},
      40 : {t:1,s:10},
      50 : {t:1,s:10},
}






