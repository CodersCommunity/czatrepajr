// ==UserScript==
// @name         CzatRepajr
// @version      1.0
// @author       Magic
// @include      /^http:\/\/(www\.)?forum\.miroslawzelent\.pl(\/)?((?!chat).)*$/
// ==/UserScript==

(function(s, m, c){
	//var PATH = 'http://localhost:81/mz-czatrepajr/';
	var PATH = 'http://efik.syntax-shell.me/czatrepajr/';

	var a = document.head.appendChild(document.createElement('script'));
		a.src = 'http://efik.syntax-shell.me/czatrepajr/js/chat.js';
		a.addEventListener('load', function(){
			console.log('ok');
		});

	//do poprawy
	$('<div id="min-chat"> \
		<header> \
			<b>Zminimalizowany chat</b> \
		</header> \
		<main></main> \
		<footer> \
			<input type="text" id="chat-input" spellcheck="true"/> \
		</footer> \
	</div>').appendTo('body');


	[
		['rel', 'stylesheet'],
		['type', 'text/css'],
		['href', PATH + 'style/main.css']
	].forEach(function(e){
		s.setAttribute(e[0], e[1]);
	});

	m.setAttribute('src', PATH + 'js/message.js');
	m.addEventListener('load', function(){
		c.setAttribute('src', PATH + 'js/chat.js');
		c.addEventListener('load', function(){
			window.chat = new ChatCreator();
			chat.bindDOM();
			chat.getMessages();
		});
	});
})(document.head.appendChild(document.createElement('link')), document.head.appendChild(document.createElement('script')), document.head.appendChild(document.createElement('script')));
