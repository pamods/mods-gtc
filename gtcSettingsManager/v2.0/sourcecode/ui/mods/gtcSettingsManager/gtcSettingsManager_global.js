/************************************
 * gtcSettingsManager 				*
 ************************************
 * gtcSettingsManager_global.js		*
 * @author: gtc - gonzo4711			*
 * @version: 2.0 (2014-08-02)		*
 ************************************/

var settingsHelper;

(function(){
	var gtcSettingsHelperClass = function(){
		var self = this;

		var locateSetting = function(id){
			return _.findKey(api.settings.data,function(tabData,tabName){
				return (typeof tabData[id] != "undefined");
			});
			return null;
		};

		/*****************
		 * PUBLIC ACCESS *
		 *****************/

		self.setSetting = function(id,tabName,newValue){
			if (!newValue){
				newValue = tabName;
				tabName = null;
			}

			if (id == ""){
				return null;
			}
			
			if (!tabName){
				tabName = locateSetting(id);
			}else{
				tabName = tabName.toLowerCase().replace(" ","_");
			}

			if (typeof api.settings.data[tabName] != "undefined"){
				if (typeof api.settings.data[tabName][id] != "undefined"){
					api.settings.data[tabName][id] = newValue;
				}
			}
			return null;
		};
		self.getSetting = function(id,tabName){
			((!tabName)?tabName=false:null);

			if (id == ""){
				return null;
			}
			
			if (!tabName){
				tabName = locateSetting(id);
			}else{
				tabName = tabName.toLowerCase().replace(" ","_");
			}

			if (typeof api.settings.data[tabName] != "undefined"){
				if (typeof api.settings.data[tabName][id] != "undefined"){
					return api.settings.data[tabName][id];
				}
			}
			return null;
		};
		self.isSetting = function(id,tabName){
			((!tabName)?tabName=false:null);

			if (id == ""){
				return false;
			}

			if (!tabName){
				tabName = locateSetting(id);
			}else{
				tabName = tabName.toLowerCase().replace(" ","_");
			}

			if (typeof api.settings.data[tabName] != "undefined"){
				if (typeof api.settings.data[tabName][id] != "undefined"){
					return true;
				}
			}
			return false;
		};
		self.getInitialSetting = function(id,defaultValue,tabName){
			((!tabName)?tabName=false:null);
			var setRes = self.getSetting(id,tabName);
			if (setRes === null){
				return defaultValue;
			}
			return setRes;
		};
		self.removeSetting = function (id,tabName){
			((!tabName)?tabName=false:null);

			if (id == ""){
				return null;
			}

			if (!tabName){
				tabName = locateSetting(id);
			}else{
				tabName = tabName.toLowerCase().replace(" ","_");
			}

			if (typeof api.settings.data[tabName] != "undefined"){
				if (typeof api.settings.data[tabName][id] != "undefined"){
					delete api.settings.data[tabName][id];
					return true;
				}
			}
		}

		/**************************
		 * CLASS INIT STARTS HERE *
		 **************************/

		// append methods to model
		if (typeof model == 'object'){
			model.getSetting = self.getSetting;
			model.getInitialSetting = self.getInitialSetting;
		}
	};
	settingsHelper = new gtcSettingsHelperClass();
})();