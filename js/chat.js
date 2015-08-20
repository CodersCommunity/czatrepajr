/*
	author: bartek
	date: 23:49 19-08-2015
*/

function ChatCreator(){
	this.stop = false;

	this.notifyTimeout = null;
	this.defaultTitle = document.title;
	this.toSeen = false;

	this.userID = null;
	this.lastID = 0;
	this.messages = new Map();
	this.users = new Map();
}

ChatCreator.prototype.bindDOM = function(e){
	document.getElementById('chat-input').addEventListener('keyup', function(e){
		if(e.which != 13 || document.getElementById('chat-input').value.trim().length < 2)return;
		this.sendMessage(document.getElementById('chat-input').value.trim());
	}.bind(this));
}

ChatCreator.prototype.sendMessage = function(value){
	$.post('./chat', {
		ajax_add_message: value,
		ajax_add_lastid: this.lastID
	}).done(function(res){
		if(res.contains("Nie jesteś już zalogowany.")){
			this.stop = true;
			return;
		}

		res = res.split('\n');

		if(!this.userID)
			this.userID = Number(res[1]);

		this.updateMessages(JSON.parse(res[2]));
	}).fail(function(){
		console.warn('sendMessage fail');
	});
}

ChatCreator.prototype.getMessages = function(){
	if(this.stop)return;

	$.post('./chat', {
		ajax_get_messages: this.lastID
	}).done(function(res){
		if(res.contains("Nie jesteś już zalogowany.")){
			this.stop = true;
			return;
		}

		res = res.split('\n');

		if(!this.userID)
			this.userID = Number(res[1]);

		this.updateMessages(JSON.parse(res[2]));	//lastid
		this.updateUsers(JSON.parse(res[3]));
	}).fail(function(){
		console.warn('getMessages fail');
	});

	setTimeout(this.getMessages.bind(this), 300);
}

document.addEventListener('DOMContentLoaded', function(){
	window.chat = new ChatCreator();
	chat.bindDOM();
});
