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
	game.preload([
	//ミクさん画像を読み込み
	//'face_01.png',
	//'face_02.png',
	//'face_03.png',
	//'face_04.png',
	//'face_05.png'
	'./img/miku.png',
	'./img/point.png',
	'./img/hit.png',
	'./img/maru.png',
	'./img/ruka.gif',
	
	//ミクさん音楽読み込み
	]);

	game.onload = function () {
		//game.pushScene(rootScean()); //shebangで指定があればそちらを取得
		game.rootScene.backgroundColor = '#000000';
		game.rootScene.$.addClass('stage')
		
		game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
		game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
		
		//プロンプト
		var p = new Label("point : ");p.moveTo(10,230);p.color = "white";p.$.css("font-weight","bold"); p.$.css("font-size","120%");
		game.rootScene.addChild(p);
		game.c = new Label("0");game.c.moveTo(60,231);game.c.color = "white";game.c.$.css("font-weight","bold");game.c.$.css("font-size","120%");
		game.rootScene.addChild(game.c);
		
		//クリックイベント
		game.rootScene.addEventListener(enchant.Event.TOUCH_START, touchFunc)
		//ミクさん
		window.miku = new Sprite(245,353);
		miku.image = game.assets['./img/miku.png'];
		miku.x = 130;
		game.rootScene.addChild(miku);
		//枠
		var w = new Sprite(36,36);
		//w.$.css("border","solid red 1px");
		w.image = game.assets['./img/maru.png'];
		w.moveTo(142,192);
		game.rootScene.addChild(w);
	};
	game.start();
};
function randomChose(arr){
	var rand = Math.floor(Math.random()*arr.length);
	return arr[rand];
}


var p = 0
function log(txt){
	var pd = 0;//点数
	if(txt == "great"){ 
		pd = 100;
	}else if(txt == "good"){
		pd = 30;
	}else if(txt=="bad"){
		pd = -10
	}
	p += pd;
	if(pd != 0){
		//噴出し表示
		var fukidashi = new Sprite(61,40);fukidashi.image=game.assets['./img/point.png'];;
		fukidashi.frame = txt=="great"?2:txt=="good"?1:0;
		game.rootScene.addChild(fukidashi);rmObj(fukidashi);
		fukidashi.$.keyframe({
			start: {
				top: 170, left: 180, opacity: 1
			},120: {
				top: 170, opacity: 0.9
			},1457: {
				top: 147, opacity: 0
			}
		  });
		//ミクちゃん表情
		//great: [0,4,5,9]
		//good : [0,1,2,3,7,10,13]
		//bad  : [6,8,11,12,14]
		miku.frame = randomChose(txt=="great"?[0,4,5,9]:txt=="good"?[0,1,2,3,7,10,13]:[6,8,11,12,14]);
		
		
		
		//ポイント表示
		game.c.$.css("color","red");
		game.c.$.css("text-shadow","0px 0px 0px #999");
		game.c.$.keyframe({
			  start: {
				  "font-size":"250%"
				  },
			  150: {"font-size":"120%"
			  }
		})
	}else{
		game.c.$.css("color","white");
		game.c.$.css("text-shadow","none");
	}
	
	game.c.text = p;
	console.log(f +":"+ txt)
}
function rmObj(obj){
		setTimeout(function(){
			game.rootScene.removeChild(obj);
		},3000);
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
				log("bad")
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
			game.rootScene.addChild(hit);rmObj(hit);
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

//動いてくるヤツ
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






