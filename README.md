# Czatrepajr
____

# REPOZYTORIUM NIE BĘDZIE JUŻ WSPIERANE! (Przejście na IRC)
# _Był to pierwszy projekt na forum który ujrzał światło dzienne._

____

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

(function (h, s, m, c) {
    var PATH = 'http://chat.syntax-shell.me/'
        , toLoad = 3
        , loadHandler = function () {
            if (!--toLoad)
                init();
        }
        , init = function () {
            var chat = new Chat();
            chat.bindDOM();
            chat.getMessages();
        }

    s.rel = 'stylesheet';
    s.href = PATH + 'style/main.css';

    //http://tutorials.comandeer.pl/js-dynamic.html
    m.src = PATH + 'js/message.js';
    c.src = PATH + 'js/chat.js';
    h.src = PATH + 'js/skeleton.js';

    h.addEventListener('load', loadHandler, false);
    m.addEventListener('load', loadHandler, false);
    c.addEventListener('load', loadHandler, false);


})(
    document.head.appendChild(document.createElement('script')),
    document.head.appendChild(document.createElement('link')),
    document.head.appendChild(document.createElement('script')),
    document.head.appendChild(document.createElement('script'))
);

 ```
 - **Krok 4.** Klikamy zapisz. Od tej pory chat powinien być wyświetlany na dowolnej podstronie forum.


### Zasady Pull Requestów
Wymagane informacje znajdziesz w pliku [CONTRIBUTING.MD](https://github.com/CodersCommunity/czatrepajr/blob/development/CONTRIBUTING.md)
