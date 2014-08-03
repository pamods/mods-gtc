/************************************
 * gtcSettingsManager 				*
 ************************************
 * gtcSettingsManager.js			*
 * @author: gtc - gonzo4711			*
 * @version: 2.0 (2014-08-02)		*
 ************************************/

var settingsManager;

(function(cModel){
	var gtcSettingsConst = {
		defaultIdent: "_d_",
		defaultType: "def",
		tab: "Default",
		group: "Default",
	};

	// title, name to ID func
	var _toId = function(tString){
		// clean data
		return tString.toLowerCase().replace(" ","_");
	};

	/***********************
	 * gtcSettingsTabClass *
	 ***********************/
	var gtcSettingsTabClass = function(tabTitle,tabOpts){
		((!tabOpts)?tabOpts={}:null);
		var self = this;

		self._refresher = ko.observable(0);
		self.hold = ko.observable(false);

		var _init = function(){
			self.id = _toId(tabTitle);
			self.title = ko.observable(tabTitle);
			self.visible = ko.observable(true);
			self.status = ko.observable(true);
			self.type = ko.observable(self.opts.type);
			self.elements = {
				tabs: {},
				groups: {}
			};

			// assign opts
			$.extend(true,self.opts, tabOpts);

			if (!self.opts.visible){
				self.visible(false);
			}

			if (!_.isUndefined(self.opts.status)){
				self.status(self.opts.status);
			}

			if (!_.isUndefined(self.opts.id)){
				self.id = _toId(self.opts.id);
			}
		};

		var _refreshFunc = function(){
			if (self.hold()){
				return false;
			}
			// refresh data for computed func
			self._refresher(self._refresher()+1);
		};

		var _refreshElements = ko.observableArray([]);
		var _autoRefresher = ko.computed(function(){
			_(_refreshElements()).forEach(function(r){
				r();
			});
			_refreshFunc();
		});

		// set default options
		self.opts = {
			visible: true,
			type: "default",
			lvl: 0,
			parentId: null,
			onClick: function(){}
		};

		self.setOption = function(optionKey,optionData){
			self.opts[optionKey] = optionData;
		};

		self._execFunc = function(funcName){
			if (!_.isUndefined(self.opts[funcName])){
				self.opts[funcName]();
			}
		};

		self.sub = {
			default: function(){
				var defTab = self.sub.get(_toId(gtcSettingsConst.defaultIdent));
				if (_.isNull(defTab)){
					return self.sub.add(gtcSettingsConst.tab,{id: gtcSettingsConst.defaultIdent,type: gtcSettingsConst.defaultType});
				}
				return defTab;
			},
			add: function(subTabTitle,subTabOpts){
				((!subTabOpts)?subTabOpts={}:null);
				subTabOpts.lvl = self.opts.lvl+1;
				subTabOpts.parentId = self.id;

				if (self.opts.lvl >= 1){
					console.error("You cannot add 'sub'-tabs to subTabs");
					return false;
				}

				var pTabId = _toId(subTabTitle);
				// check for existing tab
				if (!_.isUndefined(self.elements.tabs[pTabId])){
					return self.elements.tabs[pTabId];
				}

				var tmp = new gtcSettingsTabClass(subTabTitle,subTabOpts);
				self.elements.tabs[tmp.id] = tmp;
				_refreshElements.push(tmp._refresher);
				return tmp;
			},
			get: function(tabId){
				if (!_.isUndefined(self.elements.tabs[tabId])){
					return self.elements.tabs[tabId];
				}
				return null;
			},
			is: function(tabId){
				if (!_.isUndefined(self.elements.tabs[tabId])){
					return true;
				}
				return false;
			},
			getAll: function(){
				if (_.isUndefined(self.elements) || _.isUndefined(self.elements.tabs)){
					return {};
				}
				return self.elements.tabs;
			},
			remove: function(tabId){
				if (!_.isUndefined(self.elements.tabs[tabId])){
					delete self.elements.tabs[tabId];
					_refreshFunc();
					return true;
				}
				return false;
			}
		};

		self.group = {
			default: function(){
				var defGroup = self.group.get(_toId(gtcSettingsConst.defaultIdent));
				if (_.isNull(defGroup)){
					return self.group.add(gtcSettingsConst.group,{id: gtcSettingsConst.defaultIdent,type: gtcSettingsConst.defaultType});
				}
				return defGroup;
			},
			add: function(groupTitle,groupOpts){
				if (self.opts.lvl == 0){					
					return self.sub.default().group.add(groupTitle,groupOpts);
				}

				((!groupOpts)?groupOpts={}:null);
				groupOpts.parentId = self.opts.parentId;

				var pGroupId = _toId(groupTitle);
				// check for existing tab
				if (!_.isUndefined(self.elements.groups[pGroupId])){
					return self.elements.groups[pGroupId];
				}

				var tmp = new gtcSettingsGroupClass(groupTitle,groupOpts);
				self.elements.groups[tmp.id] = tmp;
				_refreshElements.push(tmp._refresher);
				return tmp;
			},
			get: function(groupId){
				if (self.opts.lvl == 0){					
					return self.sub.default().group.get(groupId);
				}

				if (!_.isUndefined(self.elements.groups[groupId])){
					return self.elements.groups[groupId];
				}
				return null;
			},
			is: function(groupId){
				if (!_.isUndefined(self.elements.groups[groupId])){
					return true;
				}
				return false;
			},
			getAll: function(){
				if (_.isUndefined(self.elements) || _.isUndefined(self.elements.groups)){
					return {};
				}
				return self.elements.groups;
			},
			remove: function(groupId){
				if (!_.isUndefined(self.elements.groups[groupId])){
					delete self.elements.groups[groupId];
					_refreshFunc();
					return true;
				}
				return false;
			}
		};

		// ref to default tab or default group
		self.item = {
			add: function(id,itemType,itemOpts){
				((!itemOpts)?itemOpts={}:null);

				// ref to default tab
				if (self.opts.lvl == 0){
					return self.sub.default().item.add(id,itemType,itemOpts);
				}else{
					return self.group.default().item.add(id,itemType,itemOpts);
				}
			},
			get: function(id){
				// ref to default tab
				if (self.opts.lvl == 0){
					return self.sub.default().item.get(id);
				}else{
					return self.group.default().item.get(id);
				}
			},
			getAll: function(){
				// ref to default tab
				if (self.opts.lvl == 0){
					return self.sub.default().item.getAll();
				}else{
					return self.group.default().item.getAll();
				}
			},
			remove: function(id){
				// ref to default tab
				if (self.opts.lvl == 0){
					return self.sub.default().item.remove(id);
				}else{
					return self.group.default().item.remove(id);
				}
			}
		};

		self.hasVisibleSubs = ko.computed(function(){
			var x = self._refresher();
			var visSubs = false;
			_.forEach(self.sub.getAll(),function(cSubObj,cSubId){
				if (cSubObj.visible()){
					visSubs = true;
				}
			});
			return visSubs;
		});

		self.hasActiveSubs = ko.computed(function(){
			var x = self._refresher();
			var actSubs = false;
			_.forEach(self.sub.getAll(),function(cSubObj,cSubId){
				if (cSubObj.visible() && cSubObj.status()){
					actSubs = true;
				}
			});
			return actSubs;
		});

		// additional rec function
		self.itemsRec = function(){
			var itemList = {};
			if (self.opts.lvl == 0){
				_.forEach(self.sub.getAll(),function(cSub){
					_.forEach(cSub.itemsRec(),function(cItem,cItemKey){
						itemList[cItemKey] = cItem;
					});
				});
			}else{
				_.forEach(self.group.getAll(),function(cGroup){
					_.forEach(cGroup.item.getAll(),function(cItem,cItemKey){
						itemList[cItemKey] = cItem;
					});
				});
			}
			return itemList;
		};

		_init();
	};

	/*************************
	 * gtcSettingsGroupClass *
	 *************************/
	var gtcSettingsGroupClass = function(groupTitle,groupOpts){
		((!groupOpts)?groupOpts={}:null);
		var self = this;

		self._refresher = ko.observable(0);

		var _init = function(){
			self.id = _toId(groupTitle);
			self.title = ko.observable(groupTitle);
			self.visible = ko.observable(true);
			self.status = ko.observable(true);
			self.type = ko.observable(self.opts.type);
			self.elements = {
				items: {}
			};

			// assign opts
			$.extend(true,self.opts, groupOpts);

			if (!self.opts.visible){
				self.visible(false);
			}

			if (!_.isUndefined(self.opts.id)){
				self.id = _toId(self.opts.id);
			}

			if (!_.isUndefined(self.opts.status)){
				self.status(self.opts.status);
			}
		};

		var _refreshFunc = function(){
			// refresh data for computed func
			self._refresher(self._refresher()+1);
		};

		// set default options
		self.opts = {
			visible: true,
			type: "default",
			parentId: null
		};

		self.setOption = function(optionKey,optionData){
			self.opts[optionKey] = optionData;
		};

		self.item = {
			add: function(id,itemType,itemOpts){
				((!itemOpts)?itemOpts={}:null);
				itemOpts.parentId = self.opts.parentId;
				var tmp = new gtcSettingsItemClass(id,itemType,itemOpts);
				self.elements.items[tmp.id] = tmp;
				_refreshFunc();
				return tmp;
			},
			get: function(id){
				if (!_.isUndefined(self.elements.items[id])){
					return self.elements.items[id];
				}
				return null;
			},
			getAll: function(){
				if (_.isUndefined(self.elements) || _.isUndefined(self.elements.items)){
					return {};
				}
				return self.elements.items;
			},
			remove: function(id){
				if (!_.isUndefined(self.elements.items[id])){
					delete self.elements.items[id];
					_refreshFunc();
					return true;
				}
				return false;
			}
		};

		_init();
	};

	/************************
	 * gtcSettingsItemClass *
	 ************************/
	var gtcSettingsItemClass = function(itemId,itemType,itemOpts){
		((!itemOpts)?itemOpts={}:null);
		((!itemType)?itemType="text":null);
		var self = this;

		var _toItemTitle = function(iid){
			var nameToken = iid.split("_");
			var nameReturns = [];
			_(nameToken).forEach(function(cValue){
				nameReturns.push(cValue.charAt(0).toUpperCase()+cValue.substr(1));
			});
			return nameReturns.join(" ");
		};

		var _init = function(){
			var tmpId = _toId(itemId);

			self.id = tmpId;
			self.title = ko.observable(_toItemTitle(tmpId));
			self.type = ko.observable(itemType.toLowerCase());
			self.visible = ko.observable(true);
			self.columns = ko.observable(0);
			self.rows = ko.observable(0);
			self.status = ko.observable(true);

			self.showLabel = true;

			// assign opts
			$.extend(true,self.opts, itemOpts);
			if (!_.isUndefined(self.opts.visible)){
				self.visible(self.opts.visible);
				delete self.opts.visible;
			}
			if (!_.isUndefined(self.opts.title)){
				self.title(self.opts.title);
				delete self.opts.title;
			}

			if (!_.isUndefined(self.opts.columns)){
				self.columns(self.opts.columns);
			}

			if (!_.isUndefined(self.opts.rows)){
				self.rows(self.opts.rows);
			}

			if (!_.isUndefined(self.opts.status)){
				self.status(self.opts.status);
			}

			switch (self.type().toLowerCase()){
				case "select":
					if (_.isUndefined(self.opts.options)){
						self.opts.options = {};
					}

					if (_.isUndefined(self.opts.default)){
						self.opts.default = 0;
					}

					// unpack 'defOptions'
					if (!_.isUndefined(self.opts.defOptions)){
						_(self.opts.defOptions.options).forEach(function(oValue,oPos){
							var dText = oValue;
							if (!_.isUndefined(self.opts.defOptions.optionsText[oPos])){
								dText = self.opts.defOptions.optionsText[oPos];
							}
							self.opts.options[oValue] = dText;
						});
						delete self.opts.defOptions;
					}

					// create options
					self.opts.optArray = [];
					_(self.opts.options).forEach(function(oValue,oPos){
						self.opts.optArray.push({value: oValue, text: oValue});
					});
				break;
				case "slider":
					if (_.isUndefined(self.opts.max)){
						self.opts.max = 100;
					}

					if (_.isUndefined(self.opts.min)){
						self.opts.min = 0;
					}

					if (_.isUndefined(self.opts.step)){
						self.opts.step = 1;
					}

					// unpack 'defOptions'
					if (!_.isUndefined(self.opts.defOptions)){
						_.forEach(self.opts.defOptions.options,function(oValue,oKey){
							self.opts[oKey] = oValue;
						});
						delete self.opts.defOptions;
					}
				break;
				case "textfield":
					// nothing to pass
				break;
				case "text":
					if (_.isUndefined(self.opts.text)){
						self.opts.text = "";
					}
					// clear label
					self.showLabel = false;

					// do not assign this to API
					self.opts.assignItem = false;

					self.text = ko.observable(self.opts.text);
				break;
				case "button":
					// clear label
					self.showLabel = false;

					// do not assign this to API
					self.opts.assignItem = false;
				break;
				default:
					console.error("Unknown itemType: '"+self.type()+"'. Item is invalid!");
					self.id = 'error';
					self.visible(false);
					self.opts.assignItem = false;
				break;
			}
		};

		// set default options
		self.opts = {
			assigned: false,
			assignItem: true,
			visible: true,
			parentId: null,
			default: null,
			onClick: function(){}
		};

		self._execFunc = function(funcName){
			if (!_.isUndefined(self.opts[funcName])){
				self.opts[funcName]();
			}
		};

		self.setOption = function(optionKey,optionData){
			self.opts[optionKey] = optionData;
		};


		// this function will assign the item to the settings-API and provide the 'default'-value
		self.assign = function(assignObj){
			if (self.opts.assigned){
				return true;
			}

			// check for assignable object
			if (!self.opts.assignItem){
				self.opts.assigned = true;
				return true;
			}

			// assign to settings-API, to check for 'isDirty' and get 'default'
			if (_.isUndefined(api.settings.definitions[self.opts.parentId])){
				api.settings.definitions[self.opts.parentId] = {settings: {}, title: 'dummy'};
			}
			if (_.isUndefined(api.settings.definitions[self.opts.parentId].settings[self.id])){
				api.settings.definitions[self.opts.parentId].settings[self.id] = {default: self.opts.default};
			}

			// assign value to 'settings-API'
			self.value = ko.observable().extend({ setting: { 'group': self.opts.parentId, 'key': self.id } });
			if (!_.isUndefined(self.opts.callback)){
                self.value.subscribe(self.opts.callback);
			}

			// assign to this obj (create a new tabGroup)
			if (_.isUndefined(assignObj[self.opts.parentId])){
				assignObj[self.opts.parentId] = {};
			}

			// assign to this obj
			assignObj[self.opts.parentId][self.id] = self.value;
			self.opts.assigned = true;
			return true;
		}

		_init();
	};

	/***************************
	 * gtcSettingsManagerClass *
	 ***************************/
	var gtcSettingsManagerClass = function(){
		var self = this;

		// old functions storage
		var _old = {};

		// exclude these tabs from 'settingsManager'
		var _excludeTabs = ['twitch','server','keyboard'];

		// templates to overwrite DOM
		var _tpl = {
			'tabs': {
				type: 'content',
				selector: '.tabs ul.nav-pills:first',
				data: '<!-- ko eachProp: {data: settingElements, as: \'cElement\', asKey: \'elKey\'} --><li data-bind="css: { \'active\': elKey == $root.activeSettingElement() }, visible: cElement.visible"><a data-toggle="pill" href="#ui" data-bind="click_sound: \'default\', rollover_sound: \'default\', text: cElement.title, click: function () { model.activeSettingElement(elKey) }"></a></li><!-- /ko --><!-- ko foreach: settingGroups --><li data-bind="css: { \'active\': $index() === $root.activeSettingsGroupIndex() }, visible: (!_.isUndefined($data)) "><a data-toggle="pill" href="#ui" data-bind="click_sound: \'default\', rollover_sound: \'default\', text: $data, click: function () { model.activeSettingsGroupIndex($index()) }"></a></li><!-- /ko -->'
			},
			'subtabs': {
				type: 'after',
				selector: '.tab_cont:first',
				data: '<div class="tab_cont subContent" data-bind="fadeVisible: settingsManager.tab.activeSubs($root.activeSettingElement()), slideMode: \'flex\'"><div class="tabs"><!-- ko eachProp: {data: settingElements, as: \'cElement\', asKey: \'elKey\'} --><ul class="nav-pills" data-bind="visible: cElement.hasActiveSubs && elKey === $root.activeSettingElement()"><!-- ko eachProp: {data: cElement.sub.getAll(), as: \'cSub\', asKey: \'cSubKey\'} --><li data-bind="css: { \'active\': cSubKey == $root.activeSettingSubElement($parent.elKey)() }, visible: cSub.status"><a data-toggle="pill" href="#ui" data-bind="click_sound: \'default\', rollover_sound: \'default\', text: cSub.title(), click: function () { model.activeSettingSubElement($parent.elKey)(cSubKey) }"></a></li><!-- /ko --></ul><!-- /ko --></div></div>'
			},
			'settingOut': {
				type: 'prepend',
				selector: '.container_centered.container_settings:first',
				data: '<!-- ko eachProp: {data: settingElements, as: \'cElement\', asKey: \'elKey\'} --><div class="option-container" data-bind="visible: cElement.visible() && elKey == $root.activeSettingElement()"><!-- ko eachProp: {data: cElement.sub.getAll(), as: \'cSub\', asKey: \'cSubKey\'} --><div class="option-subtab-container" data-bind="visible: cSub.visible() && cSubKey == $root.activeSettingSubElement($parent.elKey)()"><!-- ko eachProp: {data: cSub.group.getAll(), as: \'cGroup\', asKey: \'cGroupKey\'} --><div class="subgroupContainer" data-bind="visible: cGroup.visible"><h2 data-bind="text: cGroup.title, visible: cGroup.status()"></h2><div class="subgroupContainerItems"><!-- ko eachProp: {data: cGroup.item.getAll(), as: \'cItem\'} --><div class="form-group" data-bind="attr:{class: \'form-group columns\'+cItem.columns()+\' rows\'+cItem.rows()}, visible: cItem.visible"><label for="settings_item" data-bind="text: cItem.title, visible: cItem.showLabel,attr: {for: \'setting_\'+cItem.id}"></label><!-- ko if:  cItem.type() == \'select\' --><select class="selectpicker form-control" id="settings_item" name="dropdown" data-bind="attr:{id: \'setting_\'+cItem.id},options: cItem.opts.optArray, optionsValue: function (item) { return item.value }, optionsText: function (item) { return item.text }, selectPicker: cItem.value"></select><!-- /ko --><!-- ko if:  cItem.type() === \'slider\' --><input type="text" id="Text1" class="slider" value=""data-slider-handle="square" data-slider-orientation="horizontal" data-slider-selection="none" data-slider-tooltip="hide"data-bind="slider: { value: cItem.value, options: function(){return cItem.opts;} }" /><!-- /ko --><!-- ko if:  cItem.type() === \'textfield\' --><span class="textOuter"><input type="textInput" id="settings_item" class="textField" value="" data-bind="value: cItem.value,event: {click: cItem.opts.onClick}" ></span><!-- /ko --><!-- ko if:  cItem.type() === \'text\' --><span class="textContainer" data-bind="text: cItem.text"></span><!-- /ko --><!-- ko if:  cItem.type() === \'button\' --><div class="btn_std" data-bind="click: cItem.opts.onClick, click_sound: \'default\', rollover_sound: \'default\', css: { disabled: (!cItem.status()) }"><div class="btn_label"><span data-bind="text: cItem.title">button</span></div></div><!-- /ko --></div><!-- /ko --></div><div class="subgroupContainerClear"></div></div><!-- /ko --></div><!-- /ko --></div><!-- /ko -->'
			}
		};

		// hold a refresh
		self.hold = ko.observable(false);

		// THE OBSERVABLE-MAP (PA-SETTINGS)
		var _settingsObservableMap = {};

		// the stored elements (tabs)
		self.elements = {};

		// refreshWatcher, to refresh computed functions
		self._refreshWatcher = ko.observable(0);

		var _assignedTabs = [];
		var _refreshFunc = function(refreshTabId){
			((!refreshTabId)?refreshTabId=false:null);

			if ((!self.hold()) && (refreshTabId === false || _.contains(_assignedTabs,refreshTabId))){
				// refresh data for computed func
				self._refreshWatcher(self._refreshWatcher()+1);
				return true;
			}
			return false;
		};

		// auto refresher, foreach tab changed
		var _refreshElements = ko.observableArray([]);
		var _autoRefresher = ko.computed(function(){
			_(_refreshElements()).forEach(function(r){
				r();
			});
			_refreshFunc();
		});

		var _init = function(){
			// replace tplData
			_replaceTemplates();

			// assign 'default' PA-settings to collection
			_assignCurrentSettings();
		};

		// replace template data
		var _replaceTemplates = function(){
			_.forEach(_tpl,function(tplData){
				switch (tplData.type){
					case "content":
						$(tplData.selector).html(tplData.data);
					break;
					case "after":
						$(tplData.selector).after(tplData.data);
					break;
					case "append":
						$(tplData.selector).append(tplData.data);
					break;
					case "prepend":
						$(tplData.selector).prepend(tplData.data);
					break;
					case "replace":
						$(tplData.selector).html(htmlData.replace(tplData.key,tplData.data));
					break;
				}
			});
		};

		// prepare elements for VIEW
		var _prepareElements = function(){
			var tabReturnData = {};
			_.forEach(self.tab.getAll(),function(tabObj,tabId){
				// check sub tabs
				if (!_.isUndefined(tabObj.elements.tabs[gtcSettingsConst.defaultIdent])){
					if (_.size(tabObj.elements.tabs) == 1){
						tabObj.elements.tabs[gtcSettingsConst.defaultIdent].status(false);
					}else{
						tabObj.elements.tabs[gtcSettingsConst.defaultIdent].status(true);
					}
				}

				// check groups in tabs
				_.forEach(tabObj.sub.getAll(),function(subObj,subId){
					if (!_.isUndefined(subObj.elements.groups[gtcSettingsConst.defaultIdent])){
						if (_.size(subObj.elements.groups) == 1){
							subObj.elements.groups[gtcSettingsConst.defaultIdent].status(false);
						}else{
							subObj.elements.groups[gtcSettingsConst.defaultIdent].status(true);
						}
					}
				});


				// assign items
				_.forEach(tabObj.itemsRec(),function(cItem,cItemKey){
					// this only works a first time - already assigned items will not re-assign 
					cItem.assign(_settingsObservableMap);
				});

				// refresh subTabs, set default 'tab'
				var isFirst = true;
				_.forEach(tabObj.sub.getAll(),function(cObj,cObjId){
					if (isFirst){
						_setupSubElement(tabId,cObjId);
						isFirst = false;
					}
				});
			});
		};

		// assign all current settings (defaults by PA)
		var _assignCurrentSettings = function(){
			var startUpElement = true;

			// hold updates
			self.hold(true);
			_(_old["settingGroups"]()).forEach(function(cTab){
				if (_.contains(_excludeTabs,cTab)){
					return;
				}

				// get all definitions
				if (_.isUndefined(cModel.settingDefinitions()[cTab])){
					return;
				}

				var cDefinition = cModel.settingDefinitions()[cTab];

				// create new tab
				var cTabObj = self.tab.add(cDefinition.title);

				// create a settings element foreach settingDefinition
				_.forEach(cDefinition.settings,function(dData,dKey){
					// prevent errors
					if (_.isUndefined(dData.optionsText)){
						dData.optionsText = [];
					}

					var optObj = {
						title: dData.title,
						default: dData.default,
						defOptions: {options: dData.options,optionsText: dData.optionsText}
					};

					// add callbackFunc
					if (!_.isUndefined(dData.callback)){
						optObj.callback = dData.callback;
					}
					
					// add item to tab
					cTabObj.item.add(dKey,dData.type,optObj);
				});

				// assign tab to _autoreload
				self.tab.assign(cTabObj.id);

				// set the first active tab element
				if (startUpElement){
					cModel.activeSettingElement(cTabObj.id);
					startUpElement = false;
				}
				// refresh subTabs, set default 'tab'
				//cModel.activeSettingSubElement(cTabObj.id)(gtcSettingsConst.defaultIdent);
			});

			// release hold - update once
			self.hold(false);
		};

		// the tab class handlers
		self.tab = {
			add: function(tabTitle,tabOpts){
				var tmp = new gtcSettingsTabClass(tabTitle,tabOpts);
				// check for existing tab
				if (!_.isUndefined(self.elements[tmp.id])){
					delete tmp;
					return self.elements[tmp.id];
				}
				self.elements[tmp.id] = tmp;
				_refreshFunc(tmp.id);
				return self.elements[tmp.id];
			},
			get: function(tabId){
				if (!_.isUndefined(self.elements[tabId])){
					return self.elements[tabId];
				}
				return null;
			},
			getAll: function(assignedOnly){
				((!assignedOnly)?assignedOnly=false:null);
				if (_.isUndefined(self.elements)){
					return {};
				}
				if (!assignedOnly){
					return self.elements;
				}
				var asList = {};
				_.forEach(self.elements,function(cElemObj,cElemId){
					if (_.contains(_assignedTabs,cElemId)){
						asList[cElemId] = cElemObj;
					}
				});
				return asList;
			},
			visibleSubs: function(tabId){
				var cTab = self.tab.get(tabId);
				if (_.isNull(cTab)){
					return false;
				}
				return cTab.hasVisibleSubs;
			},
			activeSubs: function(tabId){
				var cTab = self.tab.get(tabId);
				if (_.isNull(cTab)){
					return false;
				}
				return cTab.hasActiveSubs;
			},
			remove: function(tabId){
				if (!_.isUndefined(self.elements[tabId])){
					delete self.elements[tabId];
					_refreshFunc(tabId);
					return true;
				}
				return false;
			},
			assign: function(tabId){
				var cTab = self.tab.get(tabId);
				if (!cTab){
					return;
				}
				if (!_.contains(_assignedTabs,tabId)){
					_assignedTabs.push(tabId);
					_refreshElements.push(cTab._refresher);
				}
			}
		};

		// assign refresh function to elements
		self._refresher = ko.computed(function(){
			self._refreshWatcher();
			_prepareElements();
		});

		/*********************
		 * MODEL ASSIGNMENTS *
		 *********************/

		// overwrite the old settingsGroups function, to prevent showing double-tabs
		_old["settingGroups"] = cModel.settingGroups;
		cModel.settingGroups = ko.computed(function(){
			var retGroups = [];
			_(_old["settingGroups"]()).forEach(function(cGroup,cIndex){
				if (_.contains(_excludeTabs,cGroup)){
					retGroups[cIndex] = cGroup;
				}
			});
			return retGroups;
		});

		// this is the obs. for the new active tab
		cModel.activeSettingElement = ko.observable().extend({ session: 'active_setting_element' });

		var _activeSettingSubElements = {};
		cModel.activeSettingSubElement = function(parentId){
			if (_.isUndefined(_activeSettingSubElements[parentId])){
				_activeSettingSubElements[parentId] = ko.observable(gtcSettingsConst.defaultIdent);
			}

			return _activeSettingSubElements[parentId];
		};

		var _setupSubElement = function(parentId,cValue){
			if (_.isUndefined(_activeSettingSubElements[parentId])){
				_activeSettingSubElements[parentId] = ko.observable(cValue);
			}
			return true;
		};

		// watcher for old tabs - includes break func for 'new' tabs
		var _autoSettingTabWatcherOld = ko.computed(function(){
			var cValue = cModel.activeSettingsGroupIndex();
			if (cValue < 0){
				return false;
			}
			cModel.activeSettingElement("none");
			return true;
		});

		// watcher for new tabs - includes break func for 'old' tabs
		var _autoSettingTabWatcherNew = ko.computed(function(){
			var cValue = cModel.activeSettingElement();
			if (cValue == "none"){
				return false;
			}
			cModel.activeSettingsGroupIndex(-1);
			return true;
		});

		// the new obs. list for all assigned settings
		cModel.settingElements = ko.computed(function() {
		 	self._refreshWatcher();

		 	// reassign observableMap, only overwrite 'assigned' tabs/items
		 	_.forEach(_settingsObservableMap,function(oData,oKey){
		 		api.settings.observableMap[oKey] = oData;
		 	});
		 	
		 	return self.tab.getAll(true);
        });

		// INIT
        _init();
	};

	// CREATE NEW SETTINGS-MANAGER
	settingsManager = new gtcSettingsManagerClass();
})(window.model);

