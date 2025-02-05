/***
|Description|Supports css- options: per cssSomeOption, creates and updates css variable someOption (to be used as {{{var(--someOption)}}})|
|Source     |https://github.com/YakovL/TiddlyWiki_Experiments/blob/master/CssOptionsPlugin.js|
|Version    |0.3.2|
|Author     |Yakov Litvin|
|License    |[[MIT|https://github.com/YakovL/TiddlyWiki_YL_ExtensionsCollection/blob/master/Common%20License%20(MIT)]]|
***/
//{{{
var cssOptionPrefix = "css"

// cssBorderRadius → borderRadius or null (if not css-)
var optionNameToCssVariable = function(name) {
	if(name.indexOf(cssOptionPrefix) != 0) return null
	var unprefixedName = name.substring(cssOptionPrefix.length)
	return unprefixedName[0].toLowerCase() + unprefixedName.substring(1)
}

var applyVariablesCss = function() {
	var css = ":root {"
	for(var optionName in config.options) {
		var variableName = optionNameToCssVariable(optionName)
		if(variableName) css += "--" + variableName + ":" + config.options[optionName] + ";"
	}
	css += "}"

	setStylesheet(css, "CssOptions")
}

config.macros.option.types[cssOptionPrefix] = config.macros.option.types.txt
var orig_onChange = config.macros.option.types[cssOptionPrefix].onChange
config.macros.option.types[cssOptionPrefix].onChange = function() {
	applyVariablesCss()
	return orig_onChange.apply(this, arguments)
}
config.optionHandlers[cssOptionPrefix] = config.optionHandlers.txt
loadOptions() // only needed in a plugin since loadOptions() is called before loadPlugins()

TiddlyWiki.prototype.addOrReplaceNotification = TiddlyWiki.prototype.addOrReplaceNotification ||
function(title, fn, newTitle, keepExisting) {
	var existingNotification = this.namedNotifications.find(n => n.name == title)
	if(!existingNotification) this.namedNotifications.push({ name: title, notify: fn });
	else if(!keepExisting) {
		existingNotification.notify = fn;
		existingNotification.name = newTitle || title;
	}
	return this; // support chaining
}

if(!window.orig_onSystemSettingsChange) {
	window.orig_onSystemSettingsChange = onSystemSettingsChange
	onSystemSettingsChange = function() {
		var result = orig_onSystemSettingsChange.apply(this, arguments)
		applyVariablesCss()
		return result
	}
	config.notifyTiddlers.find(notif => notif.name == "SystemSettings").notify = onSystemSettingsChange
	store.addOrReplaceNotification("SystemSettings", onSystemSettingsChange)
}
//}}}