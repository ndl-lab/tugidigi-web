(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js?!./ts/components/curation/curation-modal/curation-modal.scss":function(n,e,o){(e=n.exports=o("../node_modules/css-loader/lib/css-base.js")(!1)).push([n.i,"@import url(https://fonts.googleapis.com/css?family=Roboto);",""]),e.push([n.i,"@import url(https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanjp.min.css);",""]),e.push([n.i,'/*JPS service key colorset*/\n/* base */\n/* animation parameter settings*/\n@font-face {\n  font-family: "jpsicon";\n  src: url("/assets/fonts/icon.eot");\n  src: url("/assets/fonts/icon.eot") format("embedded-opentype"), url("/assets/fonts/icon.ttf") format("truetype"), url("/assets/fonts/icon.woff") format("woff"), url("/assets/fonts/icon.svg") format("svg");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^="icon-"],\n[class*=" icon-"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: "jpsicon" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n  [class^="icon-"].white,\n  [class*=" icon-"].white {\n    color: #fcfcfc; }\n  [class^="icon-"].red,\n  [class*=" icon-"].red {\n    color: #d30c2f; }\n  [class^="icon-"].x1,\n  [class*=" icon-"].x1 {\n    font-size: 1rem; }\n  [class^="icon-"].x1-5,\n  [class*=" icon-"].x1-5 {\n    font-size: 1.5rem; }\n  [class^="icon-"].x2,\n  [class*=" icon-"].x2 {\n    font-size: 2rem; }\n\n.icon-baseline-global:before {\n  content: "\\E935"; }\n\n.icon-baseline-org:before {\n  content: "\\E936"; }\n\n.icon-sns-fb:before {\n  content: "\\E937"; }\n\n.icon-sns-line {\n  content: "\\E938"; }\n\n.icon-sns-tw {\n  content: "\\E939"; }\n\n.icon-01:before {\n  content: "\\E900"; }\n\n.icon-02:before {\n  content: "\\E901"; }\n\n.icon-03:before {\n  content: "\\E902"; }\n\n.icon-04:before {\n  content: "\\E903"; }\n\n.icon-05:before {\n  content: "\\E904"; }\n\n.icon-06:before {\n  content: "\\E905"; }\n\n.icon-07:before {\n  content: "\\E906"; }\n\n.icon-08:before {\n  content: "\\E907"; }\n\n.icon-09:before {\n  content: "\\E908"; }\n\n.icon-10:before {\n  content: "\\E909"; }\n\n.icon-11:before {\n  content: "\\E90A"; }\n\n.icon-12:before {\n  content: "\\E90B"; }\n\n.icon-13:before {\n  content: "\\E90C"; }\n\n.icon-14:before {\n  content: "\\E90D"; }\n\n.icon-15:before {\n  content: "\\E90E"; }\n\n.icon-16:before {\n  content: "\\E90F"; }\n\n.icon-17:before {\n  content: "\\E910"; }\n\n.icon-18:before {\n  content: "\\E911"; }\n\n.icon-19:before {\n  content: "\\E912"; }\n\n.icon-20:before {\n  content: "\\E913"; }\n\n.icon-21:before {\n  content: "\\E914"; }\n\n.icon-22:before {\n  content: "\\E915"; }\n\n.icon-23:before {\n  content: "\\E916"; }\n\n.icon-24:before {\n  content: "\\E917"; }\n\n.icon-25:before {\n  content: "\\E918"; }\n\n.icon-26:before {\n  content: "\\E919"; }\n\n.icon-27:before {\n  content: "\\E91A"; }\n\n.icon-28:before {\n  content: "\\E91B"; }\n\n.icon-29:before {\n  content: "\\E91C"; }\n\n.icon-30:before {\n  content: "\\E91D"; }\n\n.icon-31:before {\n  content: "\\E91E"; }\n\n.icon-32:before {\n  content: "\\E91F"; }\n\n.icon-33:before {\n  content: "\\E920"; }\n\n.icon-34:before {\n  content: "\\E921"; }\n\n.icon-35:before {\n  content: "\\E922"; }\n\n.icon-36:before {\n  content: "\\E923"; }\n\n.icon-37:before {\n  content: "\\E924"; }\n\n.icon-38:before {\n  content: "\\E925"; }\n\n.icon-39:before {\n  content: "\\E926"; }\n\n.icon-40:before {\n  content: "\\E927"; }\n\n.icon-41:before {\n  content: "\\E928"; }\n\n.icon-42:before {\n  content: "\\E929"; }\n\n.icon-43:before {\n  content: "\\E92A"; }\n\n.icon-45:before {\n  content: "\\E92B"; }\n\n.icon-46:before {\n  content: "\\E92C"; }\n\n.icon-47:before {\n  content: "\\E92D"; }\n\n.icon-48:before {\n  content: "\\E92E"; }\n\n.icon-49:before {\n  content: "\\E92F"; }\n\n.icon-50:before {\n  content: "\\E930"; }\n\n.icon-51:before {\n  content: "\\E931"; }\n\n.icon-52:before {\n  content: "\\E932"; }\n\n.icon-53:before {\n  content: "\\E933"; }\n\n.icon-54:before {\n  content: "\\E934"; }\n\n/*JPS service key colorset*/\n/* base */\n/* animation parameter settings*/\n@font-face {\n  font-family: "jpsicon";\n  src: url("/assets/fonts/icon.eot");\n  src: url("/assets/fonts/icon.eot") format("embedded-opentype"), url("/assets/fonts/icon.ttf") format("truetype"), url("/assets/fonts/icon.woff") format("woff"), url("/assets/fonts/icon.svg") format("svg");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^="icon-"],\n[class*=" icon-"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: "jpsicon" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n  [class^="icon-"].white,\n  [class*=" icon-"].white {\n    color: #fcfcfc; }\n  [class^="icon-"].red,\n  [class*=" icon-"].red {\n    color: #d30c2f; }\n  [class^="icon-"].x1,\n  [class*=" icon-"].x1 {\n    font-size: 1rem; }\n  [class^="icon-"].x1-5,\n  [class*=" icon-"].x1-5 {\n    font-size: 1.5rem; }\n  [class^="icon-"].x2,\n  [class*=" icon-"].x2 {\n    font-size: 2rem; }\n\n.icon-baseline-global:before {\n  content: "\\E935"; }\n\n.icon-baseline-org:before {\n  content: "\\E936"; }\n\n.icon-sns-fb:before {\n  content: "\\E937"; }\n\n.icon-sns-line {\n  content: "\\E938"; }\n\n.icon-sns-tw {\n  content: "\\E939"; }\n\n.icon-01:before {\n  content: "\\E900"; }\n\n.icon-02:before {\n  content: "\\E901"; }\n\n.icon-03:before {\n  content: "\\E902"; }\n\n.icon-04:before {\n  content: "\\E903"; }\n\n.icon-05:before {\n  content: "\\E904"; }\n\n.icon-06:before {\n  content: "\\E905"; }\n\n.icon-07:before {\n  content: "\\E906"; }\n\n.icon-08:before {\n  content: "\\E907"; }\n\n.icon-09:before {\n  content: "\\E908"; }\n\n.icon-10:before {\n  content: "\\E909"; }\n\n.icon-11:before {\n  content: "\\E90A"; }\n\n.icon-12:before {\n  content: "\\E90B"; }\n\n.icon-13:before {\n  content: "\\E90C"; }\n\n.icon-14:before {\n  content: "\\E90D"; }\n\n.icon-15:before {\n  content: "\\E90E"; }\n\n.icon-16:before {\n  content: "\\E90F"; }\n\n.icon-17:before {\n  content: "\\E910"; }\n\n.icon-18:before {\n  content: "\\E911"; }\n\n.icon-19:before {\n  content: "\\E912"; }\n\n.icon-20:before {\n  content: "\\E913"; }\n\n.icon-21:before {\n  content: "\\E914"; }\n\n.icon-22:before {\n  content: "\\E915"; }\n\n.icon-23:before {\n  content: "\\E916"; }\n\n.icon-24:before {\n  content: "\\E917"; }\n\n.icon-25:before {\n  content: "\\E918"; }\n\n.icon-26:before {\n  content: "\\E919"; }\n\n.icon-27:before {\n  content: "\\E91A"; }\n\n.icon-28:before {\n  content: "\\E91B"; }\n\n.icon-29:before {\n  content: "\\E91C"; }\n\n.icon-30:before {\n  content: "\\E91D"; }\n\n.icon-31:before {\n  content: "\\E91E"; }\n\n.icon-32:before {\n  content: "\\E91F"; }\n\n.icon-33:before {\n  content: "\\E920"; }\n\n.icon-34:before {\n  content: "\\E921"; }\n\n.icon-35:before {\n  content: "\\E922"; }\n\n.icon-36:before {\n  content: "\\E923"; }\n\n.icon-37:before {\n  content: "\\E924"; }\n\n.icon-38:before {\n  content: "\\E925"; }\n\n.icon-39:before {\n  content: "\\E926"; }\n\n.icon-40:before {\n  content: "\\E927"; }\n\n.icon-41:before {\n  content: "\\E928"; }\n\n.icon-42:before {\n  content: "\\E929"; }\n\n.icon-43:before {\n  content: "\\E92A"; }\n\n.icon-45:before {\n  content: "\\E92B"; }\n\n.icon-46:before {\n  content: "\\E92C"; }\n\n.icon-47:before {\n  content: "\\E92D"; }\n\n.icon-48:before {\n  content: "\\E92E"; }\n\n.icon-49:before {\n  content: "\\E92F"; }\n\n.icon-50:before {\n  content: "\\E930"; }\n\n.icon-51:before {\n  content: "\\E931"; }\n\n.icon-52:before {\n  content: "\\E932"; }\n\n.icon-53:before {\n  content: "\\E933"; }\n\n.icon-54:before {\n  content: "\\E934"; }\n\n/* utilities */\n/* animagtion */\n/* shadow */\n/* gradation */\n/* breakpoint */\n/* typography */\n/* list page header */\n/* details page header */\n.jps-curation-modal {\n  overflow-y: auto;\n  height: 100%;\n  background: white; }\n  @media screen and (max-width: 768px) {\n    .jps-curation-modal {\n      -webkit-overflow-scrolling: touch; } }\n  @media screen and (min-width: 769px) {\n    .jps-curation-modal {\n      border-radius: 12px; } }\n  .jps-curation-modal .jps-curation-modal-image {\n    background: #f0f0f0; }\n    @media screen and (max-width: 768px) {\n      .jps-curation-modal .jps-curation-modal-image :not(.is-full) .viewer {\n        max-height: 50vh; } }\n    .jps-curation-modal .jps-curation-modal-image .jps-curation-modal-rights {\n      padding-bottom: 0.5rem;\n      padding-left: 1rem;\n      padding-right: 1rem;\n      display: flex;\n      justify-content: flex-end;\n      align-items: center; }\n      .jps-curation-modal .jps-curation-modal-image .jps-curation-modal-rights > * {\n        margin-left: 0.5rem;\n        line-height: 125%;\n        white-space: normal; }\n      .jps-curation-modal .jps-curation-modal-image .jps-curation-modal-rights .jps-curation-modal-label {\n        margin-right: 0.5rem;\n        line-height: 100%; }\n        @media screen and (max-width: 768px) {\n          .jps-curation-modal .jps-curation-modal-image .jps-curation-modal-rights .jps-curation-modal-label {\n            display: inline-block; } }\n    .jps-curation-modal .jps-curation-modal-image .jps-curation-modal-rights-type.is-dark {\n      border: none; }\n    .jps-curation-modal .jps-curation-modal-image .jps-curation-modal-rights-info {\n      background: none;\n      border: 1px solid #d9d9d9; }\n  .jps-curation-modal .jps-curation-modal-image-info {\n    position: absolute;\n    right: 0.5rem;\n    bottom: 0.5rem;\n    height: 1.5rem; }\n  .jps-curation-modal .jps-curation-modal-image-table {\n    border-bottom: 1px solid #f0f0f0; }\n    .jps-curation-modal .jps-curation-modal-image-table table {\n      width: 100%; }\n      .jps-curation-modal .jps-curation-modal-image-table table th,\n      .jps-curation-modal .jps-curation-modal-image-table table td {\n        padding: 0rem 0.5rem;\n        word-break: break-all;\n        font-family: YakuHanJP, "Roboto", sans-serif;\n        font-weight: normal;\n        color: #393939;\n        text-indent: 0; }\n      .jps-curation-modal .jps-curation-modal-image-table table tr:nth-child(even) {\n        background: #f9f9f9; }\n      .jps-curation-modal .jps-curation-modal-image-table table tr:hover {\n        background: #f0f0f0; }\n      @media screen and (min-width: 769px) {\n        .jps-curation-modal .jps-curation-modal-image-table table td {\n          width: 70%; } }\n    @media screen and (min-width: 768px) and (max-width: 1216px) {\n      .jps-curation-modal .jps-curation-modal-image-table table th,\n      .jps-curation-modal .jps-curation-modal-image-table table td {\n        display: block;\n        width: 100%; }\n      .jps-curation-modal .jps-curation-modal-image-table table th {\n        padding-bottom: 0; }\n      .jps-curation-modal .jps-curation-modal-image-table table td {\n        padding-top: 0;\n        border-bottom: 1px solid #d9d9d9; } }\n    @media screen and (max-width: 768px) {\n      .jps-curation-modal .jps-curation-modal-image-table table th,\n      .jps-curation-modal .jps-curation-modal-image-table table td {\n        display: block;\n        width: 100%; }\n      .jps-curation-modal .jps-curation-modal-image-table table th {\n        padding-bottom: 0;\n        color: #646464; }\n      .jps-curation-modal .jps-curation-modal-image-table table td {\n        padding-top: 0;\n        border-bottom: 1px solid #d9d9d9; } }\n  @media screen and (min-width: 769px) {\n    .jps-curation-modal .jps-curation-modal-content {\n      margin: 1rem; } }\n  @media screen and (max-width: 768px) {\n    .jps-curation-modal .jps-curation-modal-content {\n      margin: 0.5rem; } }\n  .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-title h1 {\n    line-height: 125%; }\n    @media screen and (min-width: 769px) {\n      .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-title h1 {\n        margin: 1rem auto 0.25rem; } }\n    @media screen and (max-width: 768px) {\n      .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-title h1 {\n        margin: 0.25rem auto 0.5rem; } }\n  .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-source {\n    line-height: 125%; }\n    @media screen and (max-width: 768px) {\n      .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-source {\n        margin: 0.25rem auto 0.5rem; } }\n  .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-description-text {\n    font-family: YakuHanJP, "Roboto", sans-serif;\n    font-weight: normal;\n    line-height: 175%;\n    color: #393939;\n    text-indent: 0;\n    margin-top: 1rem; }\n  .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-link {\n    line-height: 125%; }\n    @media screen and (min-width: 769px) {\n      .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-link {\n        margin: 0.5rem 0; } }\n    .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-link a {\n      word-break: break-all;\n      display: flex;\n      align-items: center;\n      justify-content: flex-start; }\n    .jps-curation-modal .jps-curation-modal-content .jps-curation-modal-link i {\n      margin-right: 0.25rem;\n      font-size: 1rem; }\n  .jps-curation-modal .jps-curation-modal-content .jps-item-internallink {\n    margin: 1rem auto; }\n\n.jps-modal {\n  background: #fcfcfc; }\n',""])},"../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js?!./ts/components/image-selection/image-selection-view.scss":function(n,e,o){(e=n.exports=o("../node_modules/css-loader/lib/css-base.js")(!1)).push([n.i,"@import url(https://fonts.googleapis.com/css?family=Roboto);",""]),e.push([n.i,"@import url(https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanjp.min.css);",""]),e.push([n.i,'/*JPS service key colorset*/\n/* base */\n/* animation parameter settings*/\n@font-face {\n  font-family: "jpsicon";\n  src: url("/assets/fonts/icon.eot");\n  src: url("/assets/fonts/icon.eot") format("embedded-opentype"), url("/assets/fonts/icon.ttf") format("truetype"), url("/assets/fonts/icon.woff") format("woff"), url("/assets/fonts/icon.svg") format("svg");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^="icon-"],\n[class*=" icon-"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: "jpsicon" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n  [class^="icon-"].white,\n  [class*=" icon-"].white {\n    color: #fcfcfc; }\n  [class^="icon-"].red,\n  [class*=" icon-"].red {\n    color: #d30c2f; }\n  [class^="icon-"].x1,\n  [class*=" icon-"].x1 {\n    font-size: 1rem; }\n  [class^="icon-"].x1-5,\n  [class*=" icon-"].x1-5 {\n    font-size: 1.5rem; }\n  [class^="icon-"].x2,\n  [class*=" icon-"].x2 {\n    font-size: 2rem; }\n\n.icon-baseline-global:before {\n  content: "\\E935"; }\n\n.icon-baseline-org:before {\n  content: "\\E936"; }\n\n.icon-sns-fb:before {\n  content: "\\E937"; }\n\n.icon-sns-line {\n  content: "\\E938"; }\n\n.icon-sns-tw {\n  content: "\\E939"; }\n\n.icon-01:before {\n  content: "\\E900"; }\n\n.icon-02:before {\n  content: "\\E901"; }\n\n.icon-03:before {\n  content: "\\E902"; }\n\n.icon-04:before {\n  content: "\\E903"; }\n\n.icon-05:before {\n  content: "\\E904"; }\n\n.icon-06:before {\n  content: "\\E905"; }\n\n.icon-07:before {\n  content: "\\E906"; }\n\n.icon-08:before {\n  content: "\\E907"; }\n\n.icon-09:before {\n  content: "\\E908"; }\n\n.icon-10:before {\n  content: "\\E909"; }\n\n.icon-11:before {\n  content: "\\E90A"; }\n\n.icon-12:before {\n  content: "\\E90B"; }\n\n.icon-13:before {\n  content: "\\E90C"; }\n\n.icon-14:before {\n  content: "\\E90D"; }\n\n.icon-15:before {\n  content: "\\E90E"; }\n\n.icon-16:before {\n  content: "\\E90F"; }\n\n.icon-17:before {\n  content: "\\E910"; }\n\n.icon-18:before {\n  content: "\\E911"; }\n\n.icon-19:before {\n  content: "\\E912"; }\n\n.icon-20:before {\n  content: "\\E913"; }\n\n.icon-21:before {\n  content: "\\E914"; }\n\n.icon-22:before {\n  content: "\\E915"; }\n\n.icon-23:before {\n  content: "\\E916"; }\n\n.icon-24:before {\n  content: "\\E917"; }\n\n.icon-25:before {\n  content: "\\E918"; }\n\n.icon-26:before {\n  content: "\\E919"; }\n\n.icon-27:before {\n  content: "\\E91A"; }\n\n.icon-28:before {\n  content: "\\E91B"; }\n\n.icon-29:before {\n  content: "\\E91C"; }\n\n.icon-30:before {\n  content: "\\E91D"; }\n\n.icon-31:before {\n  content: "\\E91E"; }\n\n.icon-32:before {\n  content: "\\E91F"; }\n\n.icon-33:before {\n  content: "\\E920"; }\n\n.icon-34:before {\n  content: "\\E921"; }\n\n.icon-35:before {\n  content: "\\E922"; }\n\n.icon-36:before {\n  content: "\\E923"; }\n\n.icon-37:before {\n  content: "\\E924"; }\n\n.icon-38:before {\n  content: "\\E925"; }\n\n.icon-39:before {\n  content: "\\E926"; }\n\n.icon-40:before {\n  content: "\\E927"; }\n\n.icon-41:before {\n  content: "\\E928"; }\n\n.icon-42:before {\n  content: "\\E929"; }\n\n.icon-43:before {\n  content: "\\E92A"; }\n\n.icon-45:before {\n  content: "\\E92B"; }\n\n.icon-46:before {\n  content: "\\E92C"; }\n\n.icon-47:before {\n  content: "\\E92D"; }\n\n.icon-48:before {\n  content: "\\E92E"; }\n\n.icon-49:before {\n  content: "\\E92F"; }\n\n.icon-50:before {\n  content: "\\E930"; }\n\n.icon-51:before {\n  content: "\\E931"; }\n\n.icon-52:before {\n  content: "\\E932"; }\n\n.icon-53:before {\n  content: "\\E933"; }\n\n.icon-54:before {\n  content: "\\E934"; }\n\n/*JPS service key colorset*/\n/* base */\n/* animation parameter settings*/\n@font-face {\n  font-family: "jpsicon";\n  src: url("/assets/fonts/icon.eot");\n  src: url("/assets/fonts/icon.eot") format("embedded-opentype"), url("/assets/fonts/icon.ttf") format("truetype"), url("/assets/fonts/icon.woff") format("woff"), url("/assets/fonts/icon.svg") format("svg");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^="icon-"],\n[class*=" icon-"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: "jpsicon" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n  [class^="icon-"].white,\n  [class*=" icon-"].white {\n    color: #fcfcfc; }\n  [class^="icon-"].red,\n  [class*=" icon-"].red {\n    color: #d30c2f; }\n  [class^="icon-"].x1,\n  [class*=" icon-"].x1 {\n    font-size: 1rem; }\n  [class^="icon-"].x1-5,\n  [class*=" icon-"].x1-5 {\n    font-size: 1.5rem; }\n  [class^="icon-"].x2,\n  [class*=" icon-"].x2 {\n    font-size: 2rem; }\n\n.icon-baseline-global:before {\n  content: "\\E935"; }\n\n.icon-baseline-org:before {\n  content: "\\E936"; }\n\n.icon-sns-fb:before {\n  content: "\\E937"; }\n\n.icon-sns-line {\n  content: "\\E938"; }\n\n.icon-sns-tw {\n  content: "\\E939"; }\n\n.icon-01:before {\n  content: "\\E900"; }\n\n.icon-02:before {\n  content: "\\E901"; }\n\n.icon-03:before {\n  content: "\\E902"; }\n\n.icon-04:before {\n  content: "\\E903"; }\n\n.icon-05:before {\n  content: "\\E904"; }\n\n.icon-06:before {\n  content: "\\E905"; }\n\n.icon-07:before {\n  content: "\\E906"; }\n\n.icon-08:before {\n  content: "\\E907"; }\n\n.icon-09:before {\n  content: "\\E908"; }\n\n.icon-10:before {\n  content: "\\E909"; }\n\n.icon-11:before {\n  content: "\\E90A"; }\n\n.icon-12:before {\n  content: "\\E90B"; }\n\n.icon-13:before {\n  content: "\\E90C"; }\n\n.icon-14:before {\n  content: "\\E90D"; }\n\n.icon-15:before {\n  content: "\\E90E"; }\n\n.icon-16:before {\n  content: "\\E90F"; }\n\n.icon-17:before {\n  content: "\\E910"; }\n\n.icon-18:before {\n  content: "\\E911"; }\n\n.icon-19:before {\n  content: "\\E912"; }\n\n.icon-20:before {\n  content: "\\E913"; }\n\n.icon-21:before {\n  content: "\\E914"; }\n\n.icon-22:before {\n  content: "\\E915"; }\n\n.icon-23:before {\n  content: "\\E916"; }\n\n.icon-24:before {\n  content: "\\E917"; }\n\n.icon-25:before {\n  content: "\\E918"; }\n\n.icon-26:before {\n  content: "\\E919"; }\n\n.icon-27:before {\n  content: "\\E91A"; }\n\n.icon-28:before {\n  content: "\\E91B"; }\n\n.icon-29:before {\n  content: "\\E91C"; }\n\n.icon-30:before {\n  content: "\\E91D"; }\n\n.icon-31:before {\n  content: "\\E91E"; }\n\n.icon-32:before {\n  content: "\\E91F"; }\n\n.icon-33:before {\n  content: "\\E920"; }\n\n.icon-34:before {\n  content: "\\E921"; }\n\n.icon-35:before {\n  content: "\\E922"; }\n\n.icon-36:before {\n  content: "\\E923"; }\n\n.icon-37:before {\n  content: "\\E924"; }\n\n.icon-38:before {\n  content: "\\E925"; }\n\n.icon-39:before {\n  content: "\\E926"; }\n\n.icon-40:before {\n  content: "\\E927"; }\n\n.icon-41:before {\n  content: "\\E928"; }\n\n.icon-42:before {\n  content: "\\E929"; }\n\n.icon-43:before {\n  content: "\\E92A"; }\n\n.icon-45:before {\n  content: "\\E92B"; }\n\n.icon-46:before {\n  content: "\\E92C"; }\n\n.icon-47:before {\n  content: "\\E92D"; }\n\n.icon-48:before {\n  content: "\\E92E"; }\n\n.icon-49:before {\n  content: "\\E92F"; }\n\n.icon-50:before {\n  content: "\\E930"; }\n\n.icon-51:before {\n  content: "\\E931"; }\n\n.icon-52:before {\n  content: "\\E932"; }\n\n.icon-53:before {\n  content: "\\E933"; }\n\n.icon-54:before {\n  content: "\\E934"; }\n\n/* utilities */\n/* animagtion */\n/* shadow */\n/* gradation */\n/* breakpoint */\n/* typography */\n/* list page header */\n/* details page header */\n.jps-image-selection {\n  background: #d9d9d9;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  display: flex;\n  justify-content: center;\n  align-items: center; }\n  .jps-image-selection .jps-image-selection-loading .jps-spinner {\n    height: 2rem;\n    width: 2rem;\n    animation: rotate 0.8s infinite linear;\n    border: 2px solid #fff;\n    border-right-color: transparent;\n    border-radius: 50%; }\n\n@keyframes rotate {\n  0% {\n    transform: rotate(0deg); }\n  100% {\n    transform: rotate(360deg); } }\n  .jps-image-selection .img-cont {\n    overflow: hidden; }\n  .jps-image-selection .jps-image-selection-info {\n    position: absolute;\n    right: 0px;\n    bottom: 0px;\n    background: rgba(255, 255, 255, 0.8);\n    padding: 0.2rem; }\n    .jps-image-selection .jps-image-selection-info:hover {\n      background: rgba(255, 255, 255, 0.95);\n      transition: 0.15s ease-in-out; }\n    .jps-image-selection .jps-image-selection-info .jps-image-selection-title {\n      font-size: 0.8rem;\n      padding: 0.25rem;\n      line-height: 1rem; }\n      @media screen and (max-width: 768px) {\n        .jps-image-selection .jps-image-selection-info .jps-image-selection-title {\n          line-height: 1.2rem;\n          font-size: 0.7rem;\n          text-align: right; } }\n  .jps-image-selection _:-ms-lang(x)::-ms-backdrop,\n  .jps-image-selection .jps-no-img {\n    width: 100%; }\n\n.jps-img-tip {\n  text-align: left; }\n  .jps-img-tip h4 {\n    font-weight: bold; }\n  .jps-img-tip h4,\n  .jps-img-tip p,\n  .jps-img-tip a {\n    color: white; }\n',""])},"./ts/components/curation/curation-modal/curation-modal.html":function(n,e){n.exports='<div class="jps-curation-modal jps-modal" :class="{\'has-image\':hasImage}"> <div class=jps-curation-modal-image v-if=hasImage> <iiif-viewer v-if=hasImage ref=viewer></iiif-viewer> <div class="jps-curation-modal-rights is-size-7" v-if=info.rightsType||info.rights> <a class="jps-curation-modal-rights-type tag is-dark" v-if=info.rightsType v-tooltip=$cdesc(rightsCode,info.rightsType)> {{ $c(rightsCode, info.rightsType) }} </a> <span class="jps-curation-modal-rights-info tag" v-if=info.rights v-html=$ls(info.rights)></span> <db-span v-else-if="info.type===\'item\' && info.data" :id=info.data.common.database> <template slot-scope=sp> <template v-if=sp.db.contentsRightsType v-html=sp.db.contentsRightsType></template> </template> </db-span> </div> </div> <div class=jps-curation-modal-content> <div class=jps-curation-modal-title> <h1 class="is-size-4-desktop is-size-5-touch has-text-left"> {{ $ls(info.title) }} </h1> </div> <p class="jps-curation-modal-source is-size-7"> <template v-if=info.source> {{ $ls(info.source) }} </template> <template v-else-if="info.type===\'item\' && info.data"> <span v-if=info.data.common.provider>{{ info.data.common.provider }}/</span> <db-span :id=info.data.common.database></db-span> </template> <template v-else-if=info.ownerOrgId> <org-span :id=info.ownerOrgId></org-span> </template> </p> <p class="jps-curation-modal-link button is-rounded is-size-7" v-if=info.link> <a :href=info.link v-target> <span>{{ $l("l-open-url") }}</span> <i class="material-icons is-small notranslate" aria-hidden=true> exit_to_app </i> </a> </p> <interact-panel v-if=info.data :type=info.type :data=info.data class=has-text-centered></interact-panel> <div class=jps-curation-modal-description> <p v-if=info.description class="jps-curation-modal-description-text is-size-6-desktop is-size-7-touch"> {{ $ls(info.description) }} </p> <div class=jps-item-meta v-if=label> <item-metatable :label=label :item=info.data></item-metatable> </div> </div> <div v-if=info.internalLink class="has-text-centered jps-item-internallink"> <span> <a class="button is-openurl is-rounded" :href=info.internalLink v-target>{{ $l("l-see-detail") }}</a> </span> </div> </div> </div> '},"./ts/components/curation/curation-modal/curation-modal.scss":function(n,e,o){var t=o("../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js?!./ts/components/curation/curation-modal/curation-modal.scss");"string"==typeof t&&(t=[[n.i,t,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};o("../node_modules/style-loader/lib/addStyles.js")(t,i);t.locals&&(n.exports=t.locals)},"./ts/components/curation/curation-modal/curation-modal.ts":function(n,e,o){"use strict";o.d(e,"b",function(){return v});var t=o("../node_modules/tslib/tslib.es6.js"),i=o("./ts/components/database/db-span.ts"),s=o("./ts/components/generic/iiif-viewer/iiif-viewer.ts"),c=o("./ts/components/generic/interact-panel/interact-panel.ts"),a=o("./ts/components/image-selection/image-selection-view.ts"),r=o("./ts/components/item/item-metatable/item-metatable.ts"),l=o("./ts/components/organization/org-span.ts"),f=o("./ts/domain/code.ts"),m=o("./ts/domain/item-utils.ts"),d=o("./ts/service/database-service.ts"),p=o("./ts/utils/iiif-utils.ts"),u=o("./ts/utils/logger.ts"),b=o("../node_modules/vue/dist/vue.common.js"),g=o.n(b),h=o("../node_modules/vue-class-component/dist/vue-class-component.common.js"),E=o.n(h),j=o("../node_modules/vue-property-decorator/lib/vue-property-decorator.js");o("./ts/components/curation/curation-modal/curation-modal.scss");function v(n){return{image:n,title:n.title,description:n.description,link:n.sourceUrl,source:n.source,rights:n.contentsRights,rightsType:n.contentsRightsType}}var y=function(n){function e(){var e=null!==n&&n.apply(this,arguments)||this;return e.label=null,e.rightsCode=f.d,e}return t.d(e,n),Object.defineProperty(e.prototype,"isIiif",{get:function(){return!(!this.info.image||!this.info.image.infoJsonUrl)||(!(!this.info.image||"UPLOAD"!==this.info.image.imgType)||!(!this.info.data||!this.info.data.common.iiifUrl))},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"hasImage",{get:function(){return this.isIiif||this.info.image&&null!=this.info.image.url},enumerable:!0,configurable:!0}),e.prototype.created=function(){return t.b(this,void 0,void 0,function(){var n;return t.e(this,function(e){switch(e.label){case 0:return this.$registerComponentLang(w),"item"!==this.info.type?[3,2]:(n=this,[4,Object(d.l)(this.info.data.common.database)]);case 1:n.label=e.sent(),e.label=2;case 2:return[2]}})})},Object.defineProperty(e.prototype,"viewer",{get:function(){return this.$refs.viewer},enumerable:!0,configurable:!0}),e.prototype.getValue=function(n,e){return Object(m.d)(n,e.fields)},e.prototype.mounted=function(){var n=this;this.hasImage&&this.$nextTick(function(){n.info.image?n.info.image.infoJsonUrl?n.viewer.setManifest(n.info.image.url,n.info.image.infoJsonUrl):"UPLOAD"===n.info.image.imgType?n.viewer.setInfo(Object(p.d)(n.info.image.contentId,n.info.image.imageId)):n.info.image.url&&n.viewer.setUrl(n.info.image.url):n.info.data&&n.info.data.common.iiifUrl&&n.viewer.setManifest(n.info.data.common.iiifUrl)}),Object(u.addEvent)({t:"m",e:this.info.type,r:this.info.data?this.info.data.id:this.info.title.ja})},t.c([Object(j.a)(),t.f("design:type",Object)],e.prototype,"info",void 0),t.c([Object(j.a)(),t.f("design:type",Object)],e.prototype,"cs",void 0),e=t.c([E()({name:"CurationModal",template:o("./ts/components/curation/curation-modal/curation-modal.html"),components:{ImageSelectionView:a.a,IiifViewer:s.a,ItemMetatable:r.a,InteractPanel:c.a,DbSpan:i.a,OrgSpan:l.a}})],e)}(g.a);e.a=y;var w={"l-open-url":{ja:"URLを開く",en:"Open URL"},"l-rights":{ja:"この画像の権利情報",en:"Rights of this image"},"l-see-detail":{ja:"詳細を見る",en:"See details"},"l-source":{ja:"出典",en:"Source"}}},"./ts/components/image-selection/image-selection-view.html":function(n,e){n.exports="<div class=jps-image-selection v-if=show> <div v-if=isEmpty><img class=jps-no-img :src=noimageSrc /></div> <template v-else> <div v-show=!loaded class=jps-image-selection-loading> <div class=jps-spinner></div> </div> <div v-show=error><img :src=noimageSrc /></div> <div v-if=src v-hovertip=imgTip v-show=loaded&&!error class=img-cont :style=imgContStyle> <img :src=src @load=imgloaded @error=imgerror :style=imgStyle /> <div class=jps-image-selection-info v-if=info> <div class=jps-image-selection-title> {{ $ls(title) }} / {{ $ls(attribution) }} </div> </div> </div> </template> </div> "},"./ts/components/image-selection/image-selection-view.scss":function(n,e,o){var t=o("../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js?!./ts/components/image-selection/image-selection-view.scss");"string"==typeof t&&(t=[[n.i,t,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};o("../node_modules/style-loader/lib/addStyles.js")(t,i);t.locals&&(n.exports=t.locals)},"./ts/components/image-selection/image-selection-view.ts":function(n,e,o){"use strict";var t=o("../node_modules/tslib/tslib.es6.js"),i=o("./ts/utils/iiif-utils.ts"),s=o("../node_modules/vue/dist/vue.common.js"),c=o.n(s),a=o("../node_modules/vue-class-component/dist/vue-class-component.common.js"),r=o.n(a),l=o("../node_modules/vue-property-decorator/lib/vue-property-decorator.js"),f=(o("./ts/components/image-selection/image-selection-view.scss"),o("../node_modules/throttle-debounce/dist/index.esm.js")),m=o("./ts/domain/code.ts"),d=o("./ts/utils/objects.ts"),p=o("../node_modules/element-resize-event/index.js"),u=function(n){function e(){var e=null!==n&&n.apply(this,arguments)||this;return e.wv=0,e.hv=0,e.src=null,e.scale=1,e.loaded=!1,e.error=!1,e}return t.d(e,n),Object.defineProperty(e.prototype,"noimageSrc",{get:function(){return"/assets/img/no-image/"+this.type+"-no-image.png"},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"imgStyle",{get:function(){return"URL"!==this.image.imgType&&"ITEM"!=this.image.imgType||null==this.image.x?"height: 100%;max-height:100%;max-width: none;width: auto;":"\n        transform-origin: 0px 0px 0px;\n        width: initial !important;\n        max-width: initial !important;\n        height: initial !important;\n        max-height: initial !important;\n        transform: scale3d("+this.scale+","+this.scale+","+this.scale+") translate3d("+this.xtrans+"px,"+this.ytrans+"px,0px);"},enumerable:!0,configurable:!0}),e.prototype.imgloaded=function(){this.loaded=!0},e.prototype.imgerror=function(){this.error=!0,this.loaded=!0},Object.defineProperty(e.prototype,"imgContStyle",{get:function(){return"URL"!==this.image.imgType&&"ITEM"!=this.image.imgType||null==this.image.x?"height:"+this.hv+"px;":"width:"+this.wt+"px; height:"+this.ht+"px;display:grid;display:-ms-grid;"},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"imgTip",{get:function(){return Object(d.j)(this.image.title)?null:'<div class="jps-img-tip">\n    <h4>'+this.$ls(this.image.title)+"</h4>\n    <p>"+this.$c(m.d,this.image.contentsRightsType)+"</p>\n    <p>"+this.$ls(this.image.contentsRights)+'</p>\n    <p><a href="'+this.image.sourceUrl+'">'+this.$ls(this.image.source)+"</a></p>\n    </div>"},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isEmpty",{get:function(){return!this.image||("URL"===this.image.imgType||"ITEM"==this.image.imgType)&&!this.image.url},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"show",{get:function(){return!this.isEmpty||!this.hidenoimg},enumerable:!0,configurable:!0}),e.prototype.mounted=function(){var n=this;this.hidenoimg&&this.isEmpty||(p(this.$el,Object(f.a)(1e3,function(e){n.calc("resize")})),this.calc("init"))},e.prototype.watchImage=function(){this.calc("img")},e.prototype.calc=function(n){if(this.wv=this.$el.clientWidth||0,this.hv=this.$el.clientHeight||0,!(this.hv<=0)&&this.image)if("URL"===this.image.imgType||"ITEM"==this.image.imgType)this.src=this.image.url,this.image.h&&(this.scale=this.hv/this.image.h*1.1);else{var e={h:this.hv};"UPLOAD"===this.image.imgType?this.src=this.$url(Object(i.b)(this.image.contentId,this.image.imageId,this.image,e)):"IIIF"===this.image.imgType&&(this.src=Object(i.c)(this.image.infoJsonUrl,this.image,e))}},Object.defineProperty(e.prototype,"xtrans",{get:function(){return this.image.x?-this.image.x:0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"ytrans",{get:function(){return this.image.y?-this.image.y:0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"wt",{get:function(){return this.image.w?Math.ceil(this.image.w*this.scale):0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"ht",{get:function(){return this.image.h?Math.ceil(this.image.h*this.scale):0},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"title",{get:function(){return this.image.title},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"attribution",{get:function(){return this.image.source},enumerable:!0,configurable:!0}),t.c([Object(l.a)(),t.f("design:type",Object)],e.prototype,"image",void 0),t.c([Object(l.a)({default:!1}),t.f("design:type",Boolean)],e.prototype,"info",void 0),t.c([Object(l.a)(),t.f("design:type",Boolean)],e.prototype,"hidenoimg",void 0),t.c([Object(l.a)({default:"curation"}),t.f("design:type",String)],e.prototype,"type",void 0),t.c([Object(l.b)("image"),t.f("design:type",Function),t.f("design:paramtypes",[]),t.f("design:returntype",void 0)],e.prototype,"watchImage",null),e=t.c([r()({name:"ImageSelectionView",template:o("./ts/components/image-selection/image-selection-view.html")})],e)}(c.a);e.a=u},"./ts/components/organization/org-span.ts":function(n,e,o){"use strict";var t=o("../node_modules/tslib/tslib.es6.js"),i=o("./ts/service/organization-service.ts"),s=o("../node_modules/vue/dist/vue.common.js"),c=o.n(s),a=o("../node_modules/vue-class-component/dist/vue-class-component.common.js"),r=o.n(a),l=o("../node_modules/vue-property-decorator/lib/vue-property-decorator.js"),f=function(n){function e(){var e=null!==n&&n.apply(this,arguments)||this;return e.org=null,e}return t.d(e,n),e.prototype.render=function(n){return n(this.tag,{class:"jps-org-span jps-meta"},this.org?null==this.$scopedSlots.default?this.$ls(this.org.name):[this.$scopedSlots.default({org:this.org})]:[])},e.prototype.watchId=function(n,e){var o=this;this.id&&Object(i.a)(this.id).then(function(n){return o.org=n}).catch()},t.c([Object(l.a)(),t.f("design:type",String)],e.prototype,"id",void 0),t.c([Object(l.a)({default:"span"}),t.f("design:type",String)],e.prototype,"tag",void 0),t.c([Object(l.b)("id",{immediate:!0}),t.f("design:type",Function),t.f("design:paramtypes",[Object,Object]),t.f("design:returntype",void 0)],e.prototype,"watchId",null),e=t.c([r()({name:"OrgSpan"})],e)}(c.a);e.a=f},"./ts/service/organization-service.ts":function(n,e,o){"use strict";o.d(e,"a",function(){return l}),o.d(e,"b",function(){return f}),o.d(e,"d",function(){return m}),o.d(e,"c",function(){return d});var t=o("../node_modules/axios/index.js"),i=o.n(t),s=o("./ts/config.ts"),c=o("./ts/service/cache-util.ts"),a=o("./ts/service/search-utils.ts"),r=s.a+"api/organization/";function l(n){return Object(c.a)("organization",n,r+n)}function f(n){return i.a.post(r+"participate",n)}function m(n){return i.a.post(r+"update",n)}function d(n){return i.a.get(r+"search"+Object(a.c)(n))}},"./ts/utils/iiif-utils.ts":function(n,e,o){"use strict";o.d(e,"c",function(){return a}),o.d(e,"b",function(){return r}),o.d(e,"d",function(){return l}),o.d(e,"a",function(){return f});var t=o("../node_modules/axios/index.js"),i=o.n(t);function s(n){return n?null!=n.w&&n.w>0?null!=n.h&&n.h>0?n.w+","+n.h:n.w+",":null!=n.h&&n.h>0?","+n.h:"full":"full"}function c(n){return null==n?"full":null!=n.x&&null!=n.y&&null!=n.w&&null!=n.h&&Math.floor(n.w)>0&&Math.floor(n.h)>0?Math.floor(n.x)+","+Math.floor(n.y)+","+Math.floor(n.w)+","+Math.floor(n.h):"full"}function a(n,e,o){return n.replace("info.json","")+(c(e)+"/")+s(o)+"/0/default.jpg"}function r(n,e,o,t){return"api/iiif/"+n+"-"+e+"/"+c(o)+"/"+s(t)+"/0/default.jpg"}function l(n,e){return"/api/iiif/"+n+"-"+e+"/info.json"}function f(n){return i.a.get(n)}}}]);