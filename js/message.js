function Message(data) {
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

Message.prototype.createDOM = function() {
	var user = this.user
	,el = document.createElement('div');

	el.id = 'min-message' + this.id;
	el.title = 'Wysłano: ' + this.posted;
	el.classList.add('min-chat__content__message');

	//maybe innerHTML?
	if(user.id < 0)
		var $a = el.appendChild(document.createElement('span'));
	else
	{
		var $a = el.appendChild(document.createElement('a'));
		$a.href = 'http://forum.miroslawzelent.pl/user/' + encodeURIComponent(user.name);
	}
		$a.classList.add('min-chat__content__message__link');
		$a.innerText = user.name;


	var $c = el.appendChild(document.createElement('span'));
	$c.innerHTML = this.value;  //value is already escaped from html tags

	this.$el = el;
}

Message.prototype.getDOM = function() {
	//too lame
	return this.$el;
}