// add a binding to use objects 'eachProp'
if (_.isUndefined(ko.bindingHandlers["eachProp"])){
	ko.bindingHandlers.eachProp = {
	    transformObject: function (obj){
	    	var cObj = obj;
	    	if (!_.isUndefined(obj.data)){
	    		cObj = ko.utils.unwrapObservable(obj.data);
	    	}

	    	var objAssign = "value";
	    	if (!_.isUndefined(obj.as)){
	    		objAssign = obj.as;
	    	}

	    	var objAssignKey = "key";
	    	if (!_.isUndefined(obj.asKey)){
	    		objAssignKey = obj.asKey;
	    	}

	        var properties = [];
	        _.forEach(cObj,function(cValue,cKey){
	        	var tmp = {};
            	tmp[objAssignKey] = cKey;
            	tmp[objAssign] = cObj[cKey];
                properties.push(tmp);
	        });
	        return ko.observableArray(properties);
	    },
	    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
	        var value = ko.utils.unwrapObservable(valueAccessor());
	        var properties = ko.bindingHandlers.eachProp.transformObject(value);
	        ko.bindingHandlers['foreach'].init(element, properties, allBindingsAccessor, viewModel, bindingContext);
	        return { controlsDescendantBindings: true };
	    },
	    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){	    	
	        var value = ko.utils.unwrapObservable(valueAccessor());
	        var properties = ko.bindingHandlers.eachProp.transformObject(value);
	        ko.bindingHandlers['foreach'].update(element, properties, allBindingsAccessor, viewModel, bindingContext);
	        return { controlsDescendantBindings: true };
	    }
	};
	ko.virtualElements.allowedBindings.eachProp = true;
}

