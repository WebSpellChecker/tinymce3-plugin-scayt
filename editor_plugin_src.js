(function() {
    // Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('scayt');
	
    var each = tinymce.each, DOM = tinymce.DOM,
        Event = tinymce.dom.Event;
    tinymce._scayt_start_load = false;
    tinymce._is_scayt_loaded = false;
	
	// Specific scayt init scope
    var scayt_plugin_sce = function ( ed ) {
        
        var createMenuCommand = function  (scayt_control, el, word ) {
            var cmd = 'scayt' + word;
            ed.addCommand(cmd, function(){
              scayt_control.replace(el, word);
          });
            return cmd;
        };


        var _add_context_menu = function () {
			// tiny context menu objecct
            var contextMenu = ed.plugins.scaytcontextmenu || ed.plugins.contextmenu;
            
            if (contextMenu) {
				// register listener
                contextMenu.onContextMenu.add(function(t, m, el, col){
					// active editor plugin
                    var ps = ed.plugins.scayt;
					//  active editor plugin service scope (return by this function)
                    var s = ed.plugins.scayt._s;
					// this meens that scayt is disabled
                    if (s._status !== true)
                        return;
					// define default variables
                    var scayt_control = s._SCAYT_control;
                    var scayt = s._SCAYT;
                    var el = scayt_control.getScaytNode();
					
					if ( scayt_control.fireOnContextMenu )  
							 scayt_control.fireOnContextMenu(null,  null, ed);
					if (!el)
                        return;
						
                    var sub_m = null;
                    var suggestions = null;
                    var word = null;
                    var moreSugg = ed.getParam('scayt_context_moresuggestions') || "on";
                    var mmode = ed.getParam('scayt_context_commands') || 'all';
                    var more_sugg_added = 0;
                    
					try {
						word = scayt_control.getWord(el);
					} catch (err){
					}
                    if (!word)
                        return;
                    try {
                    	suggestions = window.scayt.getSuggestion(word, scayt_control.getLang());
                    } catch (err){
					}
                    if (!suggestions || !suggestions.length )
                        return;
                        
					// menu mode active object
                    mmode = mmode.split("|");
                    mmode = {
                        all: false,
                        off: false,
                        asis: mmode,
                        isin: function(s){
                            if (this.off)
                                return false;
                            if (this.all)
                                return true;

                            return this.is(s);
                        },
                        is: function(s){
                            for (var i = 0, l = this.asis.length; i < l; i++)
                                if (this.asis[i] == s)
                                    return true;
                            return false;
                        }
                    };

                    if (mmode.is("off")) {
                        mmode.off = true;
                        mmode.all = false;
                    }
                    if (mmode.is("all")) {
                        mmode.off = false;
                        mmode.all = true;
                    }
                    
                    // define max suggestion which colud be show in main menu            
                    s._max_suggestion = (s._max_suggestion == -1) ? 999 : s._max_suggestion;
                    
					var moresuggest_group = new Array(),
						control_group = new Array(),
						suggest_group = new Array();
						
                    for (var i = 0, l = suggestions.length; i < l; i += 1) {
						// menu item object
                        var mitem = {
                            title: suggestions[i],
                            icon: '',
                            cmd: createMenuCommand(scayt_control, el, suggestions[i])
                        };
						// add item to main menu group
                        if (i < s._max_suggestion) {
                            suggest_group.push(mitem);
                        }
                        else if (moreSugg == "on") {
							// add item to the more suggestions submenu group
                            moresuggest_group.push(mitem);
                        }

                    }

					// register add word command
                    if (mmode.isin('add')) {
                        ed.addCommand("scayt_add_word", function(){
                            window.scayt.addWordToUserDictionary(el);
                        });
						control_group.push({
                            title: ed.getLang('scayt.cm_add_word', "Add word"),
                            icon: 'scayt_add_word',
                            cmd: "scayt_add_word"
                        });
                    }
					// register ignore word command
                    if (mmode.isin('ignore')) {
                        ed.addCommand("scayt_ignore_word", function(){
                            scayt_control.ignore(el);
						});
						control_group.push({
                            title: ed.getLang("scayt.cm_ignore_word", "Ignore word"),
                            icon: 'scayt_ignore_word',
                            cmd: "scayt_ignore_word"
                        });
                    }
					// register ignore all words command
                    if (mmode.isin('ignoreall')) {
                        ed.addCommand("scayt_ignore_all_words", function(){
                            scayt_control.ignoreAll(el);
                        });
						control_group.push({
                            title: ed.getLang("scayt.cm_ignore_all", "Ignore all"),
                            icon: 'scayt_ignore_all_words',
                            cmd: "scayt_ignore_all_words"
                        });
                    }

                    // register about command
                    
                    
                        ed.addCommand("scayt_about", function(){
                            tinyMCE.activeEditor.plugins.scayt._create_ui_pup(3);
                            /*
                            var s = tinyMCE.activeEditor.plugins.scayt;
                            tinyMCE.activeEditor.windowManager.open({
                                title: ed.getLang("scayt.desc", "SpellCheckAsYouType"),
                                file: s._url + '/dialog/ui.html?ui=about',
                                width: '400',
                                height: '270',
                                pup_css: "",
                                inline: 1
                            }, {
                                s: s._s
                            });
                            */
                        });
						
						control_group.push({
                            title: ed.getLang("scayt.cm_about", "About SCAYT"),
                            icon: 'scayt_about',
                            cmd: "scayt_about"
                        });
					
					var context_mode = ed.getParam('scayt_context_mode') || 'default';
					if (context_mode != "off")
						m.addSeparator();
						
					var items_order = ed.getParam('scayt_context_menu_items_order') || 'suggest|moresuggest|control';
					items_order = items_order.split( '|' );

					if ( items_order && items_order.length ) {
						for ( var pos = 0 ; pos < items_order.length ; pos++ ) {
							switch (items_order[pos]) {
								case "suggest":
									if (pos != 0) 
										m.addSeparator();
									for (var i=0; i<suggest_group.length; i++)
										m.add(suggest_group[i]);
									break;
								case "moresuggest":
									if (moreSugg == "on") {
										if (!sub_m) {
											if (pos != 0) 
												m.addSeparator();
											sub_m = m.addMenu({
												title: ed.getLang("scayt.cm_more_suggestions", "More Suggestions")
											});
										}
										for (var i=0; i<moresuggest_group.length; i++)
											sub_m.add(moresuggest_group[i]);
									}
									break;
								case "control":
									if (pos != 0) 
										m.addSeparator();
									var k = -1;
									for (var i=0; i<control_group.length; i++){
										if (control_group[i].cmd != 'scayt_about') m.add(control_group[i]);
										else k = i;
									}
									if (pos != 0 && k != -1){
										m.addSeparator();
										m.add(control_group[k]);
									}
									break;
							}
						}
					}
                });
            }
        };


        var _sce = {

            _uiTabs:[],
            _status: null,
            _params: {},
            _scaytUrl: "",
            _max_suggestion: -1,
            _parseUrl: function(data){
                var m = data.match(/(.*)[\/\\]([^\/\\]+\.\w+)$/);
                return (m == null) ? data : {path: m[1],file: m[2]};
            },
            _initScayt: function(){
            	if (typeof window.scayt == "undefined")
                    return;
                tinymce._is_scayt_loaded = true;
                this._SCAYT_control = new window.scayt(this._params);
                this._SCAYT = window.scayt;
                this._status = !this._SCAYT_control.disabled;
                this._uiTabs = window.scayt.uiTags || [1,1,1,1];
                ed.plugins.scayt._set_control_disabled(this._status);
                ed.plugins.scayt._set_controlls_off(false);
                _add_context_menu();
            }

        };

        return _sce;
    };

        tinymce.create('tinymce.plugins.scayt', {
		
		
			tabsHash : [],
			
            _doLoadScript: function(url){
                if (!url) {
                    return false;
                }
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = url;
                document.getElementsByTagName('head')[0].appendChild(s);
                return true;
            },

            _loadEngine: function(){    
				 
                var t = this;
				if (typeof window.scayt == "undefined") {
					tinymce._scayt_start_load = true;
					t._doLoadScript(t._get_instance()._scaytUrl);
					window.setTimeout(function(){
						t._set_controlls_off(true);
					},100);
				} else {
					if (typeof t._s != "undefined") {
						window.setTimeout(function(){
							t._set_controlls_off(true);
							t._s._initScayt();
						},100);
					}
				}
			},
            _create_ui_pup: function( index ){
                 
                // make the editor Active to use tinyMCEPopup.editor in ui.js with current editor
                this.editor.focus();
                //var ed = this.editor; 
                var ed = this.editor;
                var s = this._get_instance();
				
                var uiTitles = [
                    "options",
                    "langs",
                    "dictionary",
                    "about"
                ];

                if (s._status == true ) {
					if (this.uiTabs[index] != 1) {
                        alert("This action is disabled due to technical reason.");
					}
                    else {
						
						window.focus();
						ed.windowManager.open({
                            title: "scayt.desc",
                            file: this._url + '/ui.html',
	                        width: '450',
							height: '300',
                            pup_css: "",
                            inline: 1
                        }, {
							//mode : m,
							mode : uiTitles[index],
                            s: s
                        });
					}
                } else {
                    alert (ed.getLang("scayt.disabled_alert","SpellCheckAsYouType (SCAYT) is disabled. Enable to proceed."));
                }

            },
            _get_instance: function (){
                    return this.editor.plugins.scayt._s;
            },
            _get_editor:function (){
                //return tinyMCE.activeEditor;
                return this.editor;
            },
            _enable : function (s){
				t = this;
				t._enableMenuTabs();
                s._SCAYT_control.setDisabled(false);
                s._status = true;
                this._set_control_disabled(true);
            },
            _disable : function (s){
				t = this;
				t._disableMenuTabs();
				s._SCAYT_control.setDisabled(true);
                s._status = false;
                this._set_control_disabled(false);
            },
            _set_control_disabled: function (s){
                var sc = this._get_editor().controlManager && this._get_editor().controlManager.get('scayt');
                sc && sc.setActive(s);
            },
            _set_controlls_off: function (s){
                each(tinyMCE.editors,function (v,k){
                    v.plugins.scayt &&
                    v.plugins.scayt._get_editor() &&
                    v.plugins.scayt._get_editor().controlManager &&
                    v.plugins.scayt._get_editor().controlManager.setDisabled('scayt',s);
                });
            },

            _refresh : function (s){
                var ins = this._get_instance();
				return function(){
						if ( ins && ins._SCAYT_control )
                            ins._SCAYT_control.refresh();
                };
            },
			
			_disableMenuTabs : function(){
				t = this;
				for(var key in t.tabsHash){
					t.tabsHash[key].disabled = true;
					t.tabsHash[key].postRender(); 
				}
			},
			
			_enableMenuTabs : function(){
				t = this;
				for(var key in t.tabsHash){
					t.tabsHash[key].disabled = false;
					t.tabsHash[key].postRender();
				}
			},

            init : function(ed, url) {
                var t = this;
                t.editor = ed;
                var s = t._s = new scayt_plugin_sce( ed );
                t._url = url;
                // !read config params
                s._params.id = ed.editorId+'_ifr';
                s._params.customerid 				= ed.getParam('scayt_customer_id') || "1:wiN6M-YQYOz2-PTPoa2-3yaA92-PmWom-3CEx53-jHqwR3-NYK6b-XR5Uh1-M7YAp4";
                s._params.customDictionaryIds 		= ed.getParam('scayt_custom_dic_ids') || "";
                s._params.userDictionaryName 		= ed.getParam('scayt_user_dic_name') || "";
                s._params.sLang 					= ed.getParam('scayt_slang') || "en_US";
                s._max_suggestion					= ed.getParam('scayt_max_suggestion') || -1;
                s._params.hostType                  = 'tinymce.' + tinymce.majorVersion + '.' + tinymce.minorVersion + '@' + tinymce.releaseDate;
                // !compose scayt url
                var protocol = document.location.protocol;
                var baseUrl  = "svc.webspellchecker.net/scayt26/loader__base.js";

                var scaytUrl = s._scaytUrl =  ed.getParam('scayt_custom_url') || (protocol + "//" + baseUrl);
                var scaytConfigBaseUrl =  s._parseUrl(scaytUrl).path +  "/";
                
                if ( !window.CKEDITOR ){
                    window.CKEDITOR = {};

                    window.CKEDITOR._djScaytConfig = {
                        baseUrl: scaytConfigBaseUrl,
                        addOnLoad:
                        [
                            function()
                            {
                                
                                if (ed.getParam('scayt_auto_startup') == true)
                                    each(tinyMCE.editors,function (v,k){


                                        if (!v._st_scayt){
                                            v.plugins && v.plugins.scayt && v.plugins.scayt._s && v.plugins.scayt._s._initScayt();
                                        }
                                    });
                                else{

                                    t._get_instance(ed)._initScayt();

                                }
                            }
                        ],
                        isDebug: false
                    };

                }

				//#2877 add destroy SCAYT when tinyMCE.execCommand("mceRemoveControl", true, 'elm');
				ed.onRemove.add(function(){
					var ins = ed.plugins.scayt._s;
					if ( ins && ins._SCAYT_control)
					ins._SCAYT_control.destroy();
				});

                ed.onInit.add(function(){

                    s._params.srcNodeRef = DOM.get(ed.editorId+'_ifr');// Get the iframe.
                    var startup = ed.getParam('scayt_auto_startup');
                    if ( startup == true && !tinymce._scayt_start_load){
                        t._loadEngine();
                    } else if (startup == true && tinymce._is_scayt_loaded) { // if multi editors are loaded
                        s._initScayt();
                    }
					ed.selection.onSetContent.add(function(){
	                    var ins = t._get_instance();
						if (ins && ins._SCAYT_control )
		                    window.setTimeout(function (){
								ins._SCAYT_control.refresh();
		                    },100);
                	});
                });
				
				ed.onPreProcess.add(function(ed,o){
					var ins = t._get_instance(ed);
                    if ( ins && ins._SCAYT_control && o.node && o.node.innerHTML)
                        o.node.innerHTML = ins._SCAYT_control.reset(o.node.innerHTML);
					 
					return o;
				});

				//contextmenu
				//ed.onChange.add(t._refresh("onChange"));
                ed.onPaste.add(function(){
                    window.setTimeout(function (){
                        var ins = t._get_instance(ed);
                        ins && ins._SCAYT_control && ins._SCAYT_control.refresh();
                    },100);
                });
               
                ed.onUndo.add(t._refresh("onUndo"));
                ed.onRedo.add(t._refresh("onRedo"));

                if (ed.theme.onResolveName) {
                    ed.theme.onResolveName.add(function(aTheme, aNode){
                        var nodeAttr = aNode.node.getAttribute('data-scaytid') || aNode.node.getAttribute('data-scayt_word'),
                            pathNode = DOM.get(ed.id + '_path'), _childNode;

                        if (aNode.node.nodeName.toLowerCase() == "span" && nodeAttr) {
                            aNode.name = "";
                            clearTimeout(timeout);
                            var timeout = setTimeout(function() {
                                _childNode = pathNode.lastChild;
                                _childNode.parentNode.removeChild(_childNode);
                            }, 100);
                        }
                        
                    });
                };
               
                ed.onSetContent.add(function(){
                    
                    var ins = t._get_instance();
					
					window.setTimeout(function (){
                        ins && ins._SCAYT_control && ins._SCAYT_control.refresh();

                    },100);
                });

                  ed.onBeforeExecCommand.add(function(c, u, v){
                   
                   // Bug #7038 Plugin for TinyMCE: SCAYT causes JS error on several change to fullscreen editing mode
                   // Only way to refresh scayt after Full Screen mode
                   // Full Screen mode don't destroy because the editor remove next way "tinyMCE.remove(ed);"
                   if (ed.getParam('fullscreen_is_enabled')) {
                             var fullScreenInterval = setInterval(function() {
                                
                                var parentEditor = tinymce.editors[ed.getParam('fullscreen_editor_id')];    
                                if (tinymce.DOM.get('mce_fullscreen_container') == null){ 
                                parentEditor.plugins.scayt._s._SCAYT_control.refresh();
                                clearInterval(fullScreenInterval);
                                return false;
                                }
                            }, 1000);  
                        }   

                      if(u == "mceFullScreen" && ed.getParam('fullscreen_is_enabled'))
                        {
                            var ins = c.plugins.scayt._s;
                            if ( ins && ins._SCAYT_control)
                                ins._SCAYT_control.destroy();
                                    
                        }else if(u == "mceFullScreen" && typeof ed.getParam('fullscreen_is_enabled') == "undefined"){
                            ed.settings.scayt_slang = ed.plugins.scayt._s._SCAYT_control.getLang();
                        } 
                }); 



                //register public scayt  tool
                tinymce.cleanScaytMarkup = function( s ) {
                    if (!s) return "";
                    var ins = t._get_instance();
                    if (ins && ins._SCAYT_control && ins._SCAYT_control.reset) {
                        s = ins._SCAYT_control.reset(s);
                    }
                    return s;
                };

                /*
                * register commands
                */
                ed.addCommand('mceScaytToggle', function(){
                    t._enableMenuTabs();
                    if (tinymce._scayt_start_load == true && tinymce._is_scayt_loaded == false){
                        return null;
                    }
                    if (s._status == false) { // scayt is disabled
                        return t._enable(s);
                    }else if (s._status == true){// scayt is enabled
                        return t._disable(s);
                    }else if (tinymce._is_scayt_loaded == false){// scayt is not loaded
                        return t._loadEngine();
                    }else if (tinymce._is_scayt_loaded == true){
                        return s._initScayt();
                    }

                });
                
            },

            /**
            * Returns information about the plugin as a name/value array.
            * The current keys are longname, author, authorurl, infourl and version.
            *
            * @returns Name/value array containing information about the plugin.
            * @type Array
            */
            getInfo : function() {
                return {
                    longname : ed.getLang('scayt.long_name', 'SpellCheckAsYouType'),
                    author : 'WebSpellChecker.net',
                    authorurl : 'http://www.webspellchecker.net/',
                    infourl : 'http://www.webspellchecker.net/',
                    version : "1.1 r$revision"
                };
            },
            createControl : function(n, cm) {
				 
                if (n == 'scayt') {

                    var t = this, c, ed = t.editor;

                    c = cm.createSplitButton(n, {title : ed.getLang('scayt.tb_button_title_enable', 'Start SpellCheckAsYouType'),
                                                cmd   : 'mceScaytToggle',
                                                sce : t,
                                                image : t._url + '/img/scayt.gif'});
					

                    // prepare menuitems stack depends on scayt ui tabs enabled/disabled on start up (default all tabs)

                    //read ui params
                    var tabs = ed.getParam('scayt_ui_tabs') || "1,1,1,1";
                    tabs = tabs.split(',');
					for (var i=0, l = 4; i<l ; i++){
						if ( typeof tabs[i] == 'undefined' )
							tabs[i] ="1";
					}
                    var uiTabs = [];
                    for (var i=0,l=tabs.length; i<l; i++){
                        var flag = parseInt(tabs[i]);
                        uiTabs.push(  flag  );
                    }
                    this.uiTabs = uiTabs;
					
					// tabs titles
                    var tabTitles = [
                        {
                            title: ed.getLang('scayt.tb_menu_options', 'SCAYT Options'),
                            onclick: function(){
                                t._create_ui_pup(0);//options
                            }
                        },
                        {
                            title: ed.getLang('scayt.tb_menu_languages', 'SCAYT Languages'),
                            onclick: function(){
                                t._create_ui_pup(1); //langs
                            }
                        },
                        {
                            title: ed.getLang('scayt.tb_menu_dictionaries', 'SCAYT Dictionaries'),
                            onclick: function(){
                                t._create_ui_pup(2); //dictionary
                            }
                        },
                        {
                            title: ed.getLang('scayt.tb_menu_about', 'About SCAYT'),
                            onclick: function(){
                                t._create_ui_pup(3, ed);//about
                            }
                        }
                    ];

                    c.onRenderMenu.add(function(c, m) {
						 
                        for (var i = 0, l = uiTabs.length; i < l; i++) {
                            if (uiTabs[i] == 1 ){
                                m.add(tabTitles[i]);
								 
                            }
                        }
						t.tabsHash =  m.items;

						for(var key in m.items){
                            if(ed.plugins.scayt && ed.plugins.scayt._s && ed.plugins.scayt._s._SCAYT_control)
							 m.items[key].disabled = ed.plugins.scayt._s._SCAYT_control.disabled;
                                else
                                   m.items[key].disabled = true;
						}
						 
						
                    });

					tinymce.EditorManager.Editor.prototype.isDirty = function()
					{
						var ins = t._get_instance();
						
						if(ins && ins._SCAYT_control)
						{
							var startContent = tinymce.trim(ins._SCAYT_control.reset(ed.startContent));
							var getContent = tinymce.trim(ins._SCAYT_control.reset(ed.getContent({format : 'raw', no_events : 1})));
						}
						else
						{	
							var startContent = tinymce.trim(ed.startContent);
							var getContent = tinymce.trim(ed.getContent({format : 'raw', no_events : 1}));
						}	
						return (getContent != startContent) && !ed.isNotDirty;
					}
					
					
                    return c;
                }

            }

        });
        // Register plugin
        tinymce.PluginManager.add('scayt', tinymce.plugins.scayt);
      
})();