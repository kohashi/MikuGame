//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// テキトーに書いたので参考になるコードはないお。まぁゆっくりするといいお
//        ＿＿＿_            
//      ／_ノ   ヽ_＼        
//    ／（●） （●）＼  ほんとテキトーだお…enchant.jsの勉強会聞きながら書いて
//  ／:::⌒（_人_）⌒::＼  その後酒飲みながら書いたお…
//  |          ￣       |  書いた環境もmacbook air と winでバラバラだしファイルもわけてねーし…
//  ＼                 ／    
//
//あと、このAAは等幅フォントで見ないと超ずれると思うお
//
//※思いつきで変数grobalにしたりしてるので、本当に参考にしちゃダメです.あと、文字列囲みはシングルクォート推奨です。
//  理由はHTMLリテラルを書きうるため。このコードでは面倒なのでダブルクォート混在してますが。
//  難易度は低め（Great判定は0.1秒刻み）にしています。理由はあまり細かく切り過ぎるとスマホで厳しくなりそうなのと
//  ムズいゲームにチャレンジよりも楽しんでプレイしてほしいこと、何より私が音ゲー苦手なのがあります（えー）。
//  音ゲー作るの初めてだったので、『こうすれば良くなるよ！』というのがあれば、コメントか
//  @hako584 までtwitterで教えてくれると嬉しいです。

// under the public domain.

//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// ＊グローバル変数
var game = null;
var log2me = "";

//＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊＊
// 起動時に実行
window.onload = function () {

	enchant();

	var ua = navigator.userAgent;
	window.musicFile = (ua.indexOf("firefox") || ua.indexOf("opera")) ? './music/osietedaring.ogg' : './music/osietedaring.mp3';
	
	game = new Game(320,320);
	game.fps = 10;
	game.time = 300;
	game.preload([
	//ミクさん画像を読み込み
	'./img/miku.png',
	'./img/point.png',
	'./img/hit.png',
	'./img/maru.png',
	//'./img/ruka.gif',
	'./img/ruka.png',
	'./img/back.png',
	
	//ミクさん音楽読み込み
	musicFile,
	]);

	game.onload = function () {
		//game.pushScene(rootScean()); //shebangで指定があればそちらを取得
		game.rootScene.backgroundColor = '#000000';
		game.rootScene.$.addClass('stage')
		var bg = new Sprite(320,320);
		bg.image = game.assets['./img/back.png'];
		game.rootScene.addChild(bg);
		
		game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
		game.rootScene.addEventListener(Event.ENTER_FRAME,frameEvent);
		
		
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
		
		
		//プロンプト
		var p = new Label("point : ");p.moveTo(10,105);p.color = "white";p.$.css("font-weight","bold"); p.$.css("font-size","120%");
		game.rootScene.addChild(p);
		game.c = new Label("0");game.c.moveTo(60,106);game.c.color = "white";game.c.$.css("font-weight","bold");game.c.$.css("font-size","120%");
		game.rootScene.addChild(game.c);
		
		
		//歌詞表示
		game.w = new Label("");game.w.moveTo(10,140);game.w.color = "white";game.w.$.css("font-weight","bold");game.w.$.css("font-size","100%");
		game.rootScene.addChild(game.w);

		
	};
	game.start();
};
function randomChose(arr){
	var rand = Math.floor(Math.random()*arr.length);
	return arr[rand];
}


var p = 0
// ログ機能：色々表示したりするよ＆画面表示 --------
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
	if(txt == "clicked"){
		console.log(f-13 +":"+ txt);log2me += f-13 +":"+ txt+"\r\n";
	}
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
		var _child =  new Sprite(64,64);
		this._child = _child;
		
		_child.image = game.assets['./img/ruka.png'];
		this.$.append(_child.$);
		_child.frame = 3;
		
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
		game.assets[window.musicFile].play();
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
				left: 130,
			},
			560: {
				top: 30
			},
			1400: {
				top: [256, 'easeInExpo'],
				'line-height': '60px',
				
				left: 130,
			},
			1800:{
				left : 400
			}
		});
		arr.push(hit)
	}
	if(d.p){//歌詞
		game.w.text =  d.p;
		game.w.$.keyframe({
			  start: {
				  "font-size":"200%"
				  },
			  500: {"font-size":"100%"
			  }
		})
		//console.log("talk : " + d.p)
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
			game.end(score,'ミクちゃんに' + score + '点で、みっくみくにされたよ！');
		},2800);
	}
	
	
	
	//設定JSONおわり
}


