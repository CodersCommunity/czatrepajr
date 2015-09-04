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
    //var PATH = 'http://localhost:81/chatRepajr/'
    var PATH = 'http://chat.syntax-shell.me/'
    ,toLoad = 2
    ,loadHandler = function()
    {
        if(!--toLoad)
            init();
    }
    ,init = function()
    {
        var chat = new Chat();
        chat.bindDOM();
        chat.getMessages();
    }
    

    //do poprawy
$('<section class="min-chat"> \
    <header class="min-chat__header"> \
        <b class="min-chat__header__title">Czatrepajr</b> \
     <button id="min-chat-switch" class="min-chat__header__switch">Wyłącz</button> \
    </header> \
    <div id="min-chat-content"> \
        <div class="min-chat__notify min-chat__notify--left min-chat__notify--hidden"></div> \
        <div class="min-chat__notify min-chat__notify--join min-chat__notify--hidden"></div> \
        <div class="min-chat__content"></div> \
        <div class="min-chat__fieldset"> \
            <input type="text" id="chat-input" class="min-chat__fieldset__input" spellcheck="true"> \
        </div> \
  </div> \
</section>').appendTo('body');

    s.rel = 'stylesheet';
    s.href = PATH + 'style/main.css';
    
    //http://tutorials.comandeer.pl/js-dynamic.html
    m.src =  PATH + 'js/message.js';
    c.src = PATH + 'js/chat.js';

    m.addEventListener('load', loadHandler, false);
    c.addEventListener('load', loadHandler, false);
})(document.head.appendChild(document.createElement('link')), 
   document.head.appendChild(document.createElement('script')),
   document.head.appendChild(document.createElement('script')));
 ```
 - **Krok 4.** Klikamy zapisz. Od tej pory chat powinien być wyświetlany na dowolnej podstronie forum.


### Zasady Pull Requestów
Wymagane informacje znajdziesz w pliku [CONTRIBUTING.MD](https://github.com/CodersCommunity/czatrepajr/blob/development/CONTRIBUTING.md)
