!function(){"use strict";tinymce.PluginManager.requireLangPack("scayt"),tinymce.createNS("tinymce.plugins.SCAYT"),tinymce.plugins.SCAYT=function(){var t={},e={},n=[],a={loadOrder:[]},o=0,r=new tinymce.dom.ScriptLoader,i={scayt_context_commands:"scayt_contextCommands",scayt_slang:"scayt_sLang",scayt_max_suggestion:"scayt_maxSuggestions",scayt_custom_dic_ids:"scayt_customDictionaryIds",scayt_user_dic_name:"scayt_userDictionaryName",scayt_ui_tabs:"scayt_uiTabs",scayt_service_protocol:"scayt_serviceProtocol",scayt_service_host:"scayt_serviceHost",scayt_service_port:"scayt_servicePort",scayt_service_path:"scayt_servicePath",scayt_context_moresuggestions:"scayt_moreSuggestions",scayt_customer_id:"scayt_customerId",scayt_custom_url:"scayt_srcUrl",scayt_auto_startup:"scayt_autoStartup",scayt_context_menu_items_order:"scayt_contextMenuItemsOrder"},s=function(t){for(var e in t)e in i&&(t[i[e]]=t[e],delete t[e])},c=function(t,e){var n,o=document.location.protocol,i=t.getParam("scayt_srcUrl"),s=new Date,c=s.getTime();o=-1!==o.search(/https?:/)?o:"http:",i=0===i.search(/^\/\//)?o+i:i,n=i+"?"+c,"undefined"==typeof window.SCAYT||"function"!=typeof window.SCAYT.TINYMCE?(a[t.id]=e,a.loadOrder.push(t.id),r.add(n),r.loadQueue(function(t){var e;tinymce.plugins.SCAYT.fireOnce(tinymce,"onScaytReady");for(var n=0;n<a.loadOrder.length;n++)e=a.loadOrder[n],"function"==typeof a[e]&&a[e](tinymce.editors[e]),delete a[e];a.loadOrder=[]})):window.SCAYT&&"function"==typeof window.SCAYT.TINYMCE&&(tinymce.plugins.SCAYT.fireOnce(tinymce,"onScaytReady"),tinymce.plugins.SCAYT.getScayt(tinymce.editors[t.id])||"function"==typeof e&&e(t))},u=function(t){c(t,function(t){var a={lang:t.getParam("scayt_sLang"),container:t.getContentAreaContainer().children[0],customDictionary:t.getParam("scayt_customDictionaryIds"),userDictionaryName:t.getParam("scayt_userDictionaryName"),localization:t.getParam("language")||"en",customer_id:t.getParam("scayt_customerId"),data_attribute_name:t.plugins.scayt.options.dataAttributeName,misspelled_word_class:t.plugins.scayt.options.misspelledWordClass,ignoreElementsRegex:t.getParam("scayt_elementsToIgnore"),minWordLength:t.getParam("scayt_minWordLength")};tinymce.activeEditor===t&&(a.focused=!0),t.getParam("scayt_serviceProtocol")&&(a.service_protocol=t.getParam("scayt_serviceProtocol")),t.getParam("scayt_serviceHost")&&(a.service_host=t.getParam("scayt_serviceHost")),t.getParam("scayt_servicePort")&&(a.service_port=t.getParam("scayt_servicePort")),t.getParam("scayt_servicePath")&&(a.service_path=t.getParam("scayt_servicePath"));var o=new SCAYT.TINYMCE(a,function(){},function(){}),r="word_";if(o.subscribe("suggestionListSend",function(t){for(var e={},a=[],o=0;o<t.suggestionList.length;o++)e[r+t.suggestionList[o]]||(e[r+t.suggestionList[o]]=t.suggestionList[o],a.push(t.suggestionList[o]));n=a}),e[t.id]=o,t.formatter){for(var i,s,c=t.formatter.get("removeformat")||[],u=0;u<c.length;u+=1)s=c[u].selector,-1!==s.indexOf("span")&&-1===s.indexOf("span.")&&(i=s.indexOf("span")+4,c[u].selector=[s.slice(0,i),":not(.scayt-misspell-word)",s.slice(i)].join("")),-1!==s.indexOf("*")&&(i=s.indexOf("*")+1,c[u].selector=[s.slice(0,i),":not(.scayt-misspell-word)",s.slice(i)].join(""));c.push({selector:"span.scayt-misspell-word",attributes:["style"],remove:"empty",split:!0,expand:!1,deep:!0}),t.formatter.register("removeformat",c)}})},l=function(t){var n=e[t.id];n&&n.destroy(),delete e[t.id]},d=function(t){t&&(t.reloadMarkup?t.reloadMarkup():(5>o&&(console.warn("Note: You are using latest version of SCAYT plug-in. It is recommended to upgrade WebSpellChecker.net application to version v4.8.3.Contact us by e-mail at support@webspellchecker.net."),o+=1),t.fire("startSpellCheck")))};return{reloadMarkup:function(t){d(t)},create:function(t){return u(t)},destroy:function(t){return l(t)},getScayt:function(t){return e[t.id]||!1},getSuggestions:function(){return n},getState:function(e){var n="object"==typeof e?e.id:e;return t[n]},setState:function(e,n){var a="object"==typeof e?e.id:e;return n=n||!1,t[a]=n},replaceOldOptionsNames:function(t){s(t)},fireOnce:function(t,e){t["uniqueEvtKey_"+e]||(t["uniqueEvtKey_"+e]=!0,t[e].dispatch())}}}();var t=function(t,e){this.undoManager=null,this.options={disablingCommandExec:{mceCodeEditor:!0,mceNewDocument:!0,mceTemplate:!0,mceFullScreen:!1,mceInsertContent:!1,mceSetContent:!1},url:e||null,dataAttributeName:"data-scayt-word",misspelledWordClass:"scayt-misspell-word"},this.parseConfig={_definitions:{scayt_srcUrl:{type:"string","default":"//svc.webspellchecker.net/spellcheck31/lf/scayt3/tinymce/tinymcescayt.js"},scayt_sLang:{type:"string","default":"en_US"},scayt_customerId:{type:"string","default":"1:wiN6M-YQYOz2-PTPoa2-3yaA92-PmWom-3CEx53-jHqwR3-NYK6b-XR5Uh1-M7YAp4"},scayt_autoStartup:{type:"boolean","default":!1},scayt_maxSuggestions:{type:"number","default":5},scayt_minWordLength:{type:"number","default":4},scayt_moreSuggestions:{type:"string","default":"on"},scayt_contextCommands:{type:"string","default":"add,ignore,ignoreall"},scayt_contextMenuItemsOrder:{type:"string","default":"suggest,moresuggest,control"},scayt_uiTabs:{type:"string","default":"1,1,1"},scayt_customDictionaryIds:{type:"string","default":""},scayt_userDictionaryName:{type:"string","default":null},scayt_serviceProtocol:{type:"string","default":null},scayt_serviceHost:{type:"string","default":null},scayt_servicePort:{type:"string","default":null},scayt_servicePath:{type:"string","default":null}},init:function(t){this._parseOptions(t)},getValue:function(t){return this._definitions[t].value},getLocationInfo:function(t){var e=document.createElement("a");return e.href=t,{protocol:e.protocol.replace(/:/,""),host:e.host.split(":")[0],port:"0"==e.port?"80":e.port,pathname:e.pathname.replace(/^\//,"")}},setValue:function(e,n){var a=n||"",o=t.settings;return this._definitions[e].value=o[e]=a},_parseOptions:function(t){function e(t,e){for(var n=!0,a=0,o=t.length;o>a&&(n=n&&e(t[a]),n);a++);return n}var n=t.settings,a=this._definitions,o=this.getLocationInfo,r=tinymce.plugins.SCAYT,i=/\s?[\|]+\s?/gi;r.replaceOldOptionsNames(n);var s=function(e){"scayt_customerId"===e&&(a[e].value=n[e]=function(t,n){n=o(n);var r=o(a.scayt_srcUrl["default"]),i=t&&typeof t===a[e].type&&t.length>=50;return r=n.host===r.host&&n.pathname===r.pathname,i&&!r?t:r?i&&r?t:a[e]["default"]:t}(t.getParam(e),t.getParam("scayt_srcUrl")))};for(var c in a)a.hasOwnProperty(c)&&typeof t.getParam(c)===a[c].type?(a[c].value=n[c]=t.getParam(c),"scayt_maxSuggestions"===c&&t.getParam(c)<0&&(a[c].value=n[c]=a[c]["default"]),"scayt_minWordLength"===c&&t.getParam(c)<1&&(a[c].value=n[c]=a[c]["default"]),"scayt_contextCommands"===c&&("off"===t.getParam(c)?a[c].value=n[c]="":"all"===t.getParam(c)?a[c].value=n[c]=a[c]["default"]:a[c].value=n[c]=i.test(t.getParam(c))?t.getParam(c).replace(i,","):t.getParam(c)),"scayt_uiTabs"===c&&(a[c].value=n[c]=n[c].split(","),3==n[c].length&&e(n[c],function(t){return 0==t||1==t})||(a[c].value=n[c]=a[c]["default"].split(","))),s.call(this,c)):"scayt_uiTabs"===c?a[c].value=n[c]=a[c]["default"].split(","):"scayt_customerId"===c?s.call(this,c):a[c].value=n[c]=a[c]["default"];r.setState(t,n.scayt_autoStartup)}}};t.prototype={init:function(t,e){tinymce.plugins.SCAYT,t.settings;this.options.url=e,this.toolbarScaytTabs=null,this.parseConfig.init(t),this.bindEvents(t)},createControl:function(t,e){if("scayt"===t){var n=this,a=tinymce.plugins.SCAYT,o=e.editor,r=o.plugins.scaytcontextmenu||o.plugins.contextmenu;n.disabledScaytButtonsMenu=function(){for(var t in n.toolbarScaytTabs)n.toolbarScaytTabs[t].setDisabled(1)},n.enabledScaytButtonsMenu=function(){for(var t in n.toolbarScaytTabs)n.toolbarScaytTabs[t].setDisabled(0)};var i=function(t){var e=a.setState(o,!a.getState(o));e?(a.create(o),o.controlManager.controls[o.controlManager.prefix+"scayt"].setActive(1),n.enabledScaytButtonsMenu()):(a.destroy(o),o.controlManager.controls[o.controlManager.prefix+"scayt"].setActive(0),n.disabledScaytButtonsMenu())},s=e.createSplitButton(t,{title:"scayt.desc",cmd:"mceScayt",sce:n,image:n.options.url+"/img/scayt.gif",onclick:i}),c=function(t,e){var o=a.getScayt(e),r=["options","langs","dictionary","about"];e.focus(),e.settings.scaytDialogMode=r[t],e.windowManager.open({file:n.options.url+"/ui.html",width:"450",height:"300",inline:1},{mode:r[t],s:o})},u=[{title:o.getLang("scayt.tb_menu_options","SCAYT Options"),onclick:function(t){c(0,o)}},{title:o.getLang("scayt.tb_menu_languages","SCAYT Languages"),onclick:function(){c(1,o)}},{title:o.getLang("scayt.tb_menu_dictionaries","SCAYT Dictionaries"),onclick:function(){c(2,o)}},{title:o.getLang("scayt.tb_menu_about","About SCAYT"),onclick:function(){c(3,o)}}],l={getSelectionWord:function(t){if(!t)return!1;var e,n=t.getSelectionNode();return e=n?n.getAttribute(t.getNodeAttribute()):n}},d=function(t,e){for(var n=t.length;n--;)if(t[n]===e)return!0;return!1};return s.onRenderMenu.add(function(t,e){var r=o.getParam("scayt_uiTabs");r.push("1");for(var i=0,s=u.length;s>i;i++)parseInt(r[i])&&e.add(u[i]);n.toolbarScaytTabs=e.items,a.getState(o)===!1&&n.disabledScaytButtonsMenu()}),r&&setTimeout(function(){r.onContextMenu.add(function(t,e,r){var i=a.getScayt(o),s=l.getSelectionWord(i);if(s){i.fire("getSuggestionsList",{lang:i.getLang(),word:s});var u=[],g=[],m=[],y=a.getSuggestions(),f=null,p=function(t,e){var n="scayt"+e;return o.addCommand(n,function(){var n=e;t.replaceSelectionNode({word:n})}),n},_={title:null,icon:"",cmd:null},v={add:{title:o.getLang("scayt.cm_add_word","Add word"),icon:"",cmd:"scayt_add_word"},ignore:{title:o.getLang("scayt.cm_ignore_word","Ignore word"),icon:"",cmd:"scayt_ignore_word"},ignoreall:{title:o.getLang("scayt.cm_ignore_all","Ignore all"),icon:"",cmd:"scayt_ignore_all_words"}};if(y.length>0&&"no_any_suggestionse"!==y[0])for(var S=0,h=y.length;h>S;S+=1)_={title:y[S],icon:"",cmd:p(i,y[S])},S<n.parseConfig.getValue("scayt_maxSuggestions")?m.push(_):"on"===n.parseConfig.getValue("scayt_moreSuggestions")&&u.push(_);else _={title:o.getLang("scayt.no_any_suggestions","No suggestions"),icon:"",cmd:"",disabled:!0,active:0},m.push(_);o.addCommand("scayt_add_word",function(){setTimeout(function(){i.addWordToUserDictionary()},0)}),o.addCommand("scayt_ignore_word",function(){i.ignoreWord()}),o.addCommand("scayt_ignore_all_words",function(){i.ignoreAllWords()});var C=n.parseConfig.getValue("scayt_contextCommands").split(",");for(var b in v)d(C,b)&&g.push(v[b]);o.addCommand("scayt_about",function(){c(3,o)}),g.push({title:o.getLang("scayt.cm_about","About SCAYT"),icon:"scayt_about",cmd:"scayt_about"});for(var M={moresuggest:function(){if(e.addSeparator(),!f&&y.length>n.parseConfig.getValue("scayt_maxSuggestions")&&"on"===n.parseConfig.getValue("scayt_moreSuggestions")){e.addSeparator(),f=e.addMenu({title:o.getLang("scayt.cm_more_suggestions","More Suggestions")}),e.addSeparator();for(var t=0;t<u.length;t++)f.add(u[t])}},control:function(){e.addSeparator();for(var t=0;t<g.length;t++)e.add(g[t])},suggest:function(){if(0===y.length||"no_any_suggestionse"===y[0])e.add(m[0]).setDisabled(1);else for(var t=0;t<m.length;t++)e.add(m[t])}},P=n.parseConfig.getValue("scayt_contextMenuItemsOrder").split(","),w=0;w<P.length;w++)"function"==typeof M[P[w]]&&M[P[w]]();e.addSeparator(),i.showBanner("#menu_"+t._menu.id+"_co")}})},0),s}},getInfo:function(){return{longname:"Spell Check As You Type (SCAYT)",author:"WebSpellChecker.net",authorurl:"http://www.webspellchecker.net/",infourl:"http://www.webspellchecker.net/",version:"3.0"}},bindEvents:function(t){var e,n=this,a=tinymce.plugins.SCAYT,o=t.plugins.scayt,r=t,i=function(t){a.getState(t)!==!0||t.settings.readonly||(a.create(t),t.controlManager.controls[t.controlManager.prefix+"scayt"].setActive(1))},s=function(t){var e=a.getScayt(t);e&&a.destroy(t)};r.onInit.add(function(t){i(t)}),r.onRemove.add(function(t){s(t)}),tinymce.onRemoveEditor.add(function(t,e){return s(e)}),r.theme.onResolveName&&r.theme.onResolveName.add(function(t,e){"SPAN"==e.node.nodeName&&r.dom.hasClass(e.node,n.options.misspelledWordClass)&&(e.name="")}),r.onBeforeExecCommand.add(function(t,n,r,i){var c,u=!1,l=!0;n in o.options.disablingCommandExec&&o.options.disablingCommandExec[n]?(s(t),a.getState(t)&&a.create(t)):(c=a.getScayt(t),c&&("mceInsertContent"===n&&(e&&"mceEmotion"===e?setTimeout(function(){c.removeMarkupInSelectionNode(),a.reloadMarkup(c)},0):(c.removeMarkupInSelectionNode(),setTimeout(function(){a.reloadMarkup(c)},0))),("Cut"===n||"Bold"===n||"Underline"===n||"Italic"===n||"subscript"===n||"superscript"===n||"Strikethrough"===n)&&("Cut"===n&&(l=!1,u=!0),c.removeMarkupInSelectionNode({removeInside:l,forceBookmark:u}),setTimeout(function(){a.reloadMarkup(c)},0)),("mceRepaint"===n||"Undo"===n||"Redo"===n)&&a.reloadMarkup(c))),e=n}),r.onExecCommand.add(function(t,e,n,r){var i=a.getScayt(t);"mceFullScreen"!=e||a.getState(t)||(s(tinymce.activeEditor),tinymce.activeEditor.controlManager.controls[tinymce.activeEditor.controlManager.prefix+"scayt"].setActive(0)),i&&"mceFullScreen"==e&&"undefined"==typeof t.getParam("fullscreen_is_enabled")?(a.getState(t)&&(a.create(tinymce.activeEditor),tinymce.activeEditor.controlManager.controls[tinymce.activeEditor.controlManager.prefix+"scayt"].setActive(1)),o.parseConfig.setValue("scayt_sLang",i.getLang())):t.getParam("fullscreen_is_enabled")===!0&&s(tinymce.activeEditor)}),r.onPreInit.add(function(e){n.undoManager=e.undoManager,n.undoManager&&n.undoManager.onBeforeAdd&&n.undoManager.onBeforeAdd.add(function(e,n){var o=a.getScayt(t);o&&n&&n.content&&(n.content=o.removeMarkupFromString(n.content))})}),r.onPaste.add(function(t,e){var n=a.getScayt(t);setTimeout(function(){n&&(n.removeMarkupInSelectionNode(),a.reloadMarkup(n))},0)}),r.onSetContent.add(function(e,n){var o=a.getScayt(t);o&&setTimeout(function(){o.removeMarkupInSelectionNode(),a.reloadMarkup(o)},0)}),r.onPreProcess.add(function(t,e){var n;return e.get&&(n=a.getScayt(t),n&&e.node&&(e.node.innerHTML=n.removeMarkupFromString(e.node.innerHTML))),e}),r.addCommand("mceScayt",function(e){var o=a.getScayt(r);o?(a.destroy(t),r.controlManager.controls[r.controlManager.prefix+"scayt"].setActive(0),n.disabledScaytButtonsMenu()):(a.create(t),r.controlManager.controls[r.controlManager.prefix+"scayt"].setActive(1),n.enabledScaytButtonsMenu())})}},tinymce.PluginManager.add("scayt",t),tinymce.onScaytReady=new tinymce.util.Dispatcher,tinymce.onScaytReady.add(function(){tinymce.EditorManager.Editor.prototype.isDirty=function(){var t,e,n=tinymce.plugins.SCAYT.getScayt(this);return n?(t=tinymce.trim(n.removeMarkupFromString(this.startContent)),e=tinymce.trim(n.removeMarkupFromString(this.getContent({format:"raw",no_events:1})))):(t=tinymce.trim(this.startContent),e=tinymce.trim(this.getContent({format:"raw",no_events:1}))),e!=t&&!this.isNotDirty}})}();