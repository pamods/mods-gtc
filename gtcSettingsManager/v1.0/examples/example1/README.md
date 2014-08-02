Example 1
=====================

### Summary - Setup ###
Create a new 'dropDown' in the 'ui' Tab.

### Summary - Handle ###
Read the value from the settings - use the 'settingHelper'

### Summary - Example image ###
_example1.png_

***************************************************************************************************************************************************
### Setup ###

This will create a new 'dropDown' with simple 'ON','OFF' (by default) values.
We do not use a 'group', so the setting will append to the 'default' settings in the **UI**-Tab.
The id to locate the setting is **gtc_example1_s0**

```javascript
model.addSetting.dropDown('gtc_example1_s0','GTC example setting',{'0':'OFF','1':'ON'},0,'ui');
```

***************************************************************************************************************************************************
### Handle ###

To use this new created setting in your code, you can use the native-settings-api (**api.settings**), or the new **settingsHelper**
To return the settings value from the id  **gtc_example1_s0** you can use the following code:

```javascript
settingHelper.getSetting('gtc_example1_s0');
```

If the user didn't SETUP the settings, you can get the setting-value with a **initial-value**
```javascript
settingHelper.getInitialSetting('gtc_example1_s0','default value');
```

***************************************************************************************************************************************************
### Example image ###
![this image is missing](https://github.com/pamods/mods-gtc/blob/master/gtcSettingsManager/examples/example1/example1_final.png "UI settings example 1")
