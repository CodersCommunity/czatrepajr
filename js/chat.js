/*
 author: bartek
 date: 23:49 19-08-2015
 */

function Chat() {
    this.url = 'http://forum.miroslawzelent.pl/chat';
    this.userID = null;
    this.users = new Map();
    this.messages = new Set();
    this.toggleNamed = [['↓', 'Wyłącz'], ['↑', 'Włącz']];
    this.stop = JSON.parse(localStorage.getItem("stop"));
    this.lastID = localStorage.getItem('lastID') || 0;
    this.$box = document.querySelector('.min-chat__content');
    this.setupCommands();
    this.systemID = -1;
    this.maxScrolled = true;

    this.REQUEST_FREQUENCY = 4000; // send request every 4 seconds
}

Chat.prototype.logger = function (name) {
    var consoleLogger = localStorage.getItem('consoleLogger') || false;
    if (consoleLogger) {
        console.log(name);
    }
};

Chat.prototype.autocomplete = function (val) {
    //get last word
    var words = val.split(' ')
        , word = words[words.length - 1];

    if (word.startsWith('@') && word.length > 1) {
        for (var user of this.users.values()) {
            if (user.name.toLowerCase().startsWith(word.substr(1).toLowerCase())) {
                words[words.length - 1] = `@${user.name.split(' ').join('_')} `;
                break;
            }
        }
    }

    return words.join(' ');
};

Chat.prototype.bindDOM = function (e) {
    document.getElementById('chat-input').addEventListener('keyup', function (e) {
        if (e.which != 13 || document.getElementById('chat-input').value.trim().length < 1 || e.shiftKey)
            return;

        this.sendMessage(document.getElementById('chat-input').value.trim());
    }.bind(this));

    document.getElementById('chat-input').addEventListener('keydown', function (_this, e) {
        if (e.which === 9 && this.value.trim().length > 1) {
            e.preventDefault();
            if (this.value.trim().length === 0) return;

            var initLength = this.value.length, index;
            this.value = _this.autocomplete.call(_this, this.value);
            this.focus();

            index = this.selectionStart + this.value.length - initLength;
            this.setSelectionRange(index, index);
            this.scrollLeft = this.scrollWidth;

            return;
        }
    }.bind(document.getElementById('chat-input'), this), false);

    this.$box.addEventListener('scroll', function (_this) {
        if (this.scrollHeight - this.scrollTop !== this.clientHeight)
            _this.maxScrolled = false;
        else
            _this.maxScrolled = true;
    }.bind(this.$box, this), false);

    document.getElementById('min-chat-switch').addEventListener('click', this.toggleChat.bind(this));
};


Chat.prototype.toggleChat = function () {
    this.stop = !this.stop;
    localStorage.setItem('stop', this.stop);
    this.checkChat();

    this.logger("Czatrepajr::toggleChat -> " + this.stop);
};

Chat.prototype.checkChat = function () {
    var switchButton = document.getElementById('min-chat-switch');
    var chatWrapper = document.getElementById('min-chat-content');
    var current = +this.stop;
    switchButton.innerHTML = this.toggleNamed[current][0];
    switchButton.title = this.toggleNamed[current][1];

    if (this.stop) {
        chatWrapper.className = "min-chat__wrapper--collapsed";
    } else {
        chatWrapper.className = "";
    }
    this.logger("Czatrepajr::checkChat -> " + chatWrapper.className);
};

Chat.prototype.systemMessage = function (value) {
    this.updateMessages([{
        postid: this.systemID,
        userid: -1,
        username: 'System',
        posted: new Date().toISOString().substr(0, 19).split('T').join(' '),
        message: value
    }]);

    this.systemID--;
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

Chat.prototype.updateNotifies = function (j, l) {
    if (j.length > 0)
        document.querySelector('.min-chat__notify--join').innerText = j.join(', ') + ' ' + (j.length > 1 ? 'dołączyli' : 'dołączył') + ' do chatu.';
    if (l.length > 0)
        document.querySelector('.min-chat__notify--left').innerText = l.join(', ') + ' ' + (j.length > 1 ? 'opuścili' : 'opuścił') + ' chat.';
};

Chat.prototype.compareUsers = function (_c) {
    if (this.systemID == -1) {
        this.systemID--;
        return;
    }

    var left = [], join = [];

    for (var i of _c.keys()) {
        if (!this.users.has(i))
            left.push(_c.get(i).name);
    }

    for (var i of this.users.keys()) {
        if (!_c.has(i))
            join.push(this.users.get(i).name);
    }


    this.updateNotifies(join, left);

    //hide if empty
    if (left.length < 1) {
        document.querySelector('.min-chat__notify--left').classList.add('min-chat__notify--hidden');
    }
    else {
        document.querySelector('.min-chat__notify--left').classList.remove('min-chat__notify--hidden');
    }

    if (join.length < 1) {
        document.querySelector('.min-chat__notify--join').classList.add('min-chat__notify--hidden');
    }
    else {
        document.querySelector('.min-chat__notify--join').classList.remove('min-chat__notify--hidden');
    }

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
        if (this.maxScrolled)
            this.$box.scrollTop = this.$box.scrollHeight;
    }.bind(this));
    this.logger("Czatrepajr::updateMessages->" + this.lastID);
};

Chat.prototype.updateUsers = function (arrayOfUsers) {
    //create copy of currently users
    var _c = new Map();
    for (var i of this.users.keys())
        _c.set(i, this.users.get(i));

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

    this.compareUsers(_c);
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
    this.logger("Czatrepajr::getMessages");
    this.getMessagesRequest();

    setTimeout(this.getMessages.bind(this), this.REQUEST_FREQUENCY);
};

Chat.prototype.getMessagesRequest = function () {

    if (this.stop) {
        this.checkChat();
        return;
    }

    $.post(this.url, {
        ajax_get_messages: this.lastID
    }).done(function (response) {
        if (response.indexOf("Nie jesteś już zalogowany.") > -1) {
            document.querySelector('.min-chat__info').classList.add('min-chat__info--shown');
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
