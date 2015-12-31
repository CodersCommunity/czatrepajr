(function() {
  "use strict";

  var prefix = "min-chat"
    , section
    , header, headerTitle, headerSpan, headerIcon, headerSwitch
    , wrapper, notifyLeft, notifyJoin, content, info, fieldSet, input
  ;

  section = document.createElement( "section" );
  section.classList.add( prefix );

  header = document.createElement( "header" );
  header.classList.add( prefix + "__header" );

  headerTitle = document.createElement( "b" );
  headerTitle.classList.add( prefix + "__header__title" );

  headerSpan = document.createElement( "span" );
  headerSpan.innerHTML = "CzatRepajr";

  headerIcon = document.createElement( "img" );
  headerIcon.classList.add( prefix + "__header__icon" );
  headerIcon.src = "http://i.imgur.com/RKJMsl8.png";

  headerSwitch = document.createElement( "button" );
  headerSwitch.id = prefix + "-switch";
  headerSwitch.title = "Wyłącz";
  headerSwitch.classList.add( prefix + "__header__switch" );
  headerSwitch.innerHTML = "↓";

  wrapper = document.createElement( "div" );
  wrapper.id = prefix + "-wrapper";

  notifyLeft = document.createElement( "div" );
  notifyLeft.classList.add( prefix + "__notify", prefix + "__notify--left", prefix + "__notify--hidden" );

  notifyJoin = document.createElement("div");
  notifyJoin.classList.add( prefix + "__notify", prefix + "__notify--join", prefix + "__notify--hidden" );

  content = document.createElement( "div" );
  content.classList.add( prefix + "__content" );

  info = document.createElement( "div" );
  info.classList.add( "min-chat__info" );
  info.innerHTML = "Zaloguj się, aby dołączyć do chatu.";

  fieldSet = document.createElement( "div" );
  fieldSet.classList.add( prefix + "__fieldset" );

  input = document.createElement( "input" );
  input.type = "text";
  input.id = "chat-input"; //whether should be min-chat-input?
  input.spellcheck = true;
  input.classList.add( prefix + "__fieldset__input" );


  /* WRAPPER ELEMENTS */

  fieldSet.appendChild( input );

  content.appendChild( info );

  wrapper.appendChild( notifyLeft );
  wrapper.appendChild( notifyJoin );
  wrapper.appendChild( content );
  wrapper.appendChild( fieldSet );

  /* HEADER ELEMENTS */

  headerTitle.appendChild( headerIcon ); // i think it is not correctly
  headerTitle.appendChild( headerSpan ); // if element above has been improved it should be removed

  header.appendChild( headerTitle );
  header.appendChild( headerSwitch );

  /* SECTION ELEMENTS */

  section.appendChild( header );
  section.appendChild( wrapper );


  /* FINALLY */
  document.body.appendChild( section );
})();