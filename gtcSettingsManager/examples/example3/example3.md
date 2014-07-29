Example 3
=====================

### Summary - Setup ###
Create custom groups and settings in a new 'gtc' Tab.

### Summary - Handle ###
Read the value from the settings - use the 'settingHelper'

### Summary - Example image ###
_example3_final.png_

***************************************************************************************************************************************************
### Setup ###

This will create two new settings in a new created **GTC**-Tab with two separated groups and settings.

```javascript
model.addSetting.dropDown('gtc_example3_s0','GTC user setting 0',{'0':'OFF','1':'ON'},0,'gtc','GTC user settings');
model.addSetting.text('gtc_example3_s1','GTC user setting 1','empty field value','gtc','GTC user settings');
model.addSetting.dropDown('gtc_example3_s2','GTC user setting status',{'0':'OFF','1':'ON'},0,'gtc','GTC general settings');
model.addSetting.text('gtc_example3_s3','GTC user setting x','empty field value','gtc','GTC general settings');
```

***************************************************************************************************************************************************
### Handle ###

To use this new created setting in your code, you can use the native-settings-api (**api.settings**), or the new **settingsHelper**
To return the settings value from the ids you can use the following code:

```javascript
settingHelper.getSetting('gtc_example1_s0');
settingHelper.getSetting('gtc_example1_s1');
settingHelper.getSetting('gtc_example1_s2');
settingHelper.getSetting('gtc_example1_s3');
```

If the user didn't SETUP the settings, you can get the setting-value with a **initial-value**
```javascript
settingHelper.getInitialSetting('gtc_example1_s0','default value');
settingHelper.getInitialSetting('gtc_example1_s1','default value x');
settingHelper.getInitialSetting('gtc_example1_s2','default value x');
settingHelper.getInitialSetting('gtc_example1_s3','default value x');
```

***************************************************************************************************************************************************
### Example image ###
![this image is missing](https://github.com/pamods/mods-gtc/tree/master/examples/example1/example3_final.png "UI settings example 3")