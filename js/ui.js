tinyMCEPopup.requireLangPack();

var lang = tinyMCEPopup.editor.getParam('language');

var SCAYTOptionsDialog = {

	init: function(editor) {
		var self = this,
			form = document.forms[0];

		var mode = tinyMCEPopup.editor.getParam('scaytDialogMode');

		self.renderTabsBar();

		self.switchMode(mode);

		mcTabs.onChange.add(function(tab_id, panel_id) {
			self.switchMode(tab_id.substring(0, tab_id.indexOf('_')));
		});

		initSCAYTOptionsDialog(editor);
	},

	renderTabsBar: function() {
		var uiTabs = tinyMCEPopup.editor.getParam('scayt_uiTabs');
		// Add about tab. It should be displayed anyway
		uiTabs.push('1');
		var tabsId = ['options_tab','langs_tab','dictionary_tab','about_tab'];

		for(var i = 0; i < uiTabs.length; i++) {

			if(!parseInt(uiTabs[i])) {
				var tab = document.getElementById(tabsId[i]);
				tab.style.display = 'none';
			}
		}
	},

	switchMode: function(mode) {
		var self = this;
		var form, lastMode = this.lastMode;

		if(lastMode !== mode) {

			form = document.forms[0];

			mcTabs.displayTab(mode + '_tab',  mode + '_panel');
			self.toggleDisplaySubmitButton(mode);
			this.lastMode = mode;
		}
	},

	applySettings: function() {
		Ok();
	},

	getEditor: function() {

	},

	toggleDisplaySubmitButton: function(mode) {
		if(mode == 'options'  || mode == 'langs' || mode == '0' || mode == '1') {
			get.byId('insert').style.display = 'block';
			get.byId('cancel').style.display = 'block';
			get.byId('close').style.display = 'none';
		} else {
			get.byId('insert').style.display = 'none';
			get.byId('cancel').style.display = 'none';
			get.byId('close').style.display = 'block';
		}
	}

}

tinyMCEPopup.onInit.add(SCAYTOptionsDialog.init, SCAYTOptionsDialog);

var scayt_control = tinymce.plugins.SCAYT.getScayt(tinyMCEPopup.editor);
var userDicActive = false;
var plugin = tinyMCEPopup.editor.plugins.scayt;
var uiTabs = plugin.uiTabs;
var optionLocalizationList = {
	'ignore-all-caps-words' 		: 'allCaps',
	'ignore-domain-names' 			: 'ignoreDomainNames',
	'ignore-words-with-mixed-cases' : 'mixedCase',
	'ignore-words-with-numbers' 	: 'mixedWithDigits'
};

function Ok() {
	// setup options if any was set
	var isOptionChanged = false;
	//console.info(options)
	var currentOption = getOptionStatus();
	//setup language if it was change
	var changedOptions = {};

	var csLang = chosed_lang.split('::')[1];

	for(var oN in options) {
		var key  = optionLocalizationList[oN];

		if(currentOption[key] != options[oN]) {
			options[oN] = currentOption[key];
			changedOptions[oN] = options[oN];
			isOptionChanged = true;
		}
	}

	if(csLang && sLang != csLang) {
		changedOptions['lang'] = csLang;
		isOptionChanged = true;
	}

	if(isOptionChanged) {
		scayt_control.commitOption({changedOptions: changedOptions});
	}

	return tinyMCEPopup.close();
}

/*            function Cancel() {
	return tinyMCEPopup.close();
};
*/
var buttons = [ 'dic_create','dic_delete','dic_rename','dic_restore' ],
	labels  = [ 'mixedCase','mixedWithDigits','allCaps','ignoreDomainNames' ],
	panelContainer = ['about_panel', 'langs_panel', 'dictionary_panel', 'options_panel', 'options_tab', 'langs_tab', 'dictionary_tab', 'about_tab'];

function applyCaptions() {
	// fill dictionary section
	for(var i in buttons) {
		var button = buttons[ i ];
	}
	// Bug #7411 Incorrect text display in UD tab in SCAYT Options dialog box
	get.byId('dic_info').style.marginTop = "27px";
	get.byId('dic_info').style.fontSize = "10px";

	// fill about tab

	for(var i=0; i < panelContainer.length; i++) {
		additionalTranslate(panelContainer[i]);
	}
}

function getOptionStatus() {
	var optionNodes = get.byClass('_scayt_option');
	var commitedOptions = {};
	for(var i = 0; i < optionNodes.length; i++) {
		commitedOptions[optionNodes[i].id] = optionNodes[i].checked;
	}

	return commitedOptions;
}

function additionalTranslate(id) {
	get.byId(id).innerHTML = get.byId(id).innerHTML.replace(/{\#([^}]+)\}/g, function(a, b) {
		return captions[aliasTranslatorFromTinymceToScaytCaption[b.replace('scayt.', '')]] || aliasTranslatorFromTinymceToScaytCaption[b.replace('scayt.', '')];
	});
}



