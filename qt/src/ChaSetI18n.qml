pragma Singleton
import QtQuick 6.10
import ChaSet

// ChaSetI18n.qml — Process-Global Internationalization Manager for ChaSet QML
// Reactive translation manager supporting dynamic language switching, user extensibility,
// and automatic binding updates via revision counter.
QtObject {
    id: root

    property string preference: "system"
    property string locale: "zh-CN"
    property string systemLocale: "zh-CN"
    property var supportedLocales: []
    property var customResolver: null
    property int revision: 0

    // Internal dictionaries map: { [localeCode]: { [namespace]: { ... } } }
    property var _dictionaries: ({})
    property var _localesMeta: ({})

    readonly property string defaultLocale: ChaSetI18nData.meta.defaultLocale || "zh-CN"
    readonly property string fallbackLocale: ChaSetI18nData.meta.fallbackLocale || "en-US"

    Component.onCompleted: {
        _initSystemLocale();
        _initBuiltinData();
        _resolveActiveLocale();
    }

    function _initSystemLocale() {
        var sysName = "zh-CN";
        try {
            var qloc = Qt.locale();
            if (qloc && qloc.name) {
                var raw = qloc.name.replace("_", "-");
                var lower = raw.toLowerCase();
                if (lower.startsWith("zh")) {
                    sysName = "zh-CN";
                } else if (lower.startsWith("en")) {
                    sysName = "en-US";
                } else {
                    sysName = raw;
                }
            }
        } catch (e) {
            sysName = "zh-CN";
        }
        root.systemLocale = sysName;
    }

    function _initBuiltinData() {
        var metaObj = ChaSetI18nData.meta.locales || {};
        var list = [];
        var metaMap = {};
        for (var code in metaObj) {
            list.push(metaObj[code]);
            metaMap[code] = metaObj[code];
        }
        root.supportedLocales = list;
        root._localesMeta = metaMap;

        var dicts = {};
        var builtin = ChaSetI18nData.builtinLocales || {};
        for (var lCode in builtin) {
            dicts[lCode] = JSON.parse(JSON.stringify(builtin[lCode]));
        }
        root._dictionaries = dicts;
    }

    function _resolveActiveLocale() {
        if (root.preference === "system") {
            root.locale = root._localesMeta[root.systemLocale] ? root.systemLocale : root.defaultLocale;
        } else {
            root.locale = root._localesMeta[root.preference] ? root.preference : root.defaultLocale;
        }
    }

    function setPreference(pref) {
        if (!pref || pref === "") pref = "system";
        root.preference = pref;
        _resolveActiveLocale();
        root.revision++;
    }

    function registerLocale(metadata, messages) {
        if (!metadata || !metadata.code) return;
        var code = metadata.code;

        var nextMeta = root._localesMeta;
        nextMeta[code] = metadata;
        root._localesMeta = nextMeta;

        var list = [];
        for (var k in nextMeta) {
            list.push(nextMeta[k]);
        }
        root.supportedLocales = list;

        var dicts = root._dictionaries;
        dicts[code] = _deepMerge(dicts[code] || {}, messages || {});
        root._dictionaries = dicts;

        _resolveActiveLocale();
        root.revision++;
    }

    function extendLocale(code, messages) {
        if (!code || !messages) return;
        var dicts = root._dictionaries;
        dicts[code] = _deepMerge(dicts[code] || {}, messages);
        root._dictionaries = dicts;
        root.revision++;
    }

    function setCustomResolver(resolverFn) {
        root.customResolver = resolverFn;
        root.revision++;
    }

    function tr(key, defaultText, params) {
        // Access reactive properties so any calling QML property binding tracks them!
        var _rev = root.revision;
        var _loc = root.locale;

        if (typeof root.customResolver === "function") {
            try {
                var res = root.customResolver(key, defaultText);
                if (res !== undefined && res !== null && res !== "") {
                    return _interpolate(res, params);
                }
            } catch (e) {
                // fallback
            }
        }

        var template = _lookup(_loc, key);
        if (template === undefined && _loc !== root.defaultLocale) {
            template = _lookup(root.defaultLocale, key);
        }
        if (template === undefined && _loc !== root.fallbackLocale) {
            template = _lookup(root.fallbackLocale, key);
        }

        var raw = template !== undefined ? template : (defaultText !== undefined ? defaultText : key);
        return _interpolate(raw, params);
    }

    function _lookup(locCode, key) {
        var dict = root._dictionaries[locCode];
        if (!dict) return undefined;

        var parts = key.split(".");
        var cur = dict;
        for (var i = 0; i < parts.length; i++) {
            if (cur === undefined || cur === null || typeof cur !== "object") return undefined;
            cur = cur[parts[i]];
        }
        return (typeof cur === "string") ? cur : undefined;
    }

    function _interpolate(templateStr, params) {
        if (!templateStr || typeof templateStr !== "string") return templateStr;
        if (!params || typeof params !== "object") return templateStr;

        var res = templateStr;
        for (var pKey in params) {
            var val = String(params[pKey]);
            res = res.split("{{" + pKey + "}}").join(val);
            res = res.split("{{" + pKey.trim() + "}}").join(val);
        }
        return res;
    }

    function _deepMerge(target, source) {
        if (!source || typeof source !== "object") return target;
        var result = JSON.parse(JSON.stringify(target || {}));
        for (var key in source) {
            if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                result[key] = _deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }
}
