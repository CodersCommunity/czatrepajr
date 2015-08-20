/*
	author: bartek
	date: 23:49 19-08-2015
*/

function ChatCreator(){
	this.$box = document.querySelector('#min-chat > main');

	this.stop = false;
	this.notifyTimeout = null;
	this.defaultTitle = document.title;
	this.toSeen = false;
	this.url = 'http://forum.miroslawzelent.pl/chat';

	this.userID = null;
	this.lastID = 0;
	this.users = new Map();

	this.commands = new Set([
		'/online'
		,'/clear'
		,'/lastmsg' //dev
	]);
}

ChatCreator.prototype.bindDOM = function(e){
	document.getElementById('chat-input').addEventListener('keyup', function(e){
		if(e.which != 13 || document.getElementById('chat-input').value.trim().length < 2)return;
		this.sendMessage(document.getElementById('chat-input').value.trim());
	}.bind(this));
}

ChatCreator.prototype.commandParse = function(val){
	if(!this.commands.has(val))return false;

	switch(val){
		case '/online':
			///
			break;
		case '/clear':
			this.$box.innerHTML = '';
			break;
		case '/lastmsg':
			//
			break;
	}

	return true;
}

ChatCreator.prototype.updateMessages = function(m){
	m = m.reverse();
	m.forEach(function(i){
		if(Number(i.postid) > this.lastID)
			this.lastID = Number(i.postid);

		this.$box.appendChild(new Message(i).getDOM());
		this.$box.scrollTop = 99999999999;
		//notify?
	}.bind(this));
}

ChatCreator.prototype.updateUsers = function(u){
	this.users.clear();

	u.forEach(function(o){
		this.users.set(Number(o.userid), {
			name: o.username
			,idle: (o.idle==="1")
			,level: Number(o.level)
			,kicked: Number(o.kicked) //or bool maybe?
			,kickable: Number(o.kickable) //the same? xD
		});
	}.bind(this));
}

ChatCreator.prototype.sendMessage = function(val){
	if(this.commandParse(val))return;
	document.getElementById('chat-input').value = '';

	$.post(this.url, {
		ajax_add_message: val
		,ajax_add_lastid: this.lastID
	}).done(function(res){
		if(res.indexOf("Nie jesteś już zalogowany.") > -1){
			this.stop = true;
			return;
		}

		res = res.split('\n');

		if(!this.userID)
			this.userID = Number(res[1]);

		this.updateMessages([JSON.parse(res[2])]);
	}.bind(this)).fail(function(){
		console.warn('sendMessage fail');
	});
}

ChatCreator.prototype.getMessages = function(){
	if(this.stop)return;

	$.post(this.url, {
		ajax_get_messages: this.lastID
	}).done(function(res){
		if(res.indexOf("Nie jesteś już zalogowany.") > -1){
			this.stop = true;
			return;
		}

		res = res.split('\n');

		if(!this.userID)
			this.userID = Number(res[1]);

		this.updateMessages(JSON.parse(res[2]));
		this.updateUsers(JSON.parse(res[3]));
	}.bind(this)).fail(function(){
		console.warn('getMessages fail');
	});

	setTimeout(this.getMessages.bind(this), 750);
}

document.addEventListener('DOMContentLoaded', function(){
	window.chat = new ChatCreator();
	chat.bindDOM();
	chat.getMessages();
});