//JSONの設定データ
var karaok = {
	  5 : {t:1,s:10, p:"『おしえて！だぁりん！』"},
	  25 : {t:1,s:10},
	  35 : {t:1,s:10},
	  45 : {t:1,s:10, p:"うた：初音ミク"},
	  55 : {t:1,s:10},
	  65 : {t:1,s:10},
	  75 : {t:1,s:10, p:"楽曲：ソレナンテＰ"},
	  85 : {t:1,s:10},
	  95 : {t:1,s:10},
	 
	 104 : {t:1,s:10},
	 108 : {t:1,s:10},
	 112 : {t:1,s:10,p:"わん、つー、さん、はい"},//ラッシュ
	 116 : {t:1,s:10},
	 
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
	 245 : {t:1,s:10 ,p:"リルラ～♪　私の歌声は～"},
	 255 : {t:1,s:10},
	 265 : {t:1,s:10},
	 275 : {t:1,s:10},
	 285 : {t:1,s:10},
	 290 : {t:1,s:10},
	 295 : {t:1,s:10},
	 305 : {t:1,s:10},
	 315 : {t:1,s:10},
	 320 : {t:1,s:10 ,p:"ニコニコ笑顔を　みんなにあげる"},
	 325 : {t:1,s:10},
	 340 : {t:1,s:10},
	 345 : {t:1,s:10},
	 355 : {t:1,s:10},
	 365 : {t:1,s:10},
	 375 : {t:1,s:10},
	 385 : {t:1,s:10 ,p:"リルラ～♪　おしえてほしいのよ"},
	 390 : {t:1,s:10},
	 395 : {t:1,s:10},
	 405 : {t:1,s:10},
	 415 : {t:1,s:10},
	 425 : {t:1,s:10},
	 435 : {t:1,s:10 ,p:"調教してほしい　うまく歌うから"},
	 445 : {t:1,s:10},
	 455 : {t:1,s:10},
	 461 : {t:1,s:10},
	 470 : {t:1,s:10},
	 476 : {t:1,s:10},
	 
	 480 : {t:1,s:10},//ラッシュ
	 483 : {t:1,s:10},
	 485 : {t:1,s:10},
	 488 : {t:1,s:10},
	 489 : {t:1,s:10 ,p:"あ☆な☆た☆に"},
	 491 : {t:1,s:10},
	 493 : {t:1,s:10},
	 502 : {t:1,s:10},
	 507 : {t:1,s:10},
	 
	 515 : {t:1,s:10 ,p:"浜松市から　やってきた"},
	 520 : {t:1,s:10},
	 525 : {t:1,s:10},
	 530 : {t:1,s:10},
	 535 : {t:1,s:10},
	 540 : {t:1,s:10},
	 545 : {t:1,s:10},
	 
	 555 : {t:1,s:10},
	 560 : {t:1,s:10},
	 565 : {t:1,s:10},
	 570 : {t:1,s:10},
	 575 : {t:1,s:10},
	 
	 585 : {t:1,s:10 ,p:"ヤマハの技術は　世界一よ"},
	 590 : {t:1,s:10},
	 595 : {t:1,s:10},
	 600 : {t:1,s:10},
	 605 : {t:1,s:10},
	 610 : {t:1,s:10},
	 615 : {t:1,s:10},
	 
	 625 : {t:1,s:10},
	 630 : {t:1,s:10},
	 635 : {t:1,s:10 ,p:"わたしの飼い主さまは　どこ？"},
	 640 : {t:1,s:10},
	 645 : {t:1,s:10},
	 650 : {t:1,s:10},
	 655 : {t:1,s:10},
	 660 : {t:1,s:10},
	 665 : {t:1,s:10},
	 
	 675 : {t:1,s:10},
	 680 : {t:1,s:10},
	 685 : {t:1,s:10},
	 690 : {t:1,s:10 ,p:"そうよ私は　バーチャルアイドル"},
	 
	 700 : {t:1,s:10},
	 705 : {t:1,s:10},
	 710 : {t:1,s:10},
	 715 : {t:1,s:10},
	 
	 
	 723 : {t:1,s:10 ,p:"初音ミクよ"},
	 731 : {t:1,s:10},
	 739 : {t:1,s:10},
	 747 : {t:1,s:10 ,p:"よ☆ろ☆し☆く！"},
	 755 : {t:1,s:10},
	 763 : {t:1,s:10 ,p:"調教してよ　ダーリン☆おねがい"},
	 771 : {t:1,s:10},
	 779 : {t:1,s:10},
	 787 : {t:1,s:10},
	 785 : {t:1,s:10},
	 793 : {t:1,s:10},
	 801 : {t:1,s:10},
	 
	 809 : {t:1,s:10},
	 817 : {t:1,s:10 ,p:"歌をおしえて　ダーリン☆やさしく"},
	 825 : {t:1,s:10},
	 833 : {t:1,s:10},
	 841 : {t:1,s:10},
	 849 : {t:1,s:10},
	 
	 866 : {t:1,s:10 ,p:"でも・・・・・・"},
	 874 : {t:1,s:10},
	 882 : {t:1,s:10},
	 891 : {t:1,s:10 ,p:"えっちなコトバは　やめてほしいの・・・"},
	 898 : {t:1,s:10},
	 906 : {t:1,s:10},
	 914 : {t:1,s:10},
	 922 : {t:1,s:10},
	 930 : {t:1,s:10},
	 937 : {t:1,s:10},
	 946 : {t:1,s:10},
	 954 : {t:1,s:10 ,p:"だって　わたしは"},
	 962 : {t:1,s:10},
	 969 : {t:1,s:10},
	 976 : {t:1,s:10},
	 
	 982 : {t:1,s:10 ,p:"みんなのアイドル"},
	 984 : {t:1,s:10},
	 988 : {t:1,s:10},
	 990 : {t:1,s:10},
	 992 : {t:1,s:10},
	 997 : {t:1,s:10},
	1002 : {t:1,s:10},
	
	
	1010 : {t:1,s:10 ,p:"初音ミクよ☆"},
	1020 : {t:1,s:10},
	1030 : {t:1,s:10},
	1040 : {t:1,s:10},
	1050 : {t:1,s:10},
	1060 : {t:1,s:10},
	1070 : {t:1,s:10},
	1070 : {t:1,s:10},
	1080 : {t:1,s:10},
	1090 : {t:1,s:10 ,p:" "},
	1100 : {t:1,s:10},
	1110 : {t:1,s:10},
	1120 : {t:1,s:10},
	1130 : {t:1,s:10},
	1140 : {t:1,s:10},
	  
	  
	  
	1200 : {end : true}
}






