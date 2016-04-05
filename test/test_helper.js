/* globals global, window, describe, it */

import jsdom from 'jsdom'
import chai from 'chai'

const doc = jsdom.jsdom('<!doctype html><html><body><div id="app"></div></body></html>', {
    url: 'http://localhost'
})
const win = doc.defaultView

win.localStorage = win.sessionStorage = {
    getItem: function (key) {
        return this[key]
    },
    setItem: function (key, value) {
        this[key] = value
    }
}

global.document = doc
global.window = win

Object.keys(window).forEach((key) => {
    if (!(key in global)) {
        global[key] = window[key]
    }
})
