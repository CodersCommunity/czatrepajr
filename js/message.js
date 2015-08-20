function Message(data){
	this.id = Number(data.postid);

	this.user = {
		id: Number(data.userid),
		name: data.username
	};

	this.value = data.message;
	this.posted = new Date(data.posted);

	this.$el = null; //after createDOM() -> div.message
}

Message.prototype.createDOM = function(){

}