var lang_list = {},
	sLang,
	fckLang,
	chosed_lang,
	options,
	//tabs = [1,1,1,1],
	captions,
	getCaptionRun = false;

var optionGenerator = function(options, editor) {

	var optionTemplate = '<li class="_scayt_options" style = "display: block;">' +
		   '<input class="_scayt_option" type="checkbox" %checked% value="0" id = "%type%" name="%type%" />' +
		   '<label for="%type%" id="label_allCaps">%local%</label>' +
			'</li>';

	var generatedData = '';

	 for(var item in options) {
		var itemHtml = optionTemplate.replace(/%type%/g, optionLocalizationList[item]).replace('%local%', editor.getLang('scayt.label_' + optionLocalizationList[item])).replace('%checked%', (options[item]) ? "checked = 'checked'" : '');
		generatedData += itemHtml;
	}
	return generatedData;
}


// onload runner
// window._onload = function() {
function initSCAYTOptionsDialog(editor) {
	//alert('initSCAYTOptionsDialog');
	tabs = uiTabs;
	tabs = [1,1,1,1];

	if(tabs.length > 0 && typeof tabs[2] != 'undefined' && tabs[2] == 1) {
		userDicActive = true;
	}


	sLang = scayt_control.getLang();
	fckLang = 'en';
	options = scayt_control.getApplicationConfig();

	// apply captions

	lang_list = scayt_control.getLangList() ;


	//Render Options
	var optionContainer = get.byId('scayt_options');

	optionContainer.innerHTML = optionGenerator(options, editor);

	// * Create languages tab
	// ** convert langs obj to array

	// Start render LangList
	var lang_arr = [];

	for(var k in lang_list.rtl) {
		// find curent lang
		if(k == sLang) {
			chosed_lang = lang_list.rtl[k] + '::' + k;
		}
		lang_arr[lang_arr.length] = lang_list.rtl[k] + '::' + k;

	}
	for(var k in lang_list.ltr) {
		// find curent lang
		if(k == sLang) {
			chosed_lang = lang_list.ltr[k] + '::' + k;
		}
		lang_arr[lang_arr.length] = lang_list.ltr[k] + '::' + k;
	}
	lang_arr.sort();

	// ** find lang containers

	var lcol = get.byId('lcolid');
	var rcol = get.byId('rcolid');
	// ** place langs in DOM

	get.forEach(lang_arr, function(l , i) {

		//console.info(l,i);

		var l_arr = l.split('::');
		var l_name = l_arr[0];
		var l_code = l_arr[1];
		var row = document.createElement('div');
		row.id = l_code;
		row.className = 'li';
		// split langs on half
		var col = (i < lang_arr.length/2) ? lcol:rcol ;

		// append row
		//console.dir(col)
		col.appendChild(row);
		var row_dom = get.byId(l_code);
		row_dom.innerHTML = l_name;

		var checkActiveLang = function(id) {
			return chosed_lang.split('::')[1] == id;
		};
		// bind click
		row_dom.bindOnclick(function(ev) {

			if(checkActiveLang(this.id)) return false;
			var elId = this.id;
			get.byId(this.id)
				.addClass('Button')
				.removeClass('DarkBackground');

			window.setTimeout(function() {
				get.byId(elId).setStyle({
					color: '#636363',
					cursor: 'no-drop'
				});
			}, 300);

			get.byId(chosed_lang.split('::')[1])
				.addClass('DarkBackground')
				.removeClass('Button')
				.setStyle({
					color: '#000000',
					cursor: 'pointer'
				});

			chosed_lang = this.innerHTML + '::' + this.id;
			return true;
		}).setStyle({cursor: 'pointer'});

		// select current lang
		if(l == chosed_lang) {
			row_dom.addClass('Button').setStyle({
				color: '#636363',
				cursor: 'no-drop'
			});
		} else {
			row_dom.addClass('DarkBackground').setStyle({color: '#000000'});
		}
	});
	// Finish render lang List


	// * user dictionary

	// ** customize buttons
	var dic_name ='mydictionary';
	var dic_buttons = [
		// [0] contains buttons for creating
		'dic_create,dic_restore',
		// [1] contains buton for manipulation
		'dic_rename,dic_delete'
	];


	if(scayt_control.getUserDictionaryName() != undefined && scayt_control.getUserDictionaryName() != 'null' && scayt_control.getUserDictionaryName() != '') {
		var dic_name = scayt_control.getUserDictionaryName();
		get.byId('dic_name').value = dic_name;
		display_dic_buttons(dic_buttons[1]);
	} else {
		display_dic_buttons(dic_buttons[0]);
	}

	// ** bind event listeners
	get.byClass('button').bindOnclick(function() {
		if(userDicActive && typeof window[this.id] == 'function') {
			// get dic name
			var dic_name = get.byId('dic_name').value ;
			// check common dictionary rules
			if(!dic_name) {
				dic_error_message(' Dictionary name should not be empty. ');
				return false;
			}
			//apply handler
			window[this.id].apply(window, [this, dic_name, dic_buttons]);
		}

		//console.info(typeof window[this.id], window[this.id].calle)
		return false;
	});

	get.byId('about_logo').src = scayt_control.getLogo();
};

