/************************************
 * gtcSettingsManager 				*
 ************************************
 * gtcSettingsManager.js			*
 * @author: gtc - gonzo				*
 * @version: 1.0 (2014-06-18)		*
 ************************************/

var settingsManager;

(function(){
	var settingsManagerClass = function(){
		var self = this;
		var _cRefresher = ko.observable(0);
		var _currentSettings = {};	// settings[tabID][groupID][settingID]
		var _old = {};

		var defaultGroupName = "Defaults";

		// const template data (replaced by func)
		var _templates = {
			'ko_ident_index': {
				'selector': '.option-list:first',
				'key': '<!-- ko if: $index() < 5 -->',
				'replacement': '<!-- ko if: $index() < 5 ||  $index() > 6 --><!-- ko if: list._groups --><!-- ko foreach: list._groups --><div class="subgroupContainer"><h2 data-bind="text: title, visible: status"></h2><div class="subgroupContainerItems"><!-- ko foreach: $data.items --><div class="form-group"><label for="settings_item" data-bind="text: $data.title"></label><!-- ko if:  $data.type() === \'select\' --><select class="selectpicker form-control" id="settings_item" name="dropdown" data-bind="options: $data.options, optionsValue: function (item) { return item.value }, optionsText: function (item) { return item.text }, selectPicker: $data.value"></select><!-- /ko --><!-- ko if:  $data.type() === \'slider\' --><input type="text" id="settings_item" class="slider" value="" data-slider-handle="square" data-slider-orientation="horizontal" data-slider-selection="none" data-slider-tooltip="hide" data-bind="slider:{ value: $data.value, options: $data.options }" ><!-- /ko --><!-- ko if:  $data.type() === \'text\' --><span class="textOuter"><input type="textInput" id="settings_item" class="textField" value="" data-bind="value: $data.value" ></span><!-- /ko --></div><!-- /ko --><div class="subgroupContainerClear"></div></div></div><!-- /ko --><!-- /ko -->'
			}
		};

		// get first real itemClass to 'clone' it
		var SettingItemModelClassClone = model.settingsLists()[0][0];

		// replaces the html-document codes
		var _replaceDocumentCode = function(){
			_.forEach(_templates,function(tplData){
				var htmlData = $(tplData.selector).html();
				$(tplData.selector).html(htmlData.replace(tplData.key,tplData.replacement));
			});
		};

		var _createObjectForItem = function(iKey,iData,tabName){
			var _classClone = Object.create(SettingItemModelClassClone);
			_classClone.constructor(tabName,iKey,iData);
			return _classClone;
		};

		var _isNewSetting = function(iId,iTab){
			if (_.isUndefined(api.settings.data[iTab])){
				return true;
			}

			if (_.isUndefined(api.settings.data[iTab][iId])){
				return true;
			}
			return false;
		};

		/*****************
		 * PUBLIC ACCESS *
		 *****************/

		self.getOld = function(){
			return _old;
		}
		self.addTab = function(tabName,skipRefresh){
			((!skipRefresh)?skipRefresh=false:null);
			if (tabName == ""){
				return false;
			}

			// clean data
			tabName = tabName.toLowerCase().replace(" ","_");
			if (typeof api.settings.definitions[tabName] == 'undefined'){
				api.settings.definitions[tabName] = {
					title: tabName.replace("_"," "),
					settings: {}
				};
			}

			if (!skipRefresh){
				self.refresh();
			}

			return tabName;
		};
		self.isTab = function(tabName){
			// clean data
			tabName = tabName.toLowerCase().replace(" ","_");

			return !(typeof api.settings.definitions[tabName] == 'undefined');
		};
		self.extendSettings = function(tabName,groupName,extendData){
			if (!extendData){
				extendData = groupName;
				groupName = null;
			}

			_.forEach(extendData,function(dValue,dKey){
				var cData = dValue;
				cData._groupName = groupName;
				self.addSetting.item(dKey,cData,tabName);
			});
		};
		self.addSetting = {
			'item': function(id,sData,tab){
				if (id == ""){
					return false;
				}

				// create tab
				var tabIdent = self.addTab(tab,true);
				if (!tabIdent){
					return false;
				}

				// check for 'isNew'
				if (_isNewSetting(id,tabIdent)){					
					// set 'dirty' for new unknown setting
					api.settings.isDirty(true);
				}

				// add setting in groupList
				api.settings.definitions[tabIdent].settings[id] = sData;
				// create new empty tab to 'observableMap'
				if (_.isUndefined(api.settings.observableMap[tabIdent])){
					api.settings.observableMap[tabIdent] = {};
				}
				// add new observable to 'observableMap'
				api.settings.observableMap[tabIdent][id] = ko.observable().extend({ setting: { 'group': tabIdent, 'key': id } });

				self.refresh();
				return true;
			},
			'dropDown': function(id,title,options,defaultIndex,tabName,groupName){
				((!defaultIndex)?defaultIndex=0:null);
				var settingData = {
					'title': title,
					'type': 'select',
					'default': defaultIndex,
					'options': [],
					'optionsText': [],
					'_groupName': groupName
				};

				// prepare options
				_.forEach(options,function(v,k){
					settingData.optionsText.push(v);
					settingData.options.push(k);
				});
				return this.item(id,settingData,tabName);
			},
			'slider': function(id,title,minValue,maxValue,defaultValue,tabName,groupName){
				var settingData = {
					'title': title,
					'type': 'slider',
					'default': defaultValue,
					'options': {
						min: minValue,
						max: maxValue,
						step: 1
					},
					'_groupName': groupName
				};
				return this.item(id,settingData,tabName);
			},
			'text': function(id,title,defaultValue,tabName,groupName){
				var settingData = {
					'title': title,
					'type': 'text',
					'default': defaultValue,
					'_groupName': groupName
				};
				return this.item(id,settingData,tabName);
			}
		};
		self.refresh = function(){
			// refresh data for computed func
			_cRefresher((_cRefresher()+1));
		};

		/**************************
		 * CLASS INIT STARTS HERE *
		 **************************/

		// replace html-document-data
		_replaceDocumentCode();

		_old["settingGroups"] = model.settingGroups;
		model.settingGroups = ko.computed(function(){
			// add refresher to computed func, to 'refesh' automated
			var x = _cRefresher();
			return _.keys(api.settings.definitions);
		});

		// switch to new observable obj: this let the template know, when creating / changing a group or item
		_old["settingsLists"] = model.settingsLists;
		model.settingsLists = ko.computed(function(){
			// add 'watcher' // refresher
			var y = model.settingGroups();

			var res = _.map(model.settingDefinitions(),function(cTabData,cTab){
				var groupList = {};
				var groupsAreVisible = false;
				// create tabData (items,groups)
				_.forEach(cTabData.settings,function(sData,sKey){
					if (typeof sData._groupName != 'undefined' && sData._groupName != null){
						var gKey = sData._groupName.toLowerCase().replace(" ","_");
						groupsAreVisible = true;
					}else{
						var gKey = defaultGroupName;
					}
					// create group
					if (typeof groupList[gKey] == 'undefined'){
						var gName = gKey.replace("_"," ");
						groupList[gKey] = {title: gName,items: []};
					}
					groupList[gKey].items.push(_createObjectForItem(sKey,sData,cTab));
				});

				// check for groups
				switch (_.size(groupList)){
					case 0:
						return [];
					break;
					default:
						// convert groupObjects to array
						var gData = [];
						_.forEach(groupList,function(cGroupData){
							cGroupData.status = groupsAreVisible;
							gData.push(cGroupData);
						});
						return {'_groups': gData};
					break;
				}
			});
			return res;
		});

		// append methods to model
		model.addSetting = self.addSetting;
		model.extendSettings = self.extendSettings;
		model.addTab = self.addTab;
	};
	settingsManager = new settingsManagerClass();
})();