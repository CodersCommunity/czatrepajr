function Message(data) {
  this.id = Number(data.postid);
  this.user = {
    id: Number(data.userid)
    , name: data.username
  };
  this.value = data.message;
  this.posted = data.posted;
  this.$el = null; //after createDOM() -> div.message
  this.createDOM();
}

Message.prototype.createDOM = function () {
  var user = this.user
    , el = document.createElement('div');

  el.id = 'min-message' + this.id;
  el.title = 'Wysłano: ' + this.posted;
  el.classList.add('min-chat__content__message');

  if (user.id < 0)
    var $a = el.appendChild(document.createElement('span'));
  else {
    var $a = el.appendChild(document.createElement('a'));
    $a.href = 'http://forum.miroslawzelent.pl/user/' + encodeURIComponent(user.name);
  }
  $a.classList.add('min-chat__content__message__link');
  $a.innerHTML = user.name;


  var $c = el.appendChild(document.createElement('span'));
  var content = this.value.split(' ');
  for (var word = 0; word < content.length; word++) {
    if (content[word].startsWith('@') && content[word].length > 1) {
      var spaces = content[word].match(/_/g) || [];
      spaces = spaces.length;

      content[word] = `<b>${content[word].split('_').join(' ')}</b>`;
      word += spaces;
    }
  }

  $c.innerHTML = content.join(' ');  //value is already escaped from html tags

  this.$el = el;
};

Message.prototype.getDOM = function () {
  //too lame
  return this.$el;
};
