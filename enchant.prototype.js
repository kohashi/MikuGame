// need jQuery 

(function(){
/**
* enchantの中でHTML要素として画面に表示される要素に対して、
* $プロパティでjQueryオブジェクトを取り出せるようにする。 
*/

Object.defineProperty(enchant.Entity.prototype,
 '$',{ get : function () {return $(this._element);}}
);
Object.defineProperty(enchant.Scene.prototype,
 '$',{ get : function () {return $(this._element);}}
);
Object.defineProperty(enchant.Surface.prototype,
 '$',{ get : function () {return $(this._element);}}
);

/**
* 結構多そうな、オブジェクトを中央に寄せる処理。
* yプロパティの指定が無ければ画面中央、yだけ指定でx座標中央。
* y座標のみ中央は需要少ないと思うのでつけてない
*/
enchant.Entity.prototype.setCenter = function (y) {
	var x = (game.width - this.width)/2;
	var y = y || (game.height - this.height)/2;
	this.moveTo(x,y);
}
enchant.Scene.prototype.element = function () {
	return this._element;
};
enchant.Surface.prototype.element = function () {
	return this._element;
};



/**
* enchantの中でHTML要素として画面に表示される要素に対して、
* elementプロパティでelementを取り出せるようにする。 
* TODO：どう考えてもここは不要なので削除。 .element() などでつながずに ._element のプロパティで直接読めばよい
*/

enchant.Entity.prototype.element = function () {
	return this._element;
}
enchant.Scene.prototype.element = function () {
	return this._element;
};
enchant.Surface.prototype.element = function () {
	return this._element;
};

/**
* enchant.Soundオブジェクト拡張
* ループ再生機能とか
*/
enchant.Sound.prototype.loopPlay = function() {
	if (this._element){
		this._element.addEventListener('ended', function() {
			console.log(this)//audio要素？
			
			//this.currentTime = 0;
			//this.play();
		}, false);
		this._element.play();
	}
};


/**
* enchant._pushSceneの拡張：関数を渡された場合にインスタンスを返すようにオーバライド
*/
enchant.Game.prototype._pushScene  = enchant.Game.prototype.pushScene;//superメソッドを退避
enchant.Game.prototype.pushScene = function(scene) {
	return this._pushScene(typeof scene === "function"?scene():scene);//superメソッドの呼び出し
};





})();