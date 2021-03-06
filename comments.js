/**
 * @namespace "TinyMCE3 SCAYT plug-in"
 *
 * @property {String} scayt_contextCommands - The parameter customizes the display of SCAYT context menu commands ("Add Word", "Ignore"
 * and "Ignore All"). This must be a string with one of this words: 'off', 'all'; or combination of the following words: 'ignore,ignoreall,add' separated by a comma character (','):
 * 'off' &ndash; disables all options; 'all' &ndash; enables all options; 'ignore' &ndash; enables the "Ignore" option;
 * 'ignoreall' &ndash; enables the "Ignore All" option; 'add' &ndash; enables the "Add Word" option.
 * Default value : [scayt_contextCommands='add,ignore,ignoreall'].
 * Old option name : scayt_context_commands
 *
 * @property {String} scayt_sLang - The parameter sets the default spell checking language for SCAYT. Possible values are:
 * 'en_US', 'en_GB', 'pt_BR', 'da_DK',
 * 'nl_NL', 'en_CA', 'fi_FI', 'fr_FR',
 * 'fr_CA', 'de_DE', 'el_GR', 'it_IT',
 * 'nb_NO', 'pt_PT', 'es_ES', 'sv_SE'.
 * Default value : [scayt_sLang='en_US'].
 * Old option name : scayt_slang
 *
 * @property {Number} scayt_maxSuggestions - The parameter defines the number of SCAYT suggestions to show in the main context menu.
 * Possible values are:
 * '0' (zero) &ndash; No suggestions are shown in the main context menu. All
 * entries will be listed in the the "More Suggestions" sub-menu.
 * Positive number &ndash; The maximum number of suggestions to show in the context
 * menu. Other entries will be shown in the "More Suggestions" sub-menu.
 * Negative number &ndash; 5 suggestions are shown in the main context menu. All other
 * entries will be listed in the the "More Suggestions" sub-menu.
 * Default value : [scayt_maxSuggestions=5].
 * Old option name : scayt_max_suggestion
 *
 * @property {Number} scayt_minWordLength - The parameter defines minimum length of the words that will be collected from editor's text for spell checking.
 * Possible value is any positive number.
 * Default value : [scayt_minWordLength=4].
 *
 * @property {String} scayt_customDictionaryIds - The parameter links SCAYT to custom dictionaries. This is a string containing dictionary IDs
 * separated by commas (',').
 * Further details at [http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:customdictionaries:licensed](http://wiki.webspellchecker.net/doku.php?id=installationandconfiguration:customdictionaries:licensed).
 * Default value : [scayt_customDictionaryIds=''].
 * Old option name : scayt_custom_dic_ids
 *
 * @property {String} scayt_userDictionaryName - The parameter activates a User Dictionary in SCAYT.
 * Default value : [scayt_userDictionaryName=''].
 * Old option name : scayt_user_dic_name
 *
 * @property {String} scayt_uiTabs - The parameter customizes the SCAYT dialog and SCAYT toolbar menu to show particular tabs/items.
 * This setting must contain a '1' (enabled) or '0'
 * (disabled) value for each of the following entries, in this precise order,
 * separated by a comma (','): 'Options', 'Languages', and 'Dictionary'.
 * Default value : [scayt_uiTabs='1,1,1'].
 * Old option name : scayt_ui_tabs
 *
 * @property {String} scayt_serviceProtocol - The parameter allows to specify protocol for WSC service (ssrv.cgi) full path. Make sense only when you open your page from file system.
 * Otherwise SCAYT will try automatically define protocol based on script location
 * Default value : [scayt_serviceProtocol='http'].
 * Old option name : scayt_service_protocol
 *
 * @property {String} scayt_serviceHost - The parameter allows to specify host for WSC service (ssrv.cgi) full path. Make sense only when you open your page from file system.
 * Otherwise SCAYT will try automatically define host based on script location
 * Default value : [scayt_serviceHost='svc.webspellchecker.net'].
 * Old option name : scayt_service_host
 *
 * @property {String} scayt_servicePort - The parameter allows to specify default port for WSC service (ssrv.cgi) full path. If SCAYT willn't define port based on script location
 * then this value would be taken
 * Default value : [scayt_servicePort='80'].
 * Old option name : scayt_service_port
 *
 * @property {String} scayt_servicePath - The parameter allows to specify path for WSC service (ssrv.cgi) full path. Make sense only when you open your page from file system.
 * Otherwise SCAYT will try automatically define path based on script location
 * Default value : [scayt_servicePath='spellcheck31/script/ssrv.cgi'].
 * Old option name : scayt_service_path
 *
 * @property {String} scayt_moreSuggestions - The parameter enables/disables the "More Suggestions" sub-menu in the context menu.
 * Possible values are 'on' and 'off'.
 * Default value : [scayt_moreSuggestions='on'].
 * Old option name : scayt_context_moresuggestions
 *
 * @property {String} scayt_customerId - The parameter sets the customer ID for SCAYT. Required for migration from free,
 * ad-supported version to paid, ad-free version.
 * Default value : [scayt_customerId='1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2'].
 * Old option name : scayt_customer_id
 *
 * @property {String} scayt_srcUrl - The parameter sets the URL to SCAYT core. Required to switch to the licensed version of SCAYT application.
 * Further details available at [http://wiki.webspellchecker.net/doku.php?id=migration:hosredfreetolicensedck](http://wiki.webspellchecker.net/doku.php?id=migration:hosredfreetolicensedck)
 * Default value : [scayt_srcUrl = '//svc.webspellchecker.net/spellcheck31/lf/scayt3/tinymce/tinymcescayt.js'].
 * Old option name : scayt_custom_url
 *
 * @property {Boolean} scayt_autoStartup - The parameter turns on/off SCAYT on the autostartup. If 'true', turns on SCAYT automatically after loading the editor.
 * Default value : [scayt_autoStartup=false].
 * Old option name : scayt_auto_startup
 *
 * @property {String} scayt_contextMenuItemsOrder - The parameter defines the order SCAYT context menu items by groups.
 * This must be a string with one or more of the following
 * words separated by a comma character (','):
 * 'suggest' &ndash; main suggestion word list;
 * 'moresuggest' &ndash; more suggestions word list;
 * 'control' &ndash; SCAYT commands, such as "Ignore" and "Add Word".
 * Default value : [scayt_contextMenuItemsOrder='suggest,moresuggest,control'].
 * Old option name : scayt_context_menu_items_order
 *
 * @property {String} scayt_elementsToIgnore - Specifies the names of tags that will be skipped while spell checking. It is a string containing tag names separated by commas (',').
 * Please note that 'style' tag would be added to specified tags list.
 * Default value : [scayt_elementsToIgnore='style']
 *
 * @example
 * // Show only "Add Word" and "Ignore All" in the context menu.
 * config.scayt_contextCommands = 'add,ignoreall';
 * @example
 * // Sets SCAYT to German.
 * config.scayt_sLang = 'de_DE';
 * @example
 * // Display only three suggestions in the main context menu.
 * config.scayt_maxSuggestions = 3;
 *
 * // Do not show the suggestions directly.
 * config.scayt_maxSuggestions = 0;
 * @example
 * // Set minimum length of the words that will be collected from text.
 * config.scayt_minWordLength = 5;
 * @example
 * config.scayt_customDictionaryIds = '3021,3456,3478"';
 * @example
 * config.scayt_userDictionaryName = 'MyDictionary';
 * @example
 * // Hides the "Languages" tab.
 * config.scayt_uiTabs = '1,0,1';
 * @example
 * // define protocol for WSC service (ssrv.cgi) full path
 * config.scayt_serviceProtocol='https';
 * @example
 * // define host for WSC service (ssrv.cgi) full path
 * config.scayt_serviceHost='my-host';
 * @example
 * // define port for WSC service (ssrv.cgi) full path
 * config.scayt_servicePort='2330';
 * @example
 * // define path for WSC service (ssrv.cgi) full path
 * config.scayt_servicePath='myPath/ssrv.cgi'
 * @example
 * // Disables the "More Suggestions" sub-menu.
 * config.scayt_moreSuggestions = 'off';
 * @example
 * // Load SCAYT using my customer ID.
 * config.scayt_customerId = 'your-encrypted-customer-id';
 * @example
 * config.scayt_srcUrl = "http://my-host/spellcheck/lf/scayt/scayt.js";
 * @example
 * config.scayt_autoStartup = true;
 * @example
 * config.scayt_contextMenuItemsOrder = 'moresuggest,control,suggest';
 * @example
 * config.scayt_elementsToIgnore = 'del,pre';
 */