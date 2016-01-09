// ==UserScript==
// @name         czatRepajr
// @version      2.0
// @author       CodersCommunity
// @include      /^http:\/\/(www\.)?forum\.miroslawzelent\.pl(\/)?((?!chat).)*$/
// ==/UserScript==

(function() {
  'use strict';

  var HOST = 'http://localhost:1337/'
    , FILE = 'repajr.min.js'
    , PATH = HOST + FILE

    , script = document.createElement('script')
  ;

  script.src = PATH;
  document.head.appendChild(script);
})();
