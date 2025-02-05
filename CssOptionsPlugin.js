/***
|Description|Supports css- options: per cssSomeOption, creates and updates css variable someOption (to be used as {{{var(--someOption)}}})|
|Source     |https://github.com/YakovL/TiddlyWiki_Experiments/blob/master/CssOptionsPlugin.js|
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
//}}}