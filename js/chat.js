/*
 author: bartek
 date: 23:49 19-08-2015
 */

function Chat() {
    this.$box = document.querySelector('.min-chat__content');
    this.stop = false;
    this.url = 'http://forum.miroslawzelent.pl/chat';
    this.userID = null;
    this.lastID = localStorage.getItem('lastID') || 0;
    this.users = new Map();
    this.messages = new Set();
    this.setupCommands();
}

Chat.prototype.logger = function (name) {
    var consoleLogger = localStorage.getItem('consoleLogger') || false;
    if (consoleLogger) {
        console.log(name);
    }
};

Chat.prototype.bindDOM = function (e) {
    document.getElementById('chat-input').addEventListener('keyup', function (e) {
        if (e.which != 13 || document.getElementById('chat-input').value.trim().length < 1 || e.shiftKey)
            return;

        this.sendMessage(document.getElementById('chat-input').value.trim());
    }.bind(this));
};

Chat.prototype.systemMessage = function (value) {
    this.updateMessages([{
        postid: 0 - Math.round(Math.random() * 1000),
        userid: -1,
        username: 'System',
        posted: new Date().toISOString().substr(0, 19).split('T').join(' '),
        message: value
    }]);
};

Chat.prototype.setupCommands = function () {
    this.commands = new Map([
        [
            '/online', this.onlineCommand.bind(this)
        ]
        , [
            '/clear', this.clearCommand.bind(this)
        ]
        , [
            '/all', this.allCommand.bind(this)
        ]
    ]);
};

Chat.prototype.commandParse = function (value) {
    if (!this.commands.has(value))
        return false;

    this.commands.get(value)();
    return true;
};

Chat.prototype.updateMessages = function (arrayOfMessages) {
    arrayOfMessages = arrayOfMessages.reverse();
    arrayOfMessages.forEach(function (post) {
        if (this.messages.has(Number(post.postid)))
            return;

        this.messages.add(Number(post.postid));

        if (Number(post.postid) > this.lastID)
            this.lastID = Number(post.postid);

        this.$box.appendChild(new Message(post).getDOM());
        this.$box.scrollTop = this.$box.scrollHeight;
    }.bind(this));
    this.logger("Czatrepajr::updateMessages->" + this.lastID);
};

Chat.prototype.updateUsers = function (arrayOfUsers) {
    this.users.clear();
    arrayOfUsers.forEach(function (user) {
        this.users.set(Number(user.userid), {
            name: user.username
            , idle: (user.idle === "1")
            , level: Number(user.level)
            , kicked: Number(user.kicked)
            , kickable: Number(user.kickable)
        });
    }.bind(this));
    this.logger("Czatrepajr::updateUsers->" + this.lastID);
};

Chat.prototype.sendMessage = function (value) {

    var chatInput = document.getElementById('chat-input');
    chatInput.value = '';

    if (this.commandParse.bind(this)(value))
        return;

    chatInput.setAttribute('disabled', 'disabled');
    $.post(this.url, {
        ajax_add_message: value
        , ajax_add_lastid: this.lastID
    }).done(function (response) {
        if (response.indexOf("Nie jesteś już zalogowany.") > -1) {
            this.stop = true;
            return;
        }

        response = response.split('\n');

        if (!this.userID)
            this.userID = Number(response[1]);


        this.logger("Czatrepajr::sendMessage(done)->" + value);
        this.updateMessages([JSON.parse(response[2])]);
        chatInput.removeAttribute('disabled');
        chatInput.focus();

    }.bind(this)).fail(function () {
        chatInput.removeAttribute('disabled');
        chatInput.focus();
        this.logger("Czatrepajr::sendMessage(fail)->" + value);
    });
};

Chat.prototype.getMessages = function () {
    if (this.stop)return;
    this.getMessagesRequest();
    setTimeout(this.getMessages.bind(this), 5500);
};

Chat.prototype.getMessagesRequest = function () {

    $.post(this.url, {
        ajax_get_messages: this.lastID
    }).done(function (response) {
        if (response.indexOf("Nie jesteś już zalogowany.") > -1) {
            this.stop = true;
            return;
        }

        response = response.split('\n');
        this.userID = Number(response[1]);
        this.logger("Czatrepajr::getMessagesRequest->" + this.lastID);
        this.updateMessages(JSON.parse(response[2]));
        this.updateUsers(JSON.parse(response[3]));
    }.bind(this)).fail(function () {
        console.warn('getMessages fail');
    });

};

/*
 ==============
 Commands
 ==============
 */

Chat.prototype.onlineCommand = function () {
    var onlineUsers = '';
    for (var user of this.users.values()) {
        onlineUsers += ( onlineUsers === '' ? '' : ', ') + (user.idle ? '[i] ' : '') + user.name;
    }
    this.systemMessage('online: ' + onlineUsers);
    this.logger("COMMAND /online USED: " + onlineUsers);
};

Chat.prototype.clearCommand = function () {

    this.$box.innerHTML = '';
    this.messages.clear();
    this.logger("COMMAND /clear USED: " + this.lastID);
    localStorage["lastID"] = this.lastID;
    this.getMessagesRequest();

};

Chat.prototype.allCommand = function () {
    this.lastID = 0;
    this.messages.clear();
    this.logger("COMMAND /all USED: " + this.lastID);
    localStorage.removeItem('lastID');
    this.getMessagesRequest();
};
