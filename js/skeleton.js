document.body.innerHTML +=
    '<section class="min-chat"> \
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
    </section>';
