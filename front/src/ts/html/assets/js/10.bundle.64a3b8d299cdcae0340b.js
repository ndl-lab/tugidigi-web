(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{"../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js?!./ts/pages/management/database/collecting-comp/collecting-comp.scss":function(n,e,t){(e=n.exports=t("../node_modules/css-loader/lib/css-base.js")(!1)).push([n.i,"@import url(https://fonts.googleapis.com/css?family=Roboto);",""]),e.push([n.i,"@import url(https://cdn.jsdelivr.net/npm/yakuhanjp@3.0.0/dist/css/yakuhanjp.min.css);",""]),e.push([n.i,'/*JPS service key colorset*/\n/* base */\n/* animation parameter settings*/\n@font-face {\n  font-family: "jpsicon";\n  src: url("/assets/fonts/icon.eot");\n  src: url("/assets/fonts/icon.eot") format("embedded-opentype"), url("/assets/fonts/icon.ttf") format("truetype"), url("/assets/fonts/icon.woff") format("woff"), url("/assets/fonts/icon.svg") format("svg");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^="icon-"],\n[class*=" icon-"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: "jpsicon" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n  [class^="icon-"].white,\n  [class*=" icon-"].white {\n    color: #fcfcfc; }\n  [class^="icon-"].red,\n  [class*=" icon-"].red {\n    color: #d30c2f; }\n  [class^="icon-"].x1,\n  [class*=" icon-"].x1 {\n    font-size: 1rem; }\n  [class^="icon-"].x1-5,\n  [class*=" icon-"].x1-5 {\n    font-size: 1.5rem; }\n  [class^="icon-"].x2,\n  [class*=" icon-"].x2 {\n    font-size: 2rem; }\n\n.icon-baseline-global:before {\n  content: "\\E935"; }\n\n.icon-baseline-org:before {\n  content: "\\E936"; }\n\n.icon-sns-fb:before {\n  content: "\\E937"; }\n\n.icon-sns-line {\n  content: "\\E938"; }\n\n.icon-sns-tw {\n  content: "\\E939"; }\n\n.icon-01:before {\n  content: "\\E900"; }\n\n.icon-02:before {\n  content: "\\E901"; }\n\n.icon-03:before {\n  content: "\\E902"; }\n\n.icon-04:before {\n  content: "\\E903"; }\n\n.icon-05:before {\n  content: "\\E904"; }\n\n.icon-06:before {\n  content: "\\E905"; }\n\n.icon-07:before {\n  content: "\\E906"; }\n\n.icon-08:before {\n  content: "\\E907"; }\n\n.icon-09:before {\n  content: "\\E908"; }\n\n.icon-10:before {\n  content: "\\E909"; }\n\n.icon-11:before {\n  content: "\\E90A"; }\n\n.icon-12:before {\n  content: "\\E90B"; }\n\n.icon-13:before {\n  content: "\\E90C"; }\n\n.icon-14:before {\n  content: "\\E90D"; }\n\n.icon-15:before {\n  content: "\\E90E"; }\n\n.icon-16:before {\n  content: "\\E90F"; }\n\n.icon-17:before {\n  content: "\\E910"; }\n\n.icon-18:before {\n  content: "\\E911"; }\n\n.icon-19:before {\n  content: "\\E912"; }\n\n.icon-20:before {\n  content: "\\E913"; }\n\n.icon-21:before {\n  content: "\\E914"; }\n\n.icon-22:before {\n  content: "\\E915"; }\n\n.icon-23:before {\n  content: "\\E916"; }\n\n.icon-24:before {\n  content: "\\E917"; }\n\n.icon-25:before {\n  content: "\\E918"; }\n\n.icon-26:before {\n  content: "\\E919"; }\n\n.icon-27:before {\n  content: "\\E91A"; }\n\n.icon-28:before {\n  content: "\\E91B"; }\n\n.icon-29:before {\n  content: "\\E91C"; }\n\n.icon-30:before {\n  content: "\\E91D"; }\n\n.icon-31:before {\n  content: "\\E91E"; }\n\n.icon-32:before {\n  content: "\\E91F"; }\n\n.icon-33:before {\n  content: "\\E920"; }\n\n.icon-34:before {\n  content: "\\E921"; }\n\n.icon-35:before {\n  content: "\\E922"; }\n\n.icon-36:before {\n  content: "\\E923"; }\n\n.icon-37:before {\n  content: "\\E924"; }\n\n.icon-38:before {\n  content: "\\E925"; }\n\n.icon-39:before {\n  content: "\\E926"; }\n\n.icon-40:before {\n  content: "\\E927"; }\n\n.icon-41:before {\n  content: "\\E928"; }\n\n.icon-42:before {\n  content: "\\E929"; }\n\n.icon-43:before {\n  content: "\\E92A"; }\n\n.icon-45:before {\n  content: "\\E92B"; }\n\n.icon-46:before {\n  content: "\\E92C"; }\n\n.icon-47:before {\n  content: "\\E92D"; }\n\n.icon-48:before {\n  content: "\\E92E"; }\n\n.icon-49:before {\n  content: "\\E92F"; }\n\n.icon-50:before {\n  content: "\\E930"; }\n\n.icon-51:before {\n  content: "\\E931"; }\n\n.icon-52:before {\n  content: "\\E932"; }\n\n.icon-53:before {\n  content: "\\E933"; }\n\n.icon-54:before {\n  content: "\\E934"; }\n\n/*JPS service key colorset*/\n/* base */\n/* animation parameter settings*/\n@font-face {\n  font-family: "jpsicon";\n  src: url("/assets/fonts/icon.eot");\n  src: url("/assets/fonts/icon.eot") format("embedded-opentype"), url("/assets/fonts/icon.ttf") format("truetype"), url("/assets/fonts/icon.woff") format("woff"), url("/assets/fonts/icon.svg") format("svg");\n  font-weight: normal;\n  font-style: normal; }\n\n[class^="icon-"],\n[class*=" icon-"] {\n  /* use !important to prevent issues with browser extensions that change fonts */\n  font-family: "jpsicon" !important;\n  speak: none;\n  font-style: normal;\n  font-weight: normal;\n  font-variant: normal;\n  text-transform: none;\n  line-height: 1;\n  /* Better Font Rendering =========== */\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n  [class^="icon-"].white,\n  [class*=" icon-"].white {\n    color: #fcfcfc; }\n  [class^="icon-"].red,\n  [class*=" icon-"].red {\n    color: #d30c2f; }\n  [class^="icon-"].x1,\n  [class*=" icon-"].x1 {\n    font-size: 1rem; }\n  [class^="icon-"].x1-5,\n  [class*=" icon-"].x1-5 {\n    font-size: 1.5rem; }\n  [class^="icon-"].x2,\n  [class*=" icon-"].x2 {\n    font-size: 2rem; }\n\n.icon-baseline-global:before {\n  content: "\\E935"; }\n\n.icon-baseline-org:before {\n  content: "\\E936"; }\n\n.icon-sns-fb:before {\n  content: "\\E937"; }\n\n.icon-sns-line {\n  content: "\\E938"; }\n\n.icon-sns-tw {\n  content: "\\E939"; }\n\n.icon-01:before {\n  content: "\\E900"; }\n\n.icon-02:before {\n  content: "\\E901"; }\n\n.icon-03:before {\n  content: "\\E902"; }\n\n.icon-04:before {\n  content: "\\E903"; }\n\n.icon-05:before {\n  content: "\\E904"; }\n\n.icon-06:before {\n  content: "\\E905"; }\n\n.icon-07:before {\n  content: "\\E906"; }\n\n.icon-08:before {\n  content: "\\E907"; }\n\n.icon-09:before {\n  content: "\\E908"; }\n\n.icon-10:before {\n  content: "\\E909"; }\n\n.icon-11:before {\n  content: "\\E90A"; }\n\n.icon-12:before {\n  content: "\\E90B"; }\n\n.icon-13:before {\n  content: "\\E90C"; }\n\n.icon-14:before {\n  content: "\\E90D"; }\n\n.icon-15:before {\n  content: "\\E90E"; }\n\n.icon-16:before {\n  content: "\\E90F"; }\n\n.icon-17:before {\n  content: "\\E910"; }\n\n.icon-18:before {\n  content: "\\E911"; }\n\n.icon-19:before {\n  content: "\\E912"; }\n\n.icon-20:before {\n  content: "\\E913"; }\n\n.icon-21:before {\n  content: "\\E914"; }\n\n.icon-22:before {\n  content: "\\E915"; }\n\n.icon-23:before {\n  content: "\\E916"; }\n\n.icon-24:before {\n  content: "\\E917"; }\n\n.icon-25:before {\n  content: "\\E918"; }\n\n.icon-26:before {\n  content: "\\E919"; }\n\n.icon-27:before {\n  content: "\\E91A"; }\n\n.icon-28:before {\n  content: "\\E91B"; }\n\n.icon-29:before {\n  content: "\\E91C"; }\n\n.icon-30:before {\n  content: "\\E91D"; }\n\n.icon-31:before {\n  content: "\\E91E"; }\n\n.icon-32:before {\n  content: "\\E91F"; }\n\n.icon-33:before {\n  content: "\\E920"; }\n\n.icon-34:before {\n  content: "\\E921"; }\n\n.icon-35:before {\n  content: "\\E922"; }\n\n.icon-36:before {\n  content: "\\E923"; }\n\n.icon-37:before {\n  content: "\\E924"; }\n\n.icon-38:before {\n  content: "\\E925"; }\n\n.icon-39:before {\n  content: "\\E926"; }\n\n.icon-40:before {\n  content: "\\E927"; }\n\n.icon-41:before {\n  content: "\\E928"; }\n\n.icon-42:before {\n  content: "\\E929"; }\n\n.icon-43:before {\n  content: "\\E92A"; }\n\n.icon-45:before {\n  content: "\\E92B"; }\n\n.icon-46:before {\n  content: "\\E92C"; }\n\n.icon-47:before {\n  content: "\\E92D"; }\n\n.icon-48:before {\n  content: "\\E92E"; }\n\n.icon-49:before {\n  content: "\\E92F"; }\n\n.icon-50:before {\n  content: "\\E930"; }\n\n.icon-51:before {\n  content: "\\E931"; }\n\n.icon-52:before {\n  content: "\\E932"; }\n\n.icon-53:before {\n  content: "\\E933"; }\n\n.icon-54:before {\n  content: "\\E934"; }\n\n/* utilities */\n/* animagtion */\n/* shadow */\n/* gradation */\n/* breakpoint */\n/* typography */\n/* list page header */\n/* details page header */\n.collecting-comp.collecting-updating .loading {\n  margin-left: 0.1em;\n  animation: spinAround 600ms infinite linear;\n  border: 2px solid #d30c2f;\n  border-radius: 290486px;\n  border-right-color: transparent;\n  border-top-color: transparent;\n  height: 1.4em;\n  width: 1.4em;\n  content: "";\n  left: calc(50% - ($height / 2));\n  top: calc(50% - ($width / 2));\n  position: absolute !important; }\n',""])},"./ts/domain/collecting.ts":function(n,e,t){"use strict";t.d(e,"b",function(){return i}),t.d(e,"c",function(){return c}),t.d(e,"a",function(){return a});var o=t("./ts/domain/domain-utils.ts");Object(o.d)({id:"jps-collecting",strict:!0,fields:{id:{field:"id",type:"string",mandatory:!1,label:{ja:"収集ID",en:"Collection ID"},description:{ja:"",en:""}},database:{field:"database",type:"string",mandatory:!0,label:{ja:"",en:""},description:{ja:"",en:""}},name:{field:"name",type:"string",mandatory:!0,label:{ja:"収集の名称",en:"Name"},description:{ja:"",en:""}},collectParams:{field:"collectParams",type:"object",mandatory:!1,objRuleName:"jps-collect_params",label:{ja:"収集パラメータ",en:"Collecting Parameter"},description:{ja:"",en:""}},convertParams:{field:"convertParams",type:"object",mandatory:!1,objRuleName:"jps-convert_params",label:{ja:"変換パラメータ",en:"Converting Parameter"},description:{ja:"",en:""}},created:{field:"created",type:"number",mandatory:!1,isDate:!0,label:{ja:"作成日",en:"Created Date"},description:{ja:"",en:""}},events:{field:"events",type:"array",mandatory:!1,objRuleName:"jps-collecting_event",arraySubType:"object",label:{ja:"",en:""},description:{ja:"",en:""}},jobChainId:{field:"jobChainId",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}},jobChain:{field:"jobChain",type:"object",mandatory:!1,objRuleName:"jps-job_chain",label:{ja:"",en:""},description:{ja:"",en:""}},indexState:{field:"indexState",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}}}});Object(o.d)({id:"jps-collecting_definition",strict:!0,fields:{id:{field:"id",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}},collectParams:{field:"collectParams",type:"object",mandatory:!1,objRuleName:"jps-collect_params",label:{ja:"収集パラメータ",en:"Collecting Parameter"},description:{ja:"",en:""}},convertParams:{field:"convertParams",type:"object",mandatory:!1,objRuleName:"jps-convert_params",label:{ja:"変換パラメータ",en:"Converting Parameter"},description:{ja:"",en:""}},lastCollected:{field:"lastCollected",type:"number",mandatory:!1,isDate:!0,label:{ja:"",en:""},description:{ja:"",en:""}},jobDefinitionId:{field:"jobDefinitionId",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}},collectRate:{field:"collectRate",type:"object",mandatory:!1,objRuleName:"jps-job_rate",label:{ja:"",en:""},description:{ja:"",en:""}}}});var i={id:"jps-collect_params",strict:!0,fields:{method:{field:"method",type:"string",mandatory:!1,enumKey:"jps-collect_method",label:{ja:"収集方法",en:"Collect Method"},description:{ja:"",en:""}},url:{field:"url",type:"string",mandatory:!1,label:{ja:"URL",en:"URL"},description:{ja:"",en:""}},authType:{field:"authType",type:"string",mandatory:!1,enumKey:"jps-auth_type",label:{ja:"認証種別",en:"Authentication Type"},description:{ja:"",en:""}},userName:{field:"userName",type:"string",mandatory:!1,label:{ja:"ユーザー名",en:"User Name"},description:{ja:"",en:""}},password:{field:"password",type:"string",mandatory:!1,label:{ja:"パスワード",en:"Password"},description:{ja:"",en:""}},metadataPrefix:{field:"metadataPrefix",type:"string",mandatory:!1,label:{ja:"OAI-PMHメタデータPrefix",en:"OAI-PMH Metadata Prefix"},description:{ja:"",en:""}},set:{field:"set",type:"string",mandatory:!1,label:{ja:"OAI-PMHメタデータSet",en:"OAI-PMH Set"},description:{ja:"",en:""}},fromDate:{field:"fromDate",type:"number",mandatory:!1,isDate:!0,label:{ja:"OAI-PMH開始日付",en:"OAI-PMH From Date"},description:{ja:"",en:""}},untilDate:{field:"untilDate",type:"number",mandatory:!1,isDate:!0,label:{ja:"OAI-PMH終了日付",en:"OAI-PMH Until Date"},description:{ja:"",en:""}}}};Object(o.d)(i);var c={id:"jps-convert_params",strict:!0,fields:{format:{field:"format",type:"string",mandatory:!1,enumKey:"jps-convert_format",label:{ja:"ファイル種別",en:"File Format"},description:{ja:"",en:""}},header:{field:"header",type:"string",mandatory:!1,enumKey:"jps-convert_param_header",label:{ja:"ヘッダの扱い",en:"Header"},description:{ja:"",en:""}},compress:{field:"compress",type:"string",mandatory:!1,enumKey:"jps-compress",label:{ja:"圧縮の有無",en:"Compression"},description:{ja:"",en:""}},encoding:{field:"encoding",type:"string",mandatory:!1,enumKey:"jps-encoding",label:{ja:"エンコーディング",en:"File Encoding"},description:{ja:"",en:""}},lineType:{field:"lineType",type:"string",mandatory:!1,enumKey:"jps-line_type",label:{ja:"jsonとxmlの形式について1行1構造かどうか",en:"Line Type"},description:{ja:"",en:""}},attributeType:{field:"attributeType",type:"string",mandatory:!1,enumKey:"jps-attribute_type",label:{ja:"xmlについて属性値はパスかどうか",en:"Attribute Type"},description:{ja:"",en:""}}}};Object(o.d)(c);Object(o.d)({id:"jps-collecting_event",strict:!0,fields:{type:{field:"type",type:"string",mandatory:!1,enumKey:"jps-collecting_event_type",label:{ja:"",en:""},description:{ja:"",en:""}},success:{field:"success",type:"bool",mandatory:!0,label:{ja:"",en:""},description:{ja:"",en:""}},date:{field:"date",type:"number",mandatory:!1,isDate:!0,label:{ja:"",en:""},description:{ja:"",en:""}},message:{field:"message",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}},userId:{field:"userId",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}},logId:{field:"logId",type:"string",mandatory:!1,label:{ja:"",en:""},description:{ja:"",en:""}}}});Object(o.c)({id:"jps-collect_method",c:{manual:{l:{ja:"",en:""},d:{ja:"",en:""}},upload:{l:{ja:"アップロード",en:"Upload"},d:{ja:"",en:""}},http:{l:{ja:"HTTP",en:"HTTP"},d:{ja:"",en:""}},oaipmh:{l:{ja:"OAI-PMH",en:"OAI-PMH"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-auth_type",c:{none:{l:{ja:"認証なし",en:"No Authentication"},d:{ja:"",en:""}},basic:{l:{ja:"ベーシック認証",en:"Basic Authentication"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-convert_format",c:{csv:{l:{ja:"CSV",en:"CSV"},d:{ja:"",en:""}},tsv:{l:{ja:"TSV",en:"TSV"},d:{ja:"",en:""}},xlsx:{l:{ja:"XLSX",en:"XLSX"},d:{ja:"",en:""}},json:{l:{ja:"JSON",en:"JSON"},d:{ja:"",en:""}},xml:{l:{ja:"XML",en:"XML"},d:{ja:"",en:""}},rdf_kobunsyo:{l:{ja:"RDF",en:"RDF"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-convert_param_header",c:{none:{l:{ja:"なし",en:"None"},d:{ja:"",en:""}},ignore:{l:{ja:"無視",en:"Ignore"},d:{ja:"",en:""}},label:{l:{ja:"ラベルに利用",en:"Use for Label"},d:{ja:"",en:""}},field:{l:{ja:"フィールド名に利用",en:"Use for Field Name"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-compress",c:{none:{l:{ja:"無し",en:"None"},d:{ja:"",en:""}},zip:{l:{ja:"zip",en:"zip"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-encoding",c:{utf_8:{l:{ja:"UTF-8",en:"UTF-8"},d:{ja:"",en:""}},sjis:{l:{ja:"シフトJIS",en:"Shift-JIS"},d:{ja:"",en:""}},auto:{l:{ja:"自動判定",en:"Auto"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-line_type",c:{allinone:{l:{ja:"ルート要素あり",en:"All In One"},d:{ja:"",en:""}},oneinone:{l:{ja:"1行1構造",en:"One in One"},d:{ja:"",en:""}}}});Object(o.c)({id:"jps-attribute_type",c:{none:{l:{ja:"属性値をパスとみなさない",en:"None"},d:{ja:"",en:""}},path:{l:{ja:"属性値をパスとみなす",en:"Attribute is Path"},d:{ja:"",en:""}}}});var a={id:"jps-collecting_event_type",c:{create:{l:{ja:"作成",en:"Create"},d:{ja:"",en:""}},full_collect:{l:{ja:"全件収集",en:"Full Collect"},d:{ja:"",en:""}},diff_collect:{l:{ja:"差分収集",en:"Diff Collect"},d:{ja:"",en:""}},merge_diff:{l:{ja:"差分統合",en:"Merge"},d:{ja:"",en:""}},convert:{l:{ja:"変換",en:"Convert"},d:{ja:"",en:""}},analyze:{l:{ja:"分析",en:"Analyze"},d:{ja:"",en:""}},check_label:{l:{ja:"ラベル定義確認",en:"Analyze"},d:{ja:"",en:""}},test_indexing:{l:{ja:"テスト公開",en:"Test Indexing"},d:{ja:"",en:""}},indexing:{l:{ja:"一般公開",en:"Indexing"},d:{ja:"",en:""}}}};Object(o.c)(a);Object(o.c)({id:"jps-index_data_type",c:{string:{l:{ja:"文字列",en:"String"},d:{ja:"",en:""}},html:{l:{ja:"HTML",en:"HTML"},d:{ja:"",en:""}},uri:{l:{ja:"URI",en:"URI"},d:{ja:"",en:""}},bool:{l:{ja:"真偽値",en:"True/False"},d:{ja:"",en:""}},date:{l:{ja:"日付",en:"Date"},d:{ja:"",en:""}},latlon:{l:{ja:"座標",en:"Coordinates"},d:{ja:"",en:""}},code:{l:{ja:"コード値",en:"Code"},d:{ja:"",en:""}},number:{l:{ja:"数字",en:"Numeric"},d:{ja:"",en:""}}}})},"./ts/pages/management/database/collecting-comp/collecting-comp.html":function(n,e){n.exports='<tr class=collecting-comp :class="{\'collecting-updating\':isRunnning}"> <slot :collecting=collecting :status=status :job=currentJob :open=openModal> <td>{{ collecting.name }}</td> <td>{{ $dateTime(collecting.created) }}</td> <td>{{ $e("jps-collect_method", collecting.collectParams.method) }}</td> <td>{{ $e("jps-convert_format", collecting.convertParams.format) }}</td> <td>{{ status }}<span class=loading></span></td> <td><button class=button v-on:click=openModal()>詳細</button></td> </slot> <b-modal :active.sync=isModalActive scroll=keep> <div class=card> <header class=card-header> <p class=card-header-title>{{ collecting.name }}の詳細</p> </header> <div class=card-content> <div> <table class="table is-fullwidth"> <tr> <th>ID</th> <td>{{ collecting.id }}</td> </tr> <tr> <th>名前</th> <td>{{ collecting.name }}</td> </tr> <tr> <th>作成日</th> <td>{{ $dateTime(collecting.created) }}</td> </tr> <tr> <th>ステータス</th> <td>{{ status }}</td> </tr> <tr> <th>ファイル種別</th> <td> {{ $e("jps-convert_format", collecting.convertParams.format) }} </td> </tr> <tr> <th>収集方法</th> <td> {{ $e("jps-collect_method", collecting.collectParams.method) }} </td> </tr> </table> <table class="table is-fullwidth" v-if=collecting.events> <tr> <th>処理</th> <th>日時</th> <th>追加情報</th> <th>実行ユーザ</th> <th>ログ</th> </tr> <tr v-for="ev in collecting.events"> <td> {{ $e("jps-collecting_event_type", ev.type) }}{{ $l("event-success-", ev.success) }} </td> <td>{{ $dateTime(ev.date) }}</td> <td>{{ ev.message }}</td> <td>{{ ev.userId }}</td> <td> <a v-if=ev.logId :href="$url(\'management/database/\'+collecting.database+\'/data/\'+collecting.id+\'/log/\'+ev.logId)"><i class="material-icons notranslate"> get_app </i></a> </td> </tr> </table> <button class=button v-on:click=deleteCollecting()> {{ $l("button-delete-collecting") }} </button> </div> </div> </div> </b-modal> </tr> '},"./ts/pages/management/database/collecting-comp/collecting-comp.scss":function(n,e,t){var o=t("../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js?!./ts/pages/management/database/collecting-comp/collecting-comp.scss");"string"==typeof o&&(o=[[n.i,o,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0};t("../node_modules/style-loader/lib/addStyles.js")(o,i);o.locals&&(n.exports=o.locals)},"./ts/pages/management/database/collecting-comp/collecting-comp.ts":function(n,e,t){"use strict";var o=t("../node_modules/tslib/tslib.es6.js"),i=t("./ts/service/database-service.ts"),c=t("../node_modules/vue/dist/vue.common.js"),a=t.n(c),l=t("../node_modules/vue-class-component/dist/vue-class-component.common.js"),s=t.n(l),r=t("./ts/domain/collecting.ts"),d=t("../node_modules/vue-property-decorator/lib/vue-property-decorator.js"),b=(t("./ts/pages/management/database/collecting-comp/collecting-comp.scss"),function(n){function e(){var e=null!==n&&n.apply(this,arguments)||this;return e.isModalActive=!1,e.collecting=null,e.db=null,e}return o.d(e,n),e.prototype.created=function(){return o.b(this,void 0,void 0,function(){var n;return o.e(this,function(e){switch(e.label){case 0:return this.$registerComponentLang(f),this.collecting=this.initialCollecting,n=this,[4,Object(i.k)(this.collecting.database)];case 1:return n.db=e.sent(),[2]}})})},Object.defineProperty(e.prototype,"isRunnning",{get:function(){return!(!this.collecting||!this.collecting.jobChain)&&"RUNNING"===this.collecting.jobChain.status},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"isAnalyzed",{get:function(){return this.collecting&&this.collecting.events&&this.collecting.events.some(function(n){return"analyze"==n.type&&n.success})},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"status",{get:function(){if(!this.collecting||!this.collecting.jobChain)return this.$l("l-collecting-created");var n=this.collecting.jobChain.jobResults?this.collecting.jobChain.jobResults.length:0;switch(this.collecting.jobChain.status){case"RUNNING":return this.$ed(r.a,this.collecting.jobChain.jobs[Math.min(n,this.collecting.jobChain.jobs.length-1)].batchName)+this.$l("l-running");case"FINISHED":return this.$ed(r.a,this.collecting.jobChain.jobs[Math.min(n,this.collecting.jobChain.jobs.length-1)].batchName)+this.$l("m-collecting-finished");case"FAILED":return this.$ed(r.a,this.collecting.jobChain.jobs[Math.max(0,n-1)].batchName)+this.$l("l-failed")}},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"lastJob",{get:function(){if(!this.collecting)return"none";if(!this.collecting.jobChain)return"none";var n=Math.max(0,this.collecting.jobChain.jobResults?this.collecting.jobChain.jobResults.length-1:0);return this.collecting.jobChain.jobs[n].batchName},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"jobStatus",{get:function(){return this.collecting&&this.collecting.jobChain?this.collecting.jobChain.status:"none"},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"currentJob",{get:function(){if(!this.collecting)return"none";if(!this.collecting.jobChain)return"none";if("RUNNING"===this.collecting.jobChain.status){var n=this.collecting.jobChain.jobResults?this.collecting.jobChain.jobResults.length:0;return this.collecting.jobChain.jobs[n].batchName}return"none"},enumerable:!0,configurable:!0}),e.prototype.watchCollecting=function(){this.collecting=this.initialCollecting},e.prototype.watchStatus=function(n,e){var t=this;"RUNNING"===n?null==this.timer&&(this.timer=setInterval(function(){return o.b(t,void 0,void 0,function(){var n;return o.e(this,function(e){switch(e.label){case 0:return n=this,[4,Object(i.h)(this.collecting.database,this.collecting.id,!0)];case 1:return n.collecting=e.sent(),[2]}})})},2e3)):"FAILED"===n?null!=this.timer&&(clearInterval(this.timer),this.timer=null,this.$notifyError(this.$ed(r.a,this.lastJob)+"が失敗しました")):"FINISHED"===n&&null!=this.timer&&(clearInterval(this.timer),this.timer=null,this.$notifySuccess(this.$ed(r.a,this.lastJob)+"が完了しました")),this.collecting&&this.$emit("job-status-update",this.collecting)},e.prototype.beforeDestroy=function(){this.timer&&clearInterval(this.timer)},e.prototype.startConvert=function(n){Object(i.p)(n.database,n.id).then(function(n){})},e.prototype.startAnalyze=function(n){Object(i.o)(n.database,n.id).then(function(n){})},e.prototype.openModal=function(){this.isModalActive=!0},e.prototype.deleteCollecting=function(){var n=this;this.isModalActive=!1,this.$confirm(this.$lt("m-delete-confirm",this.collecting.name)).then(function(e){n.$loadingExecutor().executeAndNotify(n.$lt("m-delete-success",n.collecting.name),Object(i.e)(n.collecting.database,n.collecting.id)).then(function(){n.isModalActive=!1,n.$emit("delete")})})},o.c([Object(d.a)({type:Object}),o.f("design:type",Object)],e.prototype,"initialCollecting",void 0),o.c([Object(d.b)("initialCollecting"),o.f("design:type",Function),o.f("design:paramtypes",[]),o.f("design:returntype",void 0)],e.prototype,"watchCollecting",null),o.c([Object(d.b)("jobStatus",{deep:!0,immediate:!0}),o.f("design:type",Function),o.f("design:paramtypes",[Object,Object]),o.f("design:returntype",void 0)],e.prototype,"watchStatus",null),e=o.c([s()({template:t("./ts/pages/management/database/collecting-comp/collecting-comp.html")})],e)}(a.a));e.a=b;var f={"event-success-false":{ja:"失敗",en:"Failed"},"event-success-true":{ja:"成功",en:"Success"},"button-delete-collecting":{ja:"収集データの削除",en:"Delete Collected Data"},"msg-confirm-delete-collecting":{ja:"{}を削除しますか？",en:"Will you delete {}?"},"notify-delete-collecting-success":{ja:"{}を削除しました",en:"{} is deleted"},"notify-upload-success":{ja:"アップロードが完了しました",en:"Upload Succeeded"},"notify-get-success":{ja:"収集を開始します",en:"Collection Started"},created:{ja:"未収集",en:"Not Collected"},failed:{ja:"失敗",en:" Failed"},finished:{ja:"完了",en:" Finished"},running:{ja:"中",en:" Running"},"l-collecting-created":{ja:"作成済み",en:"Created"},"l-failed":{ja:"失敗しました",en:"Faield"},"l-running":{ja:"処理中",en:"Running"},"m-collecting-finished":{ja:"終了しました",en:"Finished"}}}}]);