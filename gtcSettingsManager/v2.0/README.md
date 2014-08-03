PA-gtcSettingsManager v2.0
===============================================================================

Planetary Annihilation Mod - manage settings, tabs, groups and items in a structured system.

## Info ##
This mod is still WIP. This means you may encounter bugs or performance problems. Please report found BUGs in the [forum](https://forums.uberent.com/threads/wip-more-settings-manager.61034).

## Why creating this mod? ##
After PAMM installation and activating a handfull mods, the Settings UI is crowded with settings of each mod.
Sometimes you are searching for the correct setting a while until you'll see it.
This is always annoying, so there should be a better solution for this.

## Alternatives? ##
Setting up new _setting-elements_ is easier since the new setting-API was build.
BUT: Settings are still restricted to two elements "selection" and "slider" - no dynamic visibility or special adjustments, no tab or group handling...

## What are the features? ##
With the settingsManager it is now possible to create dynamic elements (items) in a new and easy way. New items are supported (in example: textfields or buttons) and can be changed dynamically or positioned to a fix grid.

**supportet elements (items)**
* selection
* slider
* textfield
* text
* button

**supportet groups (containers)**
* tabs
* subtabs
* groups

**supported functions on each container/item**
* easy _object_ handling (add,get,remove)
* grid-handling (positioning of items)
* dynamic adjustments to
	* show/hide an item/container
	* change label/text

*******************************************************************************
## TOC ##

1. [Understanding the manager](#understanding-the-manager)
    * [Elements](#elements)
    * [Container schema](#container-schema)
    * [Hidden features](#hidden-features)
    * [getters & setters](#getters-and-setters---the-functions)
    * [Working with IDs](#working-with-ids)
    * [Access the manager](#access-the-manager)
    * [Elements are observed](#elements-are-observed)
2. [Using the elements](#using-the-elements)
    * [TABS (root)](#tabs-root)
    * [SUBTABS (lvl 1)](#subtabs-level-1-tabs)
    * [GROUPS](#groups)
    * [ITEMS](#items)
        * [ITEM-TYPES](#item-types)
        * [ITEM-FUNCTIONS](#item-functions)
3. [Using the helper](#using-the-helper)
4. [Examples](examples/)


*******************************************************************************

## Understanding the manager ##
Before startup and creating new settings, it is important to understand
how the system works and elements depends on each other


### Elements ###
There are four kinds of elements:
* tabs (already known)
* subtabs (new tab level in tabs)
* groups (new container - collection of setting-items)
* items (already known, but extended)


### Container schema ###
Every item depends on a chain of containers.
This schema is forced, always available and each element exists a min. of a single time:
* tab
	* subtab
		* group
			* item

**REALLY! ALWAYS! DON'T FORGET THIS!**


### Hidden features ###
_Subtabs_ and _groups_ are not always visible - that depends on the elements type.

The _delivery-status_ of the PA-settings work with a **default** subtab and **default** group.
Such **defaults** will be automatically hidden, if there are no other elements on the same level.
So, if this **settingsManager** is active, you will not see any differences, first.


### getters and _setters_ - the functions ###
Almost... each element in the **settingsManager** is accessable with the same functions:
* add() - adds a new element to it's parent
* get() - returns a child element
* getAll() - returns a collection of all child elements
* remove() - removes a child element
* default() - adds ( or gets) and returns a **default** element

**Note:** Each function (except 'remove') will return the accessable object(s)


### Working with IDs ###
Each kind of element will work with IDs, so it's important to know, how IDs will be generated.

Accessing elements without an ID is impossible, but every element can return it's generated ID.
IDs are always unique in a level of elements, so it is impossible to create a second element with the same ID.
IDs are generated out of a string, like a **nameString**.
So in example if a tab will be created and named "My test Tab" the generated ID will be: "my_test_tab".
Looks very easy - is very easy: replace "whitespaces" with "underscores" to "lowercase".

### Access the manager ###
To prevent conflicts with other mods (like 'rManager') this mod binds all elements to a new class. This can be accessed by the **settingsManager** var.
```javascript
settingsManager.[functions]
```

### Elements are observed ###
Each element (and some functional item-values) are observed objects. So if you change a title, hide a tab, change a value or something else will update the DOM immediately.

BUT: Tabs (the root-tabs) that are newly created must be assigned first, to take effect to the DOM.
```javascript
settingsManager.tab.assign("my_test_tab");
```

This will prevent a lot of DOM-activity during the creation of new elements.
Operations (add,change,remove) on already assigned tabs will update the DOM immediately.

BUT: This effect can be _hold up_ if you will have a large quantity of operations (add, remove, change):
```javascript
settingsManager.hold(true);
```

... and released, if you finished:
```javascript
settingsManager.hold(false);
```

*******************************************************************************

## Using the elements ##
As described at the top, accessing and generating elements work always in that kind.
So a for example a 'item' in a 'group' in a 'tab' can be generated in a single command sequence:
```javascript
settingsManager.tab.add("My test tab").group.add("Private Settings").item.add("private_item_k0","textfield",{default: 'private'});
```

**Hint:** Please also note the [examples](examples).
*******************************************************************************

### Tabs (root) ###
Tabs are already known. They are the main container to access the settings (items).

**IMPORTANT:** The tabs 'twitch','server','keyboard' **cannot** be managed, while special behaviours exist.

#### Creating a tab ####
The function will return the new tab object, so it can be stored also in a _var_. Don't forget to _assign_ this tab, if its a 'root' (top-level) tab. 

**settingsManager.tab.add(tabName,tabOptions);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabName      | string | The new tabName - the tabID is generated out of the tabName |
| tabOptions   | object | A tabOptions object like: {title:"Test", visible: false} |

> **tabOptions: {}**
> 
> |      KEY     |  TYPE  |               DESCRIPTION                 |
> | ------------ | ------ | ----------------------------------------- |
> | visible      | bool   | This tab is visible or not after creating it (and assigned). Tab content is also hidden... |
> | id           | string | Sets a non auto-generated tabID   |


#### Assigning a tab ####
The function will assign a tab to the DOM-refresh-watcher.

**settingsManager.tab.assign(tabId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabId        | string | The (auto-generated) tabId |

#### Access a tab ####
The function will return the tab object, so it can be stored also in a _var_.

**settingsManager.tab.get(tabId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabId        | string | The (auto-generated) tabId |

#### Access all tabs ####
The function will return a collection of tab-objects.

**settingsManager.tab.getAll();**

#### Remove a tab ####
The function will remove a tab and all of its contents (subTabs, groups, items)

**settingsManager.tab.remove(tabId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabId        | string | The (auto-generated) tabId |

*******************************************************************************

### subTabs (level 1 tabs) ###
subTabs always depends to a mainTab (root) and are shown below the mainTabBar (if they are visible). subTabs don't need to be assigned. A 'default' subTab will be generated while using the **tab.add-function** on a tab-object (root).

#### Creating a subTab ####
The function will return the new subTab object. First, the 'sub' element needs to get access to a mainTab. This can be done in multiple ways:

```javascript
var mainTab = settingsManager.tab.get(tabId);
mainTab = settingsManager.tab.add(tabName);
settingsManager.tab.add(tabName) ->
```

**[mainTab].sub.add(tabName,tabOptions);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabName      | string | The new tabName - the tabID is generated out of the tabName |
| tabOptions   | object | A tabOptions object like: {title:"Test", visible: false} |

> **tabOptions: {}**
> 
> |      KEY     |  TYPE  |               DESCRIPTION                 |
> | ------------ | ------ | ----------------------------------------- |
> | visible      | bool   | This subTab is visible or not after creating it. SubTab content is also hidden... |
> | id           | string | Sets a non auto-generated tabID   |
> | status       | bool   | This will show/hide the subtab (label), but don't attach its content (groups,items) - this is used for 'default' tabs   |

#### Access a subTab ####
The function will return the tab object, so it can be stored also in a _var_.

**[mainTab].sub.get(tabId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabId        | string | The (auto-generated) tabId |

#### Access the defaultTab (add & get) ####
The function will return the **default** subTab object (and creates it, if not exist)

**[mainTab].sub.default();**

#### Access all subTabs ####
The function will return a collection of subTab-objects.

**[mainTab].sub.getAll();**

#### Remove a subTab ####
The function will remove a subTab and all of its contents (groups, items)

**[mainTab].sub.remove(tabId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| tabId        | string | The (auto-generated) tabId |

*******************************************************************************

### Groups ###
groups always depends to a subTab (lvl 1) and are shown in a tabContainer as a 'super' container, that contains a collection of items.
Groups are not always visible. A **default** group will be generated while using the **tab.add-function** on a subTab-object (lvl 1).

Accessing the group-functions (add,get,remove ...) from a mainTab (root) will always create a **default** subTab and returns it for group-access.

#### Creating a group ####
The function will return the new group object. First, the 'group' element needs to get access to a subTab. This can be done in multiple ways:

```javascript
var subTab = [mainTab].sub.get(subTabId);
subTab = [mainTab].sub.add(subTabName);
[mainTab].sub.add(subTabName) ->
settingsManager.tab.get(tabId).sub.get(subTabId) ->
```

**[subTab].group.add(groupName,groupOptions);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| groupName      | string | The new tabName - the groupID is generated out of the groupName |
| groupOptions   | object | A groupOptions object like: {title:"Test", visible: false} |

> **groupOptions: {}**
> 
> |      KEY     |  TYPE  |               DESCRIPTION                 |
> | ------------ | ------ | ----------------------------------------- |
> | visible      | bool   | This group is visible or not after creating it. group content is also hidden... |
> | id           | string | Sets a non auto-generated groupID   |
> | status       | bool   | This will show/hide the group (label), but don't attach its content (items) - this is used for 'default' tabs   |

#### Access a group ####
The function will return the group object, so it can be stored also in a _var_.

**[subTab].group.get(groupId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| groupId        | string | The (auto-generated) groupId |

#### Access the defaultGroup (add & get) ####
The function will return the **default** group object (and creates it, if not exist)

**[subTab].group.default();**

#### Access all groups ####
The function will return a collection of group-objects.

**[subTab].group.getAll();**

#### Remove a group ####
The function will remove a group and all of its contents (items)

**[subTab].group.remove(groupId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| groupId      | string | The (auto-generated) groupId |

*******************************************************************************

### Items ###
Items always depends to a group.
Items are dynamic in its width and height, but can be also restricted to grid (max 4 columns,max 5 rows).

**NOTE:**
The items function can be also accessed directly from a **tab** or **subTab** object. ([tab].item. - [subTab].item. ). This means, that a **default** group (and a **default** subTab) will be generated on this tab-object.

#### Creating an item ####
The function will return the new item object. First, the 'item' element needs to get access to a group. This can be done in multiple ways:

```javascript
var group = [subTab].group.get(groupId);
group = [subTab].group.add(groupName);
group = [subTab].group.default();
[subTab].group.add(groupName) ->
settingsManager.tab.get(tabId).sub.get(subTabId).group.get(groupId) ->
settingsManager.tab.get(tabId).group.default() ->
```

**[ group | tab | subTab ].item.add(itemId,itemType,itemOptions);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| itemId       | string | The new itemId - The itemName will be generated out of the id |
| itemType     | string | A possible itemType (select,slider,texfield,text,button) |
| itemOptions  | object | A itemOptions object like: {title:"Test setting", visible: false} |

> **itemOptions: {} defaults**
> 
> |      KEY     |  TYPE  |               DESCRIPTION                 |
> | ------------ | ------ | ----------------------------------------- |
> | visible      | bool   | This item is visible or not after creating it. group content is also hidden... |
> | title        | string | Sets the item title (label)   |
> | default      | mixed  | The default value |
> | columns      | int    | A fixed grid-width (1-4)   |
> | rows         | int    | A fixed grid-height (1-5)   |
> | status       | bool   | Only used for 'buttons'   |

#### Access an item ####
The function will return the item object, so it can be stored also in a _var_.

**[ group | tab | subTab ].item.get(itemId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| itemId       | string | The itemId |

#### Access all items ####
The function will return a collection of item-objects.

**[ group | tab | subTab ].item.getAll();**

#### Remove an item ####
The function will remove a item

**[ group | tab | subTab ].item.remove(itemId);**

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| itemId       | string | The itemId |

*******************************************************************************

### Item types ###
This is a list of currently supported types.

#### select ####
Creates a **select** (dropDown) element. Define possible 'options' in the **itemOptions**. These options must be a JSON-object.
```javascript
[ group | tab | subTab ].item.add('test_id','select',{options: {'0': 'OFF','1': 'ON'},default: '1'});
```

#### slider ####
Creates a **slider** element. Define min.max,step in the **itemOptions**.
```javascript
[ group | tab | subTab ].item.add('test_id','slider',{min: 0, max: 100, step: 10});
```

#### textfield ####
Creates a **textField** element.
```javascript
[ group | tab | subTab ].item.add('test_id','textfield',{default: 'Enter content here...'});
```

#### text ####
Creates a **text** element. Note, that the 'label' (title) will be hidden for this itemType. This element will not be pushed to tha settings-API.
```javascript
[ group | tab | subTab ].item.add('test_id','text',{text: 'Once upon a time, there was a tab ...'});
```

#### button ####
Creates a **button** element. Note, that the 'label' will be hidden for this itemType. The item-title will be used for this button. This element will not be pushed to the settings-API.

Use **status** to modify the button-layout. Use the 'onClick' callback function, to handle a mouseClick.
```javascript
[ group | tab | subTab ].item.add('test_id','button',{title: 'Cache Data', onClick: _callbackFunc});
```

*******************************************************************************

### Item functions ###
This is a list of available functions on an item-object.

#### Item-title ####
The **title()** function is a get/set observable-function and will affect the DOM immediately. (The title is used for the label ove the current item and for some itemTypes not in-use.)

```javascript
var currentTitle = [item].title();
[item].title("NEW TITLE");
```

#### Item-visible ####
The **visible()** function is a get/set observable-function and will affect the DOM immediately.

```javascript
var isVisible = [item].visible();
[item].visible(false); // hide item
[item].visible(true); // show item
```

#### Item-status ####
The **status()** function is a get/set observable-function and will affect the DOM immediately. This function is only used for 'button' types.

```javascript
var isActive = [item].status();
[item].status(false); // set inactive style
[item].status(true); // set active style
```

#### Item-columns ####
The **columns()** function is a get/set observable-function and will affect the DOM immediately. This function is used to 'force' the item to a grid.
_The values can be on of the following:_
* '' - empty string: no reservation and dynamic width
* [1-4] - int (1-5): fixed width of 1 up to 4 columns.

So now it is possible to 'reserve' space between items. 

```javascript
var cWidth = [item].columns();
[item].columns(''); // set dynamic width
[item].columns(3); // set a three-column width
```

#### Item-rows ####
The **rows()** function is a get/set observable-function and will affect the DOM immediately. This function is used to 'force' the item to a grid.
_The values can be on of the following:_
* '' - empty string: no reservation and dynamic height
* [1-4] - int (1-5): fixed width of 1 up to 4 rows.

So now it is possible to 'reserve' space between items. 

```javascript
var cHeight = [item].rows();
[item].rows(''); // set dynamic height
[item].rows(2); // set a two-row height
```
*******************************************************************************

### Using the helper ###
To access the created element, there is also a simple way to get it's value.
This can be accessed by the **settingsHelper** var.
```javascript
settingsHelper.[functions]
```

**Function list**
```javascript
settingsHelper.getSetting(id[,tabName]);
settingsHelper.getInitialSetting(id,defaultValue[,tabName]);
settingsHelper.setSetting(id,tabName,newValue) || settingsHelper.setSetting(id,newValue);
settingsHelper.isSetting(id[,tabName]);
settingsHelper.transferSetting(id,fromTab,toTab);
settingsHelper.removeSetting(id[,tabName]);
```


#### Get a setting ####
If the tabName is unknown, the settingsHelper will search for it.
**HINT:** Never use two settings with the same **id** in different tabs!

```
settingsHelper.getSetting(id[,tabName])
```

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| id           | string | Identifier of the field                   |
| tabName      | string | optional: A tab name (i.e. "ui")          |


#### Get a setting with initial value ####
If a setting does not exist, this function returns the setted default value.
If the tabName is unknown, the settingsHelper will search for it.

```
settingsHelper.getInitialSetting(id,defaultValue[,tabName]);
```

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| id           | string | Identifier of the field                   |
| defaultValue | int    | The default value                         |
| tabName      | string | optional: A tab name (i.e. "ui")          |


#### Change a setting temporarily ####
If a setting does not exist, this function returns the setted default value.
If the tabName is unknown, the settingsHelper will search for it.

```
settingsHelper.setSetting(id,tabName,newValue)
OR
settingsHelper.setSetting(id,newValue);
```

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| id           | string | Identifier of the field                   |
| defaultValue | int    | The default value                         |
| tabName      | string | optional: A tab name (i.e. "ui")          |


#### Check for a setting ####
This will check a settingId if it is available or part of a tab.
If a setting does not exist, this function returns the setted default value.
If the tabName is unknown, the settingsHelper will search for it.

```
[boolean] settingsHelper.isSetting(id[,tabName]);
```

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| id           | string | Identifier of the field                   |
| tabName      | string | optional: A tab name (i.e. "ui")          |


#### Remove a setting ####
This will remove a setting key temporarily (or permanent after save)

```
[boolean] settingsHelper.removeSetting(id[,tabName]);
```

|      KEY     |  TYPE  |               DESCRIPTION                 |
| ------------ | ------ | ----------------------------------------- |
| id           | string | Identifier of the field                   |
| tabName      | string | A tab name (i.e. "ui")                    |

*******************************************************************************

### More information about PA can be found here ###
http://www.uberent.com/pa/