window.dic_create = function(el, dic_name , dic_buttons) {
	// comma separated button's ids include repeats if exists
	var all_buttons = dic_buttons[0] + ',' + dic_buttons[1];

	var err_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_err_dic_create'] || captions['err_dic_create'];
	var suc_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_succ_dic_create'] || captions['succ_dic_create'];
	//console.info('--plugin ');
	dic_empty_message();

	scayt_control.createUserDictionary(dic_name, function(response) {

		if(!response.error) {
			hide_dic_buttons(all_buttons);
			display_dic_buttons(dic_buttons[1]);
			suc_massage = suc_massage.replace('%s' , dic_name);
			dic_success_message(suc_massage);
		} else {
			err_massage = err_massage.replace('%s' ,dic_name);
			dic_error_message(err_massage);
		}

	}, function(error) {
		err_massage = err_massage.replace('%s' ,dic_name);
		dic_error_message(err_massage);
	});
};


window.dic_rename = function(el, dic_name , dic_buttons) {
	// try to rename dictionary
	var err_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_err_dic_rename'] || captions['err_dic_rename'] || '';
	var suc_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_succ_dic_rename'] || captions['succ_dic_rename'] || '';

	dic_empty_message();

	scayt_control.renameUserDictionary(dic_name, function(response) {
		if(!response.error) {
			suc_massage = suc_massage.replace('%s' , dic_name);
			set_dic_name(dic_name);
			dic_success_message(suc_massage);
		} else {
			err_massage = err_massage.replace('%s' , dic_name);
			set_dic_name(dic_name);
			dic_error_message(err_massage);
		}

	}, function(error) {
		err_massage = err_massage.replace('%s' , dic_name);
		set_dic_name(dic_name);
		dic_error_message(err_massage);
	});
};

window.dic_delete = function(el, dic_name , dic_buttons) {
	var all_buttons = dic_buttons[0] + ',' + dic_buttons[1];

	var err_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_err_dic_delete'] || captions['err_dic_delete'] || '';;
	var suc_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_succ_dic_delete'] || captions['succ_dic_delete'] || '';;

	dic_empty_message();

	scayt_control.removeUserDictionary(dic_name, function(response) {
		if(!response.error) {
			suc_massage = suc_massage.replace('%s' , dic_name);
			hide_dic_buttons(all_buttons);
			display_dic_buttons(dic_buttons[0]);
			set_dic_name(''); // empty input field
			dic_success_message(suc_massage);
		} else {
			err_massage = err_massage.replace('%s' , dic_name);
			dic_error_message(err_massage);
		}

	}, function(error) {
		err_massage = err_massage.replace('%s' , dic_name);
		dic_error_message(err_massage);
	});
};

window.dic_restore = function(el, dic_name , dic_buttons) {
	// try to restore existing dictionary
	var all_buttons = dic_buttons[0] + ',' + dic_buttons[1];
	var err_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_err_dic_restore'] || captions['err_dic_restore'];
	var suc_massage = tinymce.EditorManager.i18n[lang + '.scayt.dic_succ_dic_restore'] || captions['succ_dic_restore'];

	dic_empty_message();

	scayt_control.restoreUserDictionary(dic_name, function(response) {
		if(!response.error) {
			suc_massage = suc_massage.replace('%s' , dic_name);
			hide_dic_buttons(all_buttons);
			display_dic_buttons(dic_buttons[1]);
			dic_success_message(suc_massage);
		} else {
			err_massage = err_massage.replace('%s' , dic_name);
			dic_error_message(err_massage);
		}
	}, function(error) {
		err_massage = err_massage.replace('%s' , dic_name);
		dic_error_message(err_massage);
	});
};

function dic_error_message(m) {
	if(m) {
		get.byId('dic_message').innerHTML = '<span class="error">' + m + '</span>';
	}

	return '';
}
function dic_success_message(m) {
	if(m) {
		get.byId('dic_message').innerHTML = '<span class="success">' + m + '</span>';
	}

	return '';
}
function dic_empty_message() {
	return get.byId('dic_message').innerHTML = ' ' ;
}
function display_dic_buttons(sIds) {
	sIds = new String(sIds);

	get.forEach(sIds.split(','), function(id, i) {
		get.byId(id).setStyle({display: 'inline'});
	});
}
function hide_dic_buttons(sIds) {
	sIds = new String(sIds);
	get.forEach(sIds.split(','), function(id,i) {
		get.byId(id).setStyle({display: 'none'});
	});
}
function set_dic_name(dic_name) {
	get.byId('dic_name').value = dic_name;
}
function display_dic_tab() {
	get.byId('dic_tab').setStyle({display: 'block'});
}