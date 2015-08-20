function Message(data){
	this.id = Number(data.postid);

	this.user = {
		id: Number(data.userid)
		,name: data.username
	};

	this.value = data.message;
	this.posted = data.posted

	this.$el = null; //after createDOM() -> div.message

	this.createDOM();
}

Message.prototype.createDOM = function(){
	this.$el = document.createElement('div');
	this.$el.setAttribute('id', 'min-message' + this.id);
	this.$el.setAttribute('title', 'Wysłano: ' + this.posted);
	this.$el.classList.add('min-message');


	var $a = this.$el.createElement('a');
		$a.setAttribute('href', this.user.name.split(' ').join('+')); //escape() is strange O_o
		$a.innerText = this.user.name;


	var $c = this.$el.createElement('span');
		$c.innerHTML = this.value;  //value is already escaped from html tags
}

Message.prototype.getDOM = function(){
	//too lame
	return this.$el;
}
