import 'fake-indexeddb/auto';

global.window = {
    localStorage: {
        _data: {},
        setItem: function(id, val) { this._data[String(id)] = String(val); },
        getItem: function(id) { return this._data.hasOwnProperty(String(id)) ? this._data[String(id)] : null; },
        removeItem: function(id) { delete this._data[String(id)]; },
        clear: function() { this._data = {}; }
    }
};
global.localStorage = global.window.localStorage;
global.sessionStorage = global.window.localStorage;
