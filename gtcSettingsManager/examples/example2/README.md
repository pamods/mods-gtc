Example 2
=====================

### Summary - Setup ###
Create custom settings in the 'ui' Tab in a new group.

### Summary - Handle ###
Read the value from the settings - use the 'settingHelper'

### Summary - Example image ###
_example2_final.png_

***************************************************************************************************************************************************
### Setup ###

This will create two new settings. A **dropDown** and a **textField**.
We will separate the settings in a custom group, called **GTC user settings** in the **UI**-Tab.
As you can see in the example image, the 'default' group will be created automatically and filled with the **nonGroupedSettings** (settings with no especially setted group)
The ids to locate the settings are **gtc_example2_s0** and **gtc_example2_s1**

```javascript
model.addSetting.dropDown('gtc_example2_s0','GTC user setting 0',{'0':'OFF','1':'ON'},0,'ui','GTC user settings');
model.addSetting.text('gtc_example2_s1','GTC user setting 1','empty field value','ui','GTC user settings');
```

***************************************************************************************************************************************************
### Handle ###

To use this new created setting in your code, you can use the native-settings-api (**api.settings**), or the new **settingsHelper**
To return the settings value from the ids you can use the following code:

```javascript
settingHelper.getSetting('gtc_example1_s0');
settingHelper.getSetting('gtc_example1_s1');
```

If the user didn't SETUP the settings, you can get the setting-value with a **initial-value**
```javascript
settingHelper.getInitialSetting('gtc_example1_s0','default value');
settingHelper.getInitialSetting('gtc_example1_s1','default value x');
```

***************************************************************************************************************************************************
### Example image ###
![this image is missing](https://github.com/pamods/mods-gtc/blob/master/gtcSettingsManager/examples/example1/example2_final.png "UI settings example 2")