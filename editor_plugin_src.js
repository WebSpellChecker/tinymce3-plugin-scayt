/**
 *
 * Copyright 2014, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	'use strict';

	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('scayt');

	// Create SCAYT namespace in tinymce.plugins
	tinymce.createNS('tinymce.plugins.SCAYT');
	
	tinymce.plugins.SCAYT = (function() {
		var state = {},
			instances = {},
			suggestions = [],
			loadingHelper = {
				loadOrder: []
			},
			backCompatibilityMap = {
				'scayt_context_commands'		: 'scayt_contextCommands',
				'scayt_slang'					: 'scayt_sLang',
				'scayt_max_suggestion'			: 'scayt_maxSuggestions',
				'scayt_custom_dic_ids'			: 'scayt_customDictionaryIds',
				'scayt_user_dic_name'			: 'scayt_userDictionaryName',
				'scayt_ui_tabs'					: 'scayt_uiTabs',
				'scayt_service_protocol'		: 'scayt_serviceProtocol',
				'scayt_service_host'			: 'scayt_serviceHost',
				'scayt_service_port'			: 'scayt_servicePort',
				'scayt_service_path'			: 'scayt_servicePath',
				'scayt_context_moresuggestions'	: 'scayt_moreSuggestions',
				'scayt_customer_id'				: 'scayt_customerId',
				'scayt_custom_url'				: 'scayt_srcUrl',
				'scayt_auto_startup'			: 'scayt_autoStartup',
				'scayt_context_menu_items_order': 'scayt_contextMenuItemsOrder'
			};

		var replaceOldOptionsNames = function(config) {
			for(var key in config) {
				if(key in backCompatibilityMap) {
					config[backCompatibilityMap[key]] = config[key];
					delete config[key];
				}
			}
		};

		var loadScaytLibrary = function(editor, callback) {
			var protocol = document.location.protocol;
			var baseUrl = editor.getParam('scayt_srcUrl');
			// Default to 'http' for unknown.
			protocol = protocol.search(/https?:/) !== -1 ? protocol : 'http:';
			baseUrl = baseUrl.search(/^\/\//) === 0 ? protocol + baseUrl : baseUrl;

			if(typeof window.SCAYT === 'undefined' || typeof window.SCAYT.TINYMCE !== 'function') {
				var scriptLoader = new tinymce.dom.ScriptLoader();

				// add onLoad callbacks for editors while SCAYT is loading
				loadingHelper[editor.id] = callback;
				loadingHelper.loadOrder.push(editor.id);

				scriptLoader.add(baseUrl);
				scriptLoader.loadQueue(function(success) {
					var editorName;

					tinymce.plugins.SCAYT.fireOnce(tinymce, 'onScaytReady');

					for(var i = 0; i < loadingHelper.loadOrder.length; i++) {
						editorName = loadingHelper.loadOrder[i];

						if(typeof loadingHelper[editorName] === 'function') {
							loadingHelper[editorName](tinymce.editors[editorName]);
						}

						delete loadingHelper[editorName];
					}
					loadingHelper.loadOrder = [];
				});
			} else if(window.SCAYT && typeof window.SCAYT.TINYMCE === 'function') {
				tinymce.plugins.SCAYT.fireOnce(tinymce, 'onScaytReady');

				if(!tinymce.plugins.SCAYT.getScayt(tinymce.editors[editor.id])) {
					if(typeof callback === 'function') {
						callback(editor);
					}
				}
			}
		};

		var createScayt = function(editor) {
			loadScaytLibrary(editor, function(_editor) {
				var _scaytInstanceOptions = {
					lang 				: _editor.getParam('scayt_sLang'),
					container 			: _editor.getContentAreaContainer().children[0],
					customDictionary	: _editor.getParam('scayt_customDictionaryIds'),
					userDictionaryName 	: _editor.getParam('scayt_userDictionaryName'),
					localization		: _editor.getParam('language') || 'en',
					customer_id			: _editor.getParam('scayt_customerId'),
					data_attribute_name : _editor.plugins.scayt.options.dataAttributeName,
					misspelled_word_class : _editor.plugins.scayt.options.misspelledWordClass
				};

				if(_editor.getParam('scayt_serviceProtocol')) {
					_scaytInstanceOptions['service_protocol'] = _editor.getParam('scayt_serviceProtocol');
				}

				if(_editor.getParam('scayt_serviceHost')) {
					_scaytInstanceOptions['service_host'] = _editor.getParam('scayt_serviceHost');
				}

				if(_editor.getParam('scayt_servicePort')) {
					_scaytInstanceOptions['service_port'] = _editor.getParam('scayt_servicePort');
				}

				if(_editor.getParam('scayt_servicePath')) {
					_scaytInstanceOptions['service_path'] = _editor.getParam('scayt_servicePath');
				}
				
				var scaytInstance = new SCAYT.TINYMCE(_scaytInstanceOptions,
					function() {
						// success callback

					},
					function() {
						// error callback

				});

				scaytInstance.subscribe('suggestionListSend', function(data) {
					suggestions = data.suggestionList;
				});

				instances[_editor.id] = scaytInstance;
			});
		};
		var destroyScayt = function(editor) {
			var scaytInstance = instances[editor.id];

			if(scaytInstance) {
				scaytInstance.destroy();
			}

			delete instances[editor.id];
		};

		return {
			create: function(editor) {
				return createScayt(editor);
			},
			destroy: function(editor) {
				return destroyScayt(editor);
			},
			getScayt: function(editor) {
				return instances[editor.id] || false;
			},
			getSuggestions: function() {
				return suggestions;
			},
			getState: function(editor) {
				var editorName = (typeof editor === 'object') ? editor.id : editor;
				return state[editorName];
			},
			setState: function(editor, status) {
				var editorName = (typeof editor === 'object') ? editor.id : editor;
				status = status || false;
				return state[editorName] = status;
			},
			replaceOldOptionsNames: function(config) {
				replaceOldOptionsNames(config);
			},
			fireOnce: function(obj, event) {
				if(!obj['uniqueEvtKey_' + event]) {
					obj['uniqueEvtKey_' + event] = true;
					obj[event].dispatch();
				}
			}
		};
	}());

	// Create Scayt Plugin constructor
	var ScaytPlugin = function(editor, path) {
		this.undoManager = null,
		this.options = {
			disablingCommandExec: {
				mceCodeEditor: true,
				mceNewDocument: true,
				mceTemplate: true,
				mceFullScreen: false,
				mceInsertContent: false,
				mceSetContent: false
			},
			url: path || null,
			dataAttributeName: 'data-scayt-word',
			misspelledWordClass: 'scayt-misspell-word'
		};

		this.parseConfig = {
			_definitions: {
				scayt_srcUrl: {
					type: 'string',
					'default': '//svc.webspellchecker.net/spellcheck31/lf/scayt3/tinymce/tinymcescayt.js'
				},
				scayt_sLang: {
					type: 'string',
					'default': 'en_US'
				},
				scayt_autoStartup: {
					type: 'boolean',
					'default': false
				},
				scayt_maxSuggestions: {
					type: 'number',
					'default': 5
				},
				scayt_moreSuggestions: {
					type: 'string',
					'default': 'on'
				},
				scayt_contextCommands: {
					type: 'string',
					'default': 'add,ignore,ignoreall'
				},
				scayt_contextMenuItemsOrder: {
					type: 'string',
					'default': 'suggest,moresuggest,control'
				},
				scayt_uiTabs: {
					type: 'string',
					'default': '1,1,1'
				},
				scayt_customDictionaryIds: {
					type: 'string',
					'default': ''
				},
				scayt_userDictionaryName: {
					type: 'string',
					'default': null
				},
				scayt_serviceProtocol: {
					type: 'string',
					'default': null
				},
				scayt_serviceHost: {
					type: 'string',
					'default': null
				},
				scayt_servicePort: {
					type: 'string',
					'default': null
				},
				scayt_servicePath: {
					type: 'string',
					'default': null
				}
			}, 
			getValue: function(optionName) {
				return this._definitions[optionName].value;
			},
			setValue: function(optionName, newValue) {
				var self = this,
					value = newValue || '',
					settings = editor.settings;

				return self._definitions[optionName].value = settings[optionName] = value;
			},
			_parseOptions: function(editor) {
				var self = this,
					settings = editor.settings,
					definitions = self._definitions,
					_SCAYT = tinymce.plugins.SCAYT,
					patt = /\s?[\|]+\s?/gi;

				// preprocess settings for backward compatibility
				_SCAYT.replaceOldOptionsNames(settings);

				for(var optionName in definitions) {
					if(definitions.hasOwnProperty(optionName) && typeof editor.getParam(optionName) === definitions[optionName].type) {

						definitions[optionName].value = settings[optionName] = editor.getParam(optionName);

						// process 'scayt_maxSuggestions' option
						if(optionName === 'scayt_maxSuggestions' && editor.getParam(optionName) < 0) {
							definitions[optionName]['value'] = settings[optionName] = definitions[optionName]['default'];
						}

						// process 'scayt_contextCommands' option
						if(optionName === 'scayt_contextCommands') {
							if(editor.getParam(optionName) === 'off') {
								definitions[optionName]['value'] = settings[optionName] = '';
							} else if(editor.getParam(optionName) === 'all') {
								definitions[optionName]['value'] = settings[optionName] = definitions[optionName]['default'];
							} else {
								definitions[optionName]['value'] = settings[optionName] = patt.test(editor.getParam(optionName)) ? editor.getParam(optionName).replace(patt, ',') : editor.getParam(optionName);
							}
						}

					} else {
						definitions[optionName]['value'] = settings[optionName] = definitions[optionName]['default'];
					}
				}

				_SCAYT.setState(editor, settings.scayt_autoStartup);
			},
			init: function(editor) {
				var self = this,
					ed = editor,
					definitions = self._definitions;

				self._parseOptions(ed);
			}
		};
	};

	ScaytPlugin.prototype = {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param  {tinymce.Editor} editor  Editor instance that the plugin is initialized in.
		 * @param  {string} url	 Absolute URL to where the plugin is located.
		 */
		init: function(editor, url) {
			var self = this,
				_SCAYT = tinymce.plugins.SCAYT,
				ed = editor,
				settings = ed.settings;

			self.options.url = url;
			self.toolbarScaytTabs = null;

			self.parseConfig.init(ed);
			self.bindEvents(ed);
		},
		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param  {String} controlName  Name of the control to create.
		 * @param  {tinymce.ControlManager} controlManager  Control manager to use inorder to create new control.
		 * 
		 * @return {tinymce.ui.Control}  New control instance or null if no control was created.
		 */
		createControl: function(controlName, controlManager) {

			if(controlName !== 'scayt') {
				return;
			}

			var self = this,
				_SCAYT = tinymce.plugins.SCAYT,
				editor = controlManager.editor,
				contextMenu = editor.plugins.scaytcontextmenu || editor.plugins.contextmenu;
			
			self.disabledScaytButtonsMenu = function() {
				var self = this;
				
				for(var item in self.toolbarScaytTabs) {
					self.toolbarScaytTabs[item].setDisabled(1);
				}
			};
			
			self.enabledScaytButtonsMenu = function() {
				var self = this;
				
				for(var item in self.toolbarScaytTabs) {
					self.toolbarScaytTabs[item].setDisabled(0);
				}
			};
			
			var scaytControlHandler = function(data) {
				var scaytPluginState = _SCAYT.setState(editor, !_SCAYT.getState(editor));
				
				if(scaytPluginState) {
					_SCAYT.create(editor);
					editor.controlManager.controls[editor.controlManager.prefix + 'scayt'].setActive(1);
					self.enabledScaytButtonsMenu();
				} else {
					_SCAYT.destroy(editor);
					editor.controlManager.controls[editor.controlManager.prefix + 'scayt'].setActive(0);
					self.disabledScaytButtonsMenu();
				}
				
			};
			
			var scaytControl = controlManager.createSplitButton(controlName, {
				title: 'scayt.desc',
				cmd: 'mceScayt',
				sce: self,
				image: self.options.url + '/img/scayt.gif',
				onclick: scaytControlHandler
			});
			
			var openDialog = function(index, editor) {
				var scaytInstance = _SCAYT.getScayt(editor);
				var uiTitles = [
						'options',
						'langs',
						'dictionary',
						'about'
					];
	
				editor.focus();
				editor.settings.scaytDialogMode = uiTitles[index];
				
				editor.windowManager.open({
					file :  self.options.url + '/ui.html',
					width: '450',
					height: '300',
					inline : 1
				},
				{
					mode : uiTitles[index],
					s: scaytInstance
				});
			};
			
			// Definitions drop-down menu
			var dropDownMenu = [
				{
					title: editor.getLang('scayt.tb_menu_options', 'SCAYT Options'),
					onclick: function(data) {
					   openDialog(0, editor);
					}
				},
				{
					title: editor.getLang('scayt.tb_menu_languages', 'SCAYT Languages'),
					onclick: function() {
						openDialog(1, editor);
					}
				},
				{
					title: editor.getLang('scayt.tb_menu_dictionaries', 'SCAYT Dictionaries'),
					onclick: function() {
						openDialog(2, editor);
					}
				},
				{
					title: editor.getLang('scayt.tb_menu_about', 'About SCAYT'),
					onclick: function() {
						openDialog(3, editor);
					}
				}
			];
			
			var scaytContextMenu = {
				getSelectionWord: function(instanceScayt) {
					
					if(!instanceScayt) {
						return false;
					}
					
					var word,
						selectionNode = instanceScayt.getSelectionNode();
	
					if(selectionNode) {
						word = selectionNode.getAttribute(instanceScayt.getNodeAttribute());
					} else {
						word = selectionNode;
					}
	
					return word;
				}
			};
			
			var containsItemInArray = function(array, obj) {
				var i = array.length;

				while(i--) {
					if(array[i] === obj) {
						return true;
					}
				}
				
				return false;
			}
			
			scaytControl.onRenderMenu.add(function(btn, menu) {
				var _scayt_uiTabs = editor.getParam('scayt_uiTabs').split(',');
				// Add about tab. It should be displayed anyway
				_scayt_uiTabs.push('1');
				for(var i = 0, l = dropDownMenu.length; i < l; i++) {
					
					if(!parseInt(_scayt_uiTabs[i])) {
						continue;
					}
					
					menu.add(dropDownMenu[i]);
				}

				self.toolbarScaytTabs = menu.items;
				
				if(_SCAYT.getState(editor) === false) {
					self.disabledScaytButtonsMenu();
				}
				
			});
			
			if(contextMenu) {
				setTimeout(function() {
					contextMenu.onContextMenu.add(function(contextMenu, menu, element) {
						// There isn't ability to set order of calling callback. We add callback for running context menu after table callback because table removes all menu items.
						var scaytInstance = _SCAYT.getScayt(editor),
							word = scaytContextMenu.getSelectionWord(scaytInstance);

						// Check if isset scayt word on right click
						if(!word) {
							return;
						}
						
						// Generate suggestion for SCAYT word
						scaytInstance.fire('getSuggestionsList', {lang: scaytInstance.getLang(), word: word});

						// Define local vars for tinymce menu
						var moresuggest_group = [], // more suggestions list
							control_group = [], // options ... and other features will be added to menu
							suggest_group = [], // suggestion definition
							suggestions = _SCAYT.getSuggestions(), // suggestion list
							sub_menu = null, // subMenu object for more suggestions in menu
							createMenuCommand = function(scaytInstance, suggestion) {
								var cmd = 'scayt' + suggestion;

								editor.addCommand(cmd, function() {
									var replacement = suggestion;
									scaytInstance.replaceSelectionNode({word: replacement});
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
									title: editor.getLang('scayt.cm_add_word', 'Add word'),
									icon: '',
									cmd: 'scayt_add_word'
								},
								ignore: {
									title: editor.getLang('scayt.cm_ignore_word', 'Ignore word'),
									icon: '',
									cmd: 'scayt_ignore_word'
								},
								ignoreall: {
									title: editor.getLang('scayt.cm_ignore_all', 'Ignore all'),
									icon: '',
									cmd: 'scayt_ignore_all_words'
								}
							};

							// suggestion generation for tinymce menu
							if(suggestions.length > 0 && suggestions[0] !== 'no_any_suggestionse') {
								for(var i = 0, l = suggestions.length; i < l; i += 1) {
									suggestMenuItem = {
										title: suggestions[i],
										icon: '',
										cmd: createMenuCommand(scaytInstance, suggestions[i])
									}; 
									
									if(i < self.parseConfig.getValue('scayt_maxSuggestions')) {
										suggest_group.push(suggestMenuItem); // add main suggestions to menu
									} else if(self.parseConfig.getValue('scayt_moreSuggestions') === 'on') {
										moresuggest_group.push(suggestMenuItem); // add item to the more suggestions submenu group
									}
								}
							} else {
								suggestMenuItem = {
									title: editor.getLang('scayt.no_any_suggestions', 'No suggestions'),
									icon: '',
									cmd: '',
									disabled: true,
									active: 0
								}; 
								
								suggest_group.push(suggestMenuItem); // add main suggestions to menu
							}

							// Add single commands
							editor.addCommand('scayt_add_word', function() {
								scaytInstance.addWordToUserDictionary();
							});

							editor.addCommand('scayt_ignore_word', function() {
								scaytInstance.ignoreWord();
							});

							editor.addCommand('scayt_ignore_all_words', function() {
								scaytInstance.ignoreAllWords();
							});
							
							var _scayt_contextCommands = self.parseConfig.getValue('scayt_contextCommands').split(',');

							for(var controlItem in controlGroupDefinition) {
								if(containsItemInArray(_scayt_contextCommands, controlItem)) {
									 control_group.push(controlGroupDefinition[controlItem]);
								}
							}
						
							editor.addCommand('scayt_about', function() {
								openDialog(3, editor);
							});
						
							control_group.push({
								title: editor.getLang('scayt.cm_about', 'About SCAYT'),
								icon: 'scayt_about',
								cmd: 'scayt_about'
							});
							
							var menuRender = {
								moresuggest: function() {
									menu.addSeparator();
							
									if(!sub_menu && suggestions.length > self.parseConfig.getValue('scayt_maxSuggestions') && self.parseConfig.getValue('scayt_moreSuggestions') === 'on') {
										menu.addSeparator();
										
										sub_menu = menu.addMenu({
											title: editor.getLang('scayt.cm_more_suggestions', 'More Suggestions')
										});

										menu.addSeparator();

										for(var i = 0; i < moresuggest_group.length; i++) {
											sub_menu.add(moresuggest_group[i]);
										}
									}
								},
								control: function() {
									menu.addSeparator();

									for(var i=0; i<control_group.length; i++) {
										menu.add(control_group[i]);
									}
								},
								suggest: function() {
									if(suggestions.length === 0 || suggestions[0] === 'no_any_suggestionse') {
										menu.add(suggest_group[0]).setDisabled(1);
									} else {

										for(var i = 0; i < suggest_group.length; i++) {
											menu.add(suggest_group[i]);
										}
									}
								}
							};

							var patt = /\s?[\|]+\s?/gi,
								menuOrderDeclaration = self.parseConfig.getValue('scayt_contextMenuItemsOrder').split(',');
								

							// necessary for menu type ordering
							for(var menuItem = 0; menuItem < menuOrderDeclaration.length; menuItem++) {
								(typeof menuRender[menuOrderDeclaration[menuItem]] === 'function') && menuRender[menuOrderDeclaration[menuItem]]();
							}

							menu.addSeparator();

						scaytInstance.showBanner('#menu_' + contextMenu._menu.id + '_co');

					});
				}, 0);
			}
		
			return scaytControl;
		},
		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo: function() {
			return {
				longname : 'Spell Check As You Type (SCAYT)',
				author : 'WebSpellChecker.net',
				authorurl : 'http://www.webspellchecker.net/',
				infourl : 'http://www.webspellchecker.net/',
				/**
				 * @TODO
				 * Replace the value property 'version' in accordance with the version scayt3 or write number(name) git tag
				 * 
				 * @type {String}
				 */
				version : '3.0'	
			};
		},
		bindEvents: function(editor) {
			var self = this,
				_SCAYT = tinymce.plugins.SCAYT,
				scaytPlugin = editor.plugins.scayt,
				ed = editor,
				lastExecutedCommand;

			var contentDomReady = function(editor) {
				// The event are fired when editable iframe node was reinited so we should restart our service
				if(_SCAYT.getState(editor) === true) {
					_SCAYT.create(editor);
					editor.controlManager.controls[editor.controlManager.prefix + 'scayt'].setActive(1);
				}
			};
			
			/**
			 * Destroy SCAYT instance with current editor
			 * @param  {object} editor
			 * @return {boolean} true or false
			 */
			var scaytDestroy = function(editor) {
				var scaytInstance = _SCAYT.getScayt(editor);
	
				if(scaytInstance) {
					_SCAYT.destroy(editor);
				}
			};
			
			// Initialization the tinymce editor
			ed.onInit.add(function(ed) {
				contentDomReady(ed);
			});
			
			// Remove the tinymce editor
			ed.onRemove.add(function(ed) {
				scaytDestroy(ed);
			});
			tinymce.onRemoveEditor.add(function(tinymce, ed) {
				return scaytDestroy(ed);
			});

			if(ed.theme.onResolveName) {
				ed.theme.onResolveName.add(function(th, o) {
					if(o.node.nodeName == 'SPAN' && ed.dom.hasClass(o.node, self.options.misspelledWordClass)) {
						o.name = '';
					}
				});
			}
			
			ed.onBeforeExecCommand.add(function(editor, cmd, ui, val) {
				var self = this, scaytInstance;

				if((cmd in scaytPlugin.options.disablingCommandExec) && scaytPlugin.options.disablingCommandExec[cmd]) {

					scaytDestroy(editor);

					if(_SCAYT.getState(editor)) {
						_SCAYT.create(editor);
					}

				} else {
					scaytInstance = _SCAYT.getScayt(editor);

					if(scaytInstance) {
						if(cmd === 'mceInsertContent') {
							if(lastExecutedCommand && lastExecutedCommand === 'mceEmotion') {
								setTimeout(function() { 
									scaytInstance.removeMarkupInSelectionNode();
									scaytInstance.fire("startSpellCheck");
								}, 0);
							} else {
								scaytInstance.removeMarkupInSelectionNode();
								setTimeout(function() { 
									scaytInstance.fire("startSpellCheck");
								}, 0);
							}
						}

						if(cmd === 'mceRepaint' || cmd === 'Undo' || cmd === 'Redo') {
							scaytInstance.fire('startSpellCheck');
						}
					}
				}

				lastExecutedCommand = cmd;
			});

			// @TODO 'Remove formatting' handling
			// ed.onBeforeExecCommand.add(function(ed, cmd, ui, val, a) {
			// 	var scaytInstance;

			// 	if(cmd === 'RemoveFormat') {
			// 		if(a) {
			// 			scaytInstance = _SCAYT.getScayt(ed);
			// 			if(scaytInstance && scaytInstance.getSelectionNode()) {
			// 				a.terminate = true;
			// 				return false;
			// 			}
			// 		}
			// 	}
			// });
			
			ed.onExecCommand.add(function(editor, cmd, ui, val) {
				var scaytInstance = _SCAYT.getScayt(editor);

				if(cmd == 'mceFullScreen' && !_SCAYT.getState(editor)) {
					scaytDestroy(tinymce.activeEditor);
					tinymce.activeEditor.controlManager.controls[tinymce.activeEditor.controlManager.prefix + 'scayt'].setActive(0);
				}

				if(scaytInstance && cmd == 'mceFullScreen' && typeof editor.getParam('fullscreen_is_enabled') === 'undefined') {

					if(_SCAYT.getState(editor)) {
						_SCAYT.create(tinymce.activeEditor);
						tinymce.activeEditor.controlManager.controls[tinymce.activeEditor.controlManager.prefix + 'scayt'].setActive(1);
					}

					scaytPlugin.parseConfig.setValue('scayt_sLang', scaytInstance.getLang());

				} else if(editor.getParam('fullscreen_is_enabled') === true) {
					scaytDestroy(tinymce.activeEditor);
				}
			});

			ed.onPreInit.add(function(ed) {
				self.undoManager = ed.undoManager;

				self.undoManager.onBeforeAdd.add(function(undoman, level) {
					var scaytInstance = _SCAYT.getScayt(editor);

					if(scaytInstance && level && level.content) {
						level.content = scaytInstance.removeMarkupFromString(level.content);
					}
				});
			});

			ed.onPaste.add(function(ed, e) {
				var scaytInstance = _SCAYT.getScayt(ed);
				
				setTimeout(function() {
					if(scaytInstance) {
						scaytInstance.removeMarkupInSelectionNode();
						scaytInstance.fire('startSpellCheck');
					}
				},0);

			});

			ed.onSetContent.add(function(ed, o) {
				var scaytInstance = _SCAYT.getScayt(editor);

				if(scaytInstance) {
					setTimeout(function() {
						scaytInstance.removeMarkupInSelectionNode();
						scaytInstance.fire('startSpellCheck');
					}, 0);
				}
			});

			// getContent preprocessing
			ed.onPreProcess.add(function(ed, o) {
				var scaytInstance;

				// process only getContent event
				if(o.get) {
					scaytInstance = _SCAYT.getScayt(ed);
					if(scaytInstance && o.node) {
						o.node.innerHTML = scaytInstance.removeMarkupFromString(o.node.innerHTML);
					}
				}
				
				return o;
			});
			
			ed.addCommand('mceScayt', function(data) {
				var scaytInstance = _SCAYT.getScayt(ed);

				if(!scaytInstance) {
					_SCAYT.create(editor);
					ed.controlManager.controls[ed.controlManager.prefix + 'scayt'].setActive(1);
					self.enabledScaytButtonsMenu();
				} else {
					_SCAYT.destroy(editor);
					ed.controlManager.controls[ed.controlManager.prefix + 'scayt'].setActive(0);
					self.disabledScaytButtonsMenu();
				}
				
			});
			
		}
	};

	// Register plugin
	tinymce.PluginManager.add('scayt', ScaytPlugin);

	// Creating a new event when scayt is ready
	tinymce.onScaytReady = new tinymce.util.Dispatcher();

	// Handle 'onScaytReady' callback
	tinymce.onScaytReady.add(function() {
		// override editor dirty checking behaviour
		tinymce.EditorManager.Editor.prototype.isDirty = function() {	
			var scaytInstance = tinymce.plugins.SCAYT.getScayt(this),
				startContent, getContent;
			
			if(scaytInstance) {
				startContent = tinymce.trim(scaytInstance.removeMarkupFromString(this.startContent));
				getContent = tinymce.trim(scaytInstance.removeMarkupFromString(this.getContent({format : 'raw', no_events : 1})));
			} else {	
				startContent = tinymce.trim(this.startContent);
				getContent = tinymce.trim(this.getContent({format : 'raw', no_events : 1}));
			}

			return (getContent != startContent) && !this.isNotDirty;
		}
	});
})();