// add a binding to fade a container up 'n down - fadeVisible
if (_.isUndefined(ko.bindingHandlers["fadeVisible"])){
	ko.bindingHandlers.fadeVisible = {
	    init: function(element, valueAccessor, allBindingsAccessor) {
	    	// set after slide mode
	    	var slideMode = allBindingsAccessor.get('slideMode') || "block";

	        // Initially set the element to be instantly visible/hidden depending on the value
	        var value = valueAccessor();
	        if (ko.unwrap(value)){
	        	$(element).slideDown(500,function(){
	        		$(element).css("display",slideMode);
	        	});
	        }else{
	        	$(element).slideUp(500);
	        }
	    },
	    update: function(element, valueAccessor, allBindingsAccessor) {
	    	// set after slide mode
	    	var slideMode = allBindingsAccessor.get('slideMode') || "block";

	        // Whenever the value subsequently changes, slowly fade the element in or out
	        var value = valueAccessor();
	        if (ko.unwrap(value)){
	        	$(element).slideDown(500,function(){
	        		$(element).css("display",slideMode);
	        	});
	        }else{
	        	$(element).slideUp(500);
	        }
	    }
	};
}


// this fixes the 'selectPicker' - on selectedItem BUG (https://forums.uberent.com/threads/bug-setting-ui.62508/)
// toDo: remove after next PA-build
if (_.isUndefined(ko.bindingHandlers.selectPicker.update)){
	ko.bindingHandlers.selectPicker.update = function (element, valueAccessor) {
        $(element).selectpicker('refresh');
    };
}
