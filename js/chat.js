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
	this.messages = new Set();

	this.commands = new Set([
		'/online'
		,'/clear'
		,'/lastid' //dev
	]);
}

ChatCreator.prototype.bindDOM = function(e){
	document.getElementById('chat-input').addEventListener('keyup', function(e){
		if(e.which != 13 || document.getElementById('chat-input').value.trim().length < 2 || e.shiftKey)return;
		this.sendMessage(document.getElementById('chat-input').value.trim());
	}.bind(this));
};

ChatCreator.prototype.systemMessage = function(val){
	this.updateMessages([{
		postid: 0 - Math.round(Math.random()*1000),
		userid: -1,
		username: 'System',
		posted: new Date().toISOString().substr(0, 19).split('T').join(' '),
		message: val
	}]);
};

ChatCreator.prototype.commandParse = function(val){
	if(!this.commands.has(val))return false;

	switch(val){
		case '/online':
			(function(){
				var a = '';
				for(var i of this.users.values()){
					a += (a===''?'':', ') + (i.idle?'[i] ':'') + i.name;
				}

				this.systemMessage('online: ' + a);
			}).apply(this);
			break;

		case '/clear':
			this.$box.innerHTML = '';
			break;

		case '/lastid':
			this.systemMessage('lastID: ' + this.lastID);
			break;
	}

	return true;
};

ChatCreator.prototype.updateMessages = function(m){
	m = m.reverse();
	m.forEach(function(i){
		if(this.messages.has(Number(i.postid)))return;

		this.messages.add(Number(i.postid));

		if(Number(i.postid) > this.lastID)this.lastID = Number(i.postid);

		this.$box.appendChild(new Message(i).getDOM());
		this.$box.scrollTop = 99999999999;
		//notify?
	}.bind(this));
};

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
};

ChatCreator.prototype.sendMessage = function(val){

	var chatInput = document.getElementById('chat-input');
	chatInput.value = '';
	chatInput.setAttribute('disabled', 'disabled');

	if(this.commandParse.bind(this)(val))return;

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
		chatInput.removeAttribute('disabled');
	}.bind(this)).fail(function(){
		console.warn('sendMessage fail');
		chatInput.removeAttribute('disabled');
	});
};

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

	setTimeout(this.getMessages.bind(this), 1500);
};

document.addEventListener('DOMContentLoaded', function(){
	window.chat = new ChatCreator();
	chat.bindDOM();
	chat.getMessages();
});
