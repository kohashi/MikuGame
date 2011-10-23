//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// テキトーに書いたので参考になるコードはないお。まぁゆっくりするといいお
//　 　　　　＿＿＿_　　　　　　
//　　　　／_ノ 　 ヽ_＼　　　　
//　　 ／（ ●）　（ ●）＼　　　
//　／ ::::::⌒（__人__）⌒:::::＼　
//　|　　　　　　 ￣　　　　　 |　
//　＼ 　 　 　 　　 　　　 ／ 　
//
//
//

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
	//'./img/ruka.gif',
	'./img/ruka.png',
	
	//ミクさん音楽読み込み
	'./music/osietedaring.mp3',
	]);

	game.onload = function () {
		//game.pushScene(rootScean()); //shebangで指定があればそちらを取得
		game.rootScene.backgroundColor = '#000000';
		game.rootScene.$.addClass('stage')
		
		game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
		game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
		
		//プロンプト
		var p = new Label("point : ");p.moveTo(10,105);p.color = "white";p.$.css("font-weight","bold"); p.$.css("font-size","120%");
		game.rootScene.addChild(p);
		game.c = new Label("0");game.c.moveTo(60,106);game.c.color = "white";game.c.$.css("font-weight","bold");game.c.$.css("font-size","120%");
		game.rootScene.addChild(game.c);
		
		
		//歌詞表示
		game.w = new Label("わんつーさんしー");game.w.moveTo(10,140);game.w.color = "white";game.w.$.css("font-weight","bold");game.w.$.css("font-size","100%");
		game.rootScene.addChild(game.w);

		
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
		
		//ヒット表示
		window.hit = new Sprite(90,32);
		hit.image = game.assets['./img/hit.png'];
		hit.moveTo(52,192);
		hit.count = 0;
		game.rootScene.addChild(hit);		
		
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
		//great: [0,4,5,9,9,9,9]
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
function rmObj(obj,time){
		setTimeout(function(){
				if(obj._interval){clearInterval(obj._interval)}
			game.rootScene.removeChild(obj);
		}, time || 3000);
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



//動いてくるヤツ
Hit = enchant.Class.create(enchant.Entity, {
	initialize: function(frame) {
		enchant.Entity.call(this);
		
		this.frame = frame;
		
		//this.$.css("background",'url("./img/ruka.gif")');//アニメGIF用
		
		
		//以下PNGアニメ用
		this._child = new Sprite(64,64);
		
		this._child.image = game.assets['./img/ruka.png'];
		this.$.append(this._child.$);
		var _child = this._child;
		
		this._interval = setInterval(function(){
			_child.frame++;
		},80);
		
		
		
		this.speed = 10;
		
		this.width = 64;
		this.height = 64;
		
		

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



//フレームごとに行う処理(メインループ） #######################
var f = 1;
var arr = [];
var frameEvent = function(e) {
	//初回のみ
	if(f == 1){
		game.assets['./music/osietedaring.mp3'].play();
		var _interval = setInterval(function(){
			window.hit.$.toggle();
			if(window.hit.count++ > 3){
				clearInterval(_interval);
				game.rootScene.removeChild(window.hit);
			}
		},500);
	}
	
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
	
	if(d.t){//ボタン
		var hit = new Hit(f+13);
		hit.moveTo(20,0);
		game.rootScene.addChild(hit);rmObj(hit);
		hit.$.keyframe({
			  start: {
				top: 20, left: 0,
				},
			100: {
				top:0, left: 20,
				opacity: 1
			},
			257: {
				left: 140,
			},
			560: {
				top: 30
			},
			1300: {
				top: [256, 'easeInExpo'],
				'line-height': '60px',
				
				left: 140,
			},
			1800:{
				left : 400
			}
		});
		arr.push(hit)
	}
	if(d.p){//歌詞
		console.log("talk : " + d.p)
	}
	//終了判定
	if(d.end){
		//スコア拡大表示
		
		game.c.$.css("color","white");
		game.c.$.css("font-size","500%");
		game.c.$.css("text-shadow","2px 2px 4px pink");
		game.c.$.keyframe({
			  start: {
				  "font-size":"120%"
				  },
			  500: {"font-size":"500%"
			  }
		})
		
		setTimeout(function(){
			var score = p;
			game.end(score,'ミクちゃんとみくみくダンスして、' + score + '点で死にました');
		},2800);
	}
	
	
	
	//設定JSONおわり
}


//JSONの設定データ
var karaok = {
	/*   0 : {p:'わん、つー、さん、しー'},
	  10 : {t:1,s:10},//タイプ：１（１しかねぇ）、スピード：１０
	  
	  10 : {t:1,s:10},
	  15 : {t:1,s:10},
	  20 : {t:1,s:10},
	  25 : {t:1,s:10},
	  30 : {t:1,s:10},
	  35 : {t:1,s:10},
	  40 : {t:1,s:10},
	  50 : {t:1,s:10},
	  82 : {end:true},//終わり
	  */
	  25 : {t:1,s:10},
	  35 : {t:1,s:10},
	  45 : {t:1,s:10},
	  55 : {t:1,s:10},
	  65 : {t:1,s:10},
	  75 : {t:1,s:10},
	  85 : {t:1,s:10},
	  95 : {t:1,s:10},
	 105 : {t:1,s:10},
	 110 : {p:"わん、つー、さん、はい"},
	 112 : {t:1,s:10},
	 114 : {t:1,s:10},
	 116 : {t:1,s:10},
	 125 : {t:1,s:10},
	 135 : {t:1,s:10},
	 145 : {t:1,s:10},
	 155 : {t:1,s:10},
	 165 : {t:1,s:10},
	 175 : {t:1,s:10},
	 185 : {t:1,s:10},
	 195 : {t:1,s:10},
	 205 : {t:1,s:10},
	 215 : {t:1,s:10},
	 225 : {t:1,s:10},
	 235 : {t:1,s:10},
	 245 : {t:1,s:10},
	  25 : {t:1,s:10},
	  25 : {t:1,s:10},
	  25 : {t:1,s:10},
}






