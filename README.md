# czatrepajr

Nakładka na chat, mająca na celu umożliwienie korzystania z niego podczas przebywania w dowolnym miejscu forum.

## Instalacja
 - **Krok 1.** Instalujemy rozszerzenie do naszej przeglądarki o nazwie Tampermonkey.</br>

    ![](http://i.imgur.com/NLSSO3B.png)
 - **Krok 2.** Po instalacji na górnym pasku po prawej stronie pojawi nam się ikonka kwadratu, klikamy na nią i wybieramy opcję "Dodaj nowy skrypt..."

 - **Krok 3.** Kasujemy to co jest w edytorze i wklejamy poniższy skrypt :
 ```js
// ==UserScript==
// @name         CzatRepajr
// @version      1.0
// @author       Magic
// @include      /^http:\/\/(www\.)?forum\.miroslawzelent\.pl(\/)?((?!chat).)*$/
// ==/UserScript==

(function(s, m, c){
    //var PATH = 'http://localhost:81/mz-czatrepajr/';
    var PATH = 'http://efik.syntax-shell.me/czatrepajr/';
    

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
})(document.head.appendChild(document.createElement('link')), 
   document.head.appendChild(document.createElement('script')),
   document.head.appendChild(document.createElement('script')));
 ```
 - **Krok 4.** Klikamy zapisz. Od tej pory chat powinien być wyświetlany na dowolnej podstronie forum.


### Zasady Pull Requestów
Wymagane informacje znajdziesz w pliku [CONTRIBUTING.MD](https://github.com/CodersCommunity/czatrepajr/blob/development/CONTRIBUTING.md)
