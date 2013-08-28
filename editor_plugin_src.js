/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('scayt');
	
	var doc = tinymce.DOM;

	tinymce.create('tinymce.plugins.scaytPlugin', {
		
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		options: {
			scayt_auto_startup: false,
			scayt_customer_id: null,
			scayt_context_moresuggestions: null, // /*String*/ (on || off)
			scayt_context_commands: null, // /*String*/ (add || ignore || ignoreall || all || off)
			scayt_max_suggestion: null,
			scayt_ui_tabs: null,
			scayt_custom_url: ""
		},

		optionDefinition: {
			scayt_custom_url: {
				type: "string",
				"default": "//svc.webspellchecker.net/spellcheck31/lf/scayt3/tinymce/tinymcescayt.js"
			},

			scayt_auto_startup: {
				type: "boolean",
				"default": false
			},
			
			scayt_customer_id: {
				type: "string",
				"default": '1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2'
			},

			scayt_max_suggestion: {
				type: "number",
				"default": 5
			},

			scayt_context_moresuggestions: {
				type: "string",
				"default": "on",
				allowable: {
					on: true,
					off: true
				}	
			},
			scayt_context_commands: {
				type: "string",
				"default": "add,ignore,ignoreall"
			},
			scayt_context_menu_items_order: {
				type: "string",
				"default": "suggest,moresuggest,control"
			},
			scayt_ui_tabs: {
				type: "string",
				"default": "1,1,1"
			}
		},

		parseOptions: function(editor){
			var self = this,
				option = self.options,
				optionDefinition = self.optionDefinition,
				settings = editor.settings;

			// checking right type of config
			var checkType = function(optionName){
				return (typeof editor.getParam(optionName) === optionDefinition[optionName].type);
			}

			var getDefault = function(optionName){
				return self.optionDefinition[optionName]["default"];
			}

			var isAllowable = function(optionName){
				return  (editor.getParam(optionName) in self.optionDefinition[optionName]["allowable"]);
			}			

			// TODO make function for code below

			settings.scayt_auto_startup = (checkType("scayt_auto_startup")) ? editor.getParam("scayt_auto_startup") : getDefault("scayt_auto_startup");
			
			settings.scayt_customer_id = (checkType("scayt_customer_id")) ? editor.getParam("scayt_customer_id") : getDefault("scayt_customer_id");
			
			settings.scayt_max_suggestion = (checkType("scayt_max_suggestion")) ? editor.getParam("scayt_max_suggestion") : getDefault("scayt_max_suggestion");

			// Oksana provide the feature if scayt_context_moresuggestions is wrong we disable moresuggestions. I thins it isn't correct
			settings.scayt_context_moresuggestions = (checkType("scayt_context_moresuggestions") && isAllowable("scayt_context_moresuggestions")) ? editor.getParam("scayt_context_moresuggestions") : "off";

			settings.scayt_ui_tabs = (checkType("scayt_ui_tabs")) ? editor.getParam("scayt_ui_tabs") : getDefault("scayt_ui_tabs");

			settings.scayt_context_commands = (checkType("scayt_context_commands")) ? editor.getParam("scayt_context_commands") : getDefault("scayt_context_commands");

			settings.scayt_context_menu_items_order = (checkType("scayt_context_menu_items_order")) ? editor.getParam("scayt_context_menu_items_order") : getDefault("scayt_context_menu_items_order");

			//settings.scayt_context_menu_items_order = settings.scayt_context_menu_items_order.split(",");

			settings.scayt_custom_url = (checkType("scayt_custom_url")) ? editor.getParam("scayt_custom_url") : getDefault("scayt_custom_url");



			if(settings.scayt_context_commands === "all"){
				settings.scayt_context_commands = getDefault("scayt_context_commands");
			}else if(settings.scayt_context_commands === "off"){
				settings.scayt_context_commands = "";
			}

			//settings.scayt_context_commands = settings.scayt_context_commands.split(","); // convert string in array
		},

		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mcescayt');

			var self = this;
			self.editor = ed;
			self._url = url;

			self.parseOptions(ed);

			self.onScaytReady.add(function(){
				// autoStartup starting. Checking before create instance

				for(var i = 0; i < self.startingStack.length; i++){

					self.scayt.createScayt(tinymce.editors[self.startingStack[i]]);
					
				}

				self.startingStack = [];

			});

			ed.addCommand('mcescayt', function(data){

				if(!self.scayt.getScayt(self.editor).enabled){
					self.scayt.createScayt(self.editor);
					ed.controlManager.controls[ed.id + "_" + "scayt"].setActive(1);
				}else{
					self.scayt.destroy(self.editor);
					ed.controlManager.controls[ed.id + "_" + "scayt"].setActive(0);
				}
				self.toggleToolbarMenuButtons(self.toolbarScaytTabs);
			});

			if (ed.theme.onResolveName) {
                ed.theme.onResolveName.add(function(th, o) {
                	// TODO remove hardcode ->
                    if (o.node.nodeName == "SPAN" && ed.dom.hasClass(o.node, "red")) {
                        o.name = "";
                    }
                });
            }

			ed.onInit.add(function(ed) {

				self.loadScaytLibriary(ed);
			});

			tinymce.onRemoveEditor.add(function(tinymce, ed){
				var scaytInstance = self.scayt.getScayt(ed);
				if (!scaytInstance || scaytInstance.enabled === false)
					return;

				if (scaytInstance.enabled){
					self.scayt.destroy(ed);
				}
			});

			ed.onBeforeSetContent.add(function(ed, o) {
				// We shouldn't remove markup because 
				/*var scaytInstance = self.scayt.getScayt(ed);

				if (!scaytInstance || scaytInstance.enabled === false)
					return;

				o.content = scaytInstance.removeMarkupFromString(o.content);*/

			});

			ed.onRemove.add(function(ed) {
				var scaytInstance = self.scayt.getScayt(ed);
				if (!scaytInstance || scaytInstance.enabled === false)
					return;


				if (scaytInstance.enabled){
					self.scayt.destroy(ed);
				}
			});

			ed.onBeforeExecCommand.add(function(ed, cmd, ui, val) {
				var scaytInstance = self.scayt.getScayt(ed);

				if (!scaytInstance || scaytInstance.enabled === false)
					return;

				if (cmd === 'mceCodeEditor') 
				{	
					self.scayt.destroy(ed);
					//self.scayt.startWaitingForStart(ed);
					
					setTimeout(function(){
						self.scayt.createScayt(ed);
					},0);

				}else if(cmd === 'mceInsertContent'){
					setTimeout(function() { 
						scaytInstance.removeMarkupInSelectionNode();
						scaytInstance.fire("startSpellCheck");
					}, 0);
				}

				
				// TODO: add functionality

				// Bug #7038 Plugin for TinyMCE: SCAYT causes JS error on several change to fullscreen editing mode
				// Only way to refresh scayt after Full Screen mode
				// Full Screen mode don't destroy because the editor remove next way "tinyMCE.remove(ed);"
				
				if(cmd == "mceFullScreen" && typeof ed.getParam('fullscreen_is_enabled') == "undefined"){
					ed.settings.scayt_slang = scaytInstance.getLang();
				} 				
			});

			ed.onPaste.add(function(ed, e) {
				var scaytInstance = self.scayt.getScayt(ed);
				if (!scaytInstance || scaytInstance.enabled === false)
					return;

				setTimeout(function (){
					var scaytInstance = self.scayt.getScayt(ed);
					scaytInstance.removeMarkupInSelectionNode();
					scaytInstance.fire("startSpellCheck");
				},0);
				
			});

			ed.onUndo.add(function(){
				// We shouldn't recheck document because it was done on SetContent event
				/*var scaytInstance = self.scayt.getScayt(ed);
				
				if (!scaytInstance || scaytInstance.enabled === false)
					return;
				
				setTimeout(function() { 
					scaytInstance.fire("startSpellCheck");
				}, 0);*/
			});
			
			ed.onRedo.add(function(){
				/*var scaytInstance = self.scayt.getScayt(ed);
				
				if (!scaytInstance || scaytInstance.enabled === false)
					return;
				
				setTimeout(function() { 
					scaytInstance.fire("startSpellCheck");
				}, 0);*/
			});

			ed.onSetContent.add(function(ed, o) {
				var scaytInstance = self.scayt.getScayt(ed);
				if (!scaytInstance || scaytInstance.enabled === false)
					return;

				setTimeout(function() {
					scaytInstance.removeMarkupInSelectionNode();
					scaytInstance.fire("startSpellCheck");
				}, 0);
			});

			// Filtering data onPaste i.e.
			ed.onPreProcess.add(function(ed,o){
				var scaytInstance = self.scayt.getScayt(ed);
				if (!scaytInstance || scaytInstance.enabled === false){
					return o;	
				}
			   
				o.node.innerHTML = scaytInstance.removeMarkupFromString(o.node.innerHTML);
				 
				return o;
			});
		},

		toolbarScaytTabs: null,
		isLoadingStarted: false,
		//defaultScript: "//svc.webspellchecker.net/spellcheck31/lf/scayt3/tinymce/tinymcescayt.js",
		onScaytReady: new tinymce.util.Dispatcher(),
		isScaytReady: false,

		openDialog: function(index, editor, scaytInstance){
			var self = this;
			var uiTitles = [
				"options",
				"langs",
				"dictionary",
				"about"
			];

			editor.focus();

			editor.settings.scaytDialogMode = uiTitles[index];
			
			editor.windowManager.open({
				file : self._url + '/ui.html',
				width: '450',
				height: '300',
				inline : 1
			}, {
				mode : uiTitles[index],
				s: scaytInstance
			}); 
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */

		menu: {
			getSelectionWord: function(scaytInstance){
				if(!scaytInstance.enabled){
					return false;
				}
				
				var selectionNode = scaytInstance.getSelectionNode();

				if(selectionNode){
					var word = selectionNode.getAttribute(scaytInstance.getNodeAttribute());
				}else{
					var word = selectionNode;
				}

				return word
			}
		},

		createControl : function(n, cm) {
			if(n !== "scayt"){
				return;
			}
			var self = this, controlManager, editor = self.editor;
			var contextMenu = self.editor.plugins.scaytcontextmenu || self.editor.plugins.contextmenu;
			var scaytInstance = self.scayt.getScayt(editor);

			controlManager = cm.createSplitButton(n, {title : 'scayt.desc',
										cmd   : 'mcescayt',
										sce : self,
										image : self._url + '/img/scayt.gif'});
			
			var containsItemInArray = function(array, obj) {
				var i = array.length;
				while (i--) {
				   if (array[i] === obj) {
					   return true;
				   }
				}
				return false;
			}

			// prepare menuitems stack depends on scayt ui tabs enabled/disabled on start up (default all tabs)
		
			// tabs titles

			/*ed.addCommand('mceScaytDilog', function() {
				
			});*/

			var tabTitles = [
				{
					title: editor.getLang('scayt.tb_menu_options'),
					onclick: function(data){
					   self.openDialog(0, editor, scaytInstance);
					}
				},
				{
					title: editor.getLang('scayt.tb_menu_languages'),
					onclick: function(){
						self.openDialog(1, editor, scaytInstance);
					}
				},
				{
					title: editor.getLang('scayt.tb_menu_dictionaries'),
					onclick: function(){
						self.openDialog(2, editor, scaytInstance);
					}
				},
				{
					title: editor.getLang('scayt.tb_menu_about'),
					onclick: function(){
						self.openDialog(3, editor, scaytInstance);
					}
				}
			];


			// {Event} render tabs in toolbar
			controlManager.onRenderMenu.add(function(control, menu) {
				var _scayt_ui_tabs = editor.settings.scayt_ui_tabs.split(",");
				// Add about tab. It should be displayed anyway`
				_scayt_ui_tabs.push("1");
				for (var i = 0, l = tabTitles.length; i < l; i++) {
					if(!parseInt(_scayt_ui_tabs[i])){
						continue;
					}
					menu.add(tabTitles[i]);
				}

				self.toolbarScaytTabs = menu.items;

				self.toggleToolbarMenuButtons(self.toolbarScaytTabs);

			});

			if (contextMenu) {
				setTimeout(function(){
					contextMenu.onContextMenu.add(function(contextMenu, menu, element){
						// There isn't ability to set order of calling callback. We add callback for running context menu after table callback because table removes all menu items.
							
						var scaytInstance = self.scayt.getScayt(editor),
							word = self.menu.getSelectionWord(scaytInstance);

						// Check if isset scayt word on right click
						if(!word){
							return;
						}
						
						// Generate suggestion for SCAYT word
						scaytInstance.fire("getSuggestionsList", { lang: scaytInstance.getLang(), word: word });

						// Define local vars for tinymce menu
						var moresuggest_group = [], // more suggestions list
							control_group = [], // options ... and other features will be added to menu
							suggest_group = [], // suggestion definition
							suggestions = self.scayt.suggestions, // suggestion list
							sub_menu = null, // subMenu object for more suggestions in menu
							createMenuCommand =  function  (scaytInstance, suggestion ) {
								var cmd = 'scayt' + suggestion;

								editor.addCommand(cmd, function(){
									var replacement = suggestion;
									scaytInstance.replaceSelectionNode({ word: replacement });
								});

								return cmd;
							}, // Define generator of commands that should be runned on every SCAYT menu item	
							suggestMenuItem = {
								title: null,
								icon: '',
								cmd: null
							}; // definition for suggestion, will be added to all suggestions in menu
							

							var controlGroupDefinition = {
								add: {
									title: "scayt.cm_add_word",
									icon: '',
									cmd: "scayt_add_word"
								},
								ignore: {
									title: editor.getLang("scayt.cm_ignore_word", "Ignore word"),
									icon: '',
									cmd: "scayt_ignore_word"
								},
								ignoreall: {
									title: editor.getLang("scayt.cm_ignore_all", "Ignore all"),
									icon: '',
									cmd: "scayt_ignore_all_words"
								}
							}
							// suggestion generation for tinymce menu
							for (var i = 0, l = suggestions.length; i < l; i += 1) {
								
								suggestMenuItem = {
									title: (suggestions.length > 1) ? suggestions[i] : 'scayt.' + suggestions[i],
									icon: '',
									cmd: (suggestions.length > 1) ? createMenuCommand(scaytInstance, suggestions[i]) : ''
								}; 
								
								
								if (i < editor.getParam("scayt_max_suggestion")) {
									suggest_group.push(suggestMenuItem); // add main suggestions to menu
								}
								else if (editor.getParam("scayt_context_moresuggestions") === "on") {
									moresuggest_group.push(suggestMenuItem); // add item to the more suggestions submenu group
								}
							}

							
							
							// Add single commands

							

							editor.addCommand("scayt_add_word", function(){
								scaytInstance.addWordToUserDictionary();
							});
							
							editor.addCommand("scayt_ignore_word", function(){
								scaytInstance.ignoreWord();
							});
							 

							editor.addCommand("scayt_ignore_all_words", function(){
								scaytInstance.ignoreAllWords( );
							});


							var _scayt_context_commands = editor.getParam("scayt_context_commands").split(",");
							for(var controlItem in controlGroupDefinition){
								if(containsItemInArray(_scayt_context_commands, controlItem)){
									 control_group.push(controlGroupDefinition[controlItem]);
								}
							}
						
							editor.addCommand("scayt_about", function(){
								self.openDialog(3, editor, scaytInstance);
							});
							
							control_group.push({
								title: editor.getLang("scayt.cm_about", "About SCAYT"),
								icon: 'scayt_about',
								cmd: "scayt_about"
							});

							var menuRender = {
								moresuggest: function(){
									menu.addSeparator();
							
									if (!sub_menu && suggestions.length > 1 && editor.getParam("scayt_context_moresuggestions") === "on"){
										menu.addSeparator();
										
										sub_menu = menu.addMenu({
											title: "scayt.cm_more_suggestions"
										});

										menu.addSeparator();
									}
									
									for (var i=0; i<moresuggest_group.length; i++){
										sub_menu.add(moresuggest_group[i]);
									}
								},
								control: function(){
									menu.addSeparator();

									for (var i=0; i<control_group.length; i++){
										menu.add(control_group[i]);
									}
								},
								suggest: function(){
									menu.addSeparator();

									for (var i=0; i<suggest_group.length; i++){
										menu.add(suggest_group[i]);
									}
								}
							};

							var menuOrderDeclaration = editor.getParam("scayt_context_menu_items_order").split(",");

							// necessary for menu type ordering
							for(var menuItem = 0; menuItem < menuOrderDeclaration.length; menuItem++){
								
								(typeof menuRender[menuOrderDeclaration[menuItem]] === "function") &&
									menuRender[menuOrderDeclaration[menuItem]]();
							}

							menu.addSeparator();

						//
						scaytInstance.showBanner('#menu_'+contextMenu._menu.id+'_co');

					});
				}, 0);
			}

			tinymce.EditorManager.Editor.prototype.isDirty = function()
			{	
				var scaytInstance = self.scayt.getScayt(editor);
				
				if(scaytInstance && scaytInstance.enabled === true)
				{
					var startContent = tinymce.trim(scaytInstance.removeMarkupFromString(editor.startContent));
					var getContent = tinymce.trim(scaytInstance.removeMarkupFromString(editor.getContent({format : 'raw', no_events : 1})));
				}
				else
				{	
					var startContent = tinymce.trim(editor.startContent);
					var getContent = tinymce.trim(editor.getContent({format : 'raw', no_events : 1}));
				}	
				return (getContent != startContent) && !editor.isNotDirty;
			}
			
			
			return controlManager;
		},

		isScriptLoaded: function(){
			var self = this;
			var scripts = tinymce.DOM.doc.getElementsByTagName("script");
			
			for(var i = 0; i < scripts.length; i++ ){
				if(scripts[i].src == self.editor.settings.scayt_custom_url){
					return true;
				}
			}

			return false;
		},

		startingStack: [],

		loadScaytLibriary: function(editor){
			var self = this;
			var protocol = document.location.protocol;
			// Default to 'http' for unknown.
			protocol = protocol.search( /https?:/) != -1? protocol : 'http:';
			var baseUrl  = self.editor.settings.scayt_custom_url;
			if(!self.isScriptLoaded() && (typeof window.SCAYT === "undefined" || (typeof window.SCAYT !== "undefined" && typeof window.SCAYT.TINYMCE !== "function")) && !self.isScaytReady && !tinymce.isLoadingStarted){
				if(editor.settings.scayt_auto_startup){
					self.startingStack.push(editor.id);
				}

				var scriptLoader = new tinymce.dom.ScriptLoader();
				
				tinymce.isLoadingStarted = true;
				scriptLoader.add(baseUrl);
				scriptLoader.loadQueue(function(){
					self.onScaytReady.dispatch();
					self.isScaytReady = true;
					tinymce.isLoadingStarted = false;
				});

			}else if(typeof window.SCAYT !== "object" &&  typeof window.SCAYT !== "undefined" && typeof window.SCAYT.TINYMCE === "function"){
				if(editor.settings.scayt_auto_startup){
					self.startingStack.push(editor.id);
				}
				self.onScaytReady.dispatch();
			}else if(tinymce.isLoadingStarted){
				if(editor.settings.scayt_auto_startup){
					self.startingStack.push(editor.id);
				}
			}
			
		},				

		toggleToolbarMenuButtons: function(menuItems /* Array */){
			var self = this;
			var scaytInstance = self.scayt.getScayt(self.editor);

			for(var item in menuItems){
				menuItems[item].setDisabled(!scaytInstance.enabled);
			}
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'scayt',
				author : 'WebSpellChecker.net',
				authorurl : 'http://www.webspellchecker.net/',
				infourl : 'http://www.webspellchecker.net/',
				version : "1.0"
			};
		},
		instances: {

		},
		scayt: {
			suggestions: [],
			loaded: false,
			options: {
				disablingCommandExec: {
					source: true,
					newpage: true,
					templates: true
				}
			},
			createScayt : function( editor )
			{	
				var self = this;
				//var container = editor.getContentAreaContainer().children[0];

				if(this.getScayt(editor).enabled)
					return;

				var _scaytInstanceOptions = {
					debug 				: false,
					lang 				: editor.getParam("scayt_slang") || 'en_US',
					container 			: editor.getContentAreaContainer().children[0],
					customDictionary	: editor.getParam("scayt_custom_dic_ids"),
					userDictionaryName 	: editor.getParam("scayt_user_dic_name"),
					localization		: editor.langCode,
					customer_id			: editor.getParam("scayt_customer_id")
				};

				var t = editor.getParam('scayt_service_protocol');
				if (editor.getParam('scayt_service_protocol')) {
					_scaytInstanceOptions['service_protocol'] = editor.getParam('scayt_service_protocol');
				}

				if (editor.getParam('scayt_service_host')) {
					_scaytInstanceOptions['service_host'] = editor.getParam('scayt_service_host');
				}

				if (editor.getParam('scayt_service_port')) {
					_scaytInstanceOptions['service_port'] = editor.getParam('scayt_service_port');
				}

				if (editor.getParam('scayt_service_path')) {
					_scaytInstanceOptions['service_path'] = editor.getParam('scayt_service_path');
				}
				
				var _scaytInstance = new SCAYT.TINYMCE(_scaytInstanceOptions, function(){
					/*if(tinymce.isGecko){
						editor.setContent(_scaytInstance.removeMarkupFromString(editor.getContent()));
						_scaytInstance.fire("startSpellCheck");
					}*/

					_scaytInstance.enabled = true;

				}, function(){
					// error callback
				});

				editor.controlManager.controls[editor.id + "_" + "scayt"].setActive(1);

				_scaytInstance.subscribe("suggestionListSend", function(data) {
					// TODO: maybe store suggestions for specific editor 
					self.suggestions = data.suggestionList;
				});
				//_scaytInstance.enabled = !_scaytInstance.enabled || true;
				
				tinymce.editors[editor.id].plugins["scayt"].instances[editor.id] = _scaytInstance;
			},
			destroy: function(editor)
			{
				var self = this,
					scaytInstance = self.getScayt(editor);

				if(scaytInstance.enabled !== false)
				{	
					scaytInstance.destroy();
				}
			},
			isScaytEnabled : function( editor )
			{
				var scayt_instance = this.getScayt( editor );
				return ( scayt_instance ) ? scayt_instance.disabled === false : false;
			},
			getScayt : function( editor )
			{
				return editor.plugins["scayt"].instances[editor.id] || { enabled : false };
			},
			getLanguages: function(){
				var scayt_instance = this.getScayt( editor );
			}
		}
	});

	// Register plugin
	tinymce.PluginManager.add('scayt', tinymce.plugins.scaytPlugin);
})();