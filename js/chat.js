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

Chat.prototype.bindDOM = function (e) {
    document.getElementById('chat-input').addEventListener('keyup', function (e) {
        if (e.which != 13 || document.getElementById('chat-input').value.trim().length < 1 || e.shiftKey)
            return;

        this.sendMessage(document.getElementById('chat-input').value.trim());
    }.bind(this));
};

Chat.prototype.systemMessage = function (val) {
    this.updateMessages([{
        postid: 0 - Math.round(Math.random() * 1000),
        userid: -1,
        username: 'System',
        posted: new Date().toISOString().substr(0, 19).split('T').join(' '),
        message: val
    }]);
};

Chat.prototype.logger = function (name) {
    var consoleLogger = localStorage.getItem('consoleLogger') || false;
    if (consoleLogger) {
        console.log(name);
    }
};

Chat.prototype.setupCommands = function () {
    this.commands = new Map([
        [
            '/online'
            , function () {
                this.onlineCommand();
            }.bind(this)
        ]
        , [
            '/clear'
            , function () {
                this.clearCommand();
            }.bind(this)
        ]
        , [
            '/all'
            , function () {
                this.allCommand();
            }.bind(this)
        ]
    ]);
};

Chat.prototype.commandParse = function (val) {
    if (!this.commands.has(val))
        return false;

    this.commands.get(val)();
    return true;
};

Chat.prototype.updateMessages = function (m) {
    m = m.reverse();
    m.forEach(function (i) {
        if (this.messages.has(Number(i.postid)))
            return;

        this.messages.add(Number(i.postid));

        if (Number(i.postid) > this.lastID)
            this.lastID = Number(i.postid);

        this.$box.appendChild(new Message(i).getDOM());
        this.$box.scrollTop = this.$box.scrollHeight;
        //notify?
    }.bind(this));
    this.logger("Czatrepajr::updateMessages->" + this.lastID);
};

Chat.prototype.updateUsers = function (u) {
    this.users.clear();
    u.forEach(function (o) {
        this.users.set(Number(o.userid), {
            name: o.username
            , idle: (o.idle === "1")
            , level: Number(o.level)
            , kicked: Number(o.kicked) //or bool maybe?
            , kickable: Number(o.kickable) //the same? xD
        });
    }.bind(this));
    this.logger("Czatrepajr::updateUsers->" + this.lastID);
};

Chat.prototype.sendMessage = function (val) {

    var chatInput = document.getElementById('chat-input');
    chatInput.value = '';

    if (this.commandParse.bind(this)(val))
        return;

    chatInput.setAttribute('disabled', 'disabled');
    $.post(this.url, {
        ajax_add_message: val
        , ajax_add_lastid: this.lastID
    }).done(function (res) {
        if (res.indexOf("Nie jesteś już zalogowany.") > -1) {
            this.stop = true;
            return;
        }

        res = res.split('\n');

        if (!this.userID)
            this.userID = Number(res[1]);

        this.updateMessages([JSON.parse(res[2])]);
        chatInput.removeAttribute('disabled');
        chatInput.focus();

        this.logger("Czatrepajr::sendMessage(done)->" + val);
    }.bind(this)).fail(function () {
        console.warn('sendMessage fail');
        chatInput.removeAttribute('disabled');
        chatInput.focus();
        this.logger("Czatrepajr::sendMessage(fail)->" + val);
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
    }).done(function (res) {
        if (res.indexOf("Nie jesteś już zalogowany.") > -1) {
            this.stop = true;
            return;
        }

        res = res.split('\n');
        this.userID = Number(res[1]);
        this.logger("Czatrepajr::getMessagesRequest->" + this.lastID);
        this.updateMessages(JSON.parse(res[2]));
        this.updateUsers(JSON.parse(res[3]));
    }.bind(this)).fail(function () {
        console.warn('getMessages fail');
    });

};

/*
 ==============
 Commands
 ==============
 */

Chat.prototype.onlineCommand = function(){
    var a = '';
    for (var i of this.users.values() )
    {
        a += (a === '' ? '' : ', ') + (i.idle ? '[i] ' : '') + i.name;
    }
    this.systemMessage('online: ' + a);
    this.logger("COMMAND /online USED: " + a);
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
