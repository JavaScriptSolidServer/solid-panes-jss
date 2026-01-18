"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "OutlineManager", {
  enumerable: true,
  get: function () {
    return _manager.default;
  }
});
exports.UI = void 0;
Object.defineProperty(exports, "byName", {
  enumerable: true,
  get: function () {
    return _paneRegistry.byName;
  }
});
exports.getOutliner = getOutliner;
Object.defineProperty(exports, "initMainPage", {
  enumerable: true,
  get: function () {
    return _mainPage.default;
  }
});
Object.defineProperty(exports, "list", {
  enumerable: true,
  get: function () {
    return _paneRegistry.list;
  }
});
Object.defineProperty(exports, "paneForIcon", {
  enumerable: true,
  get: function () {
    return _paneRegistry.paneForIcon;
  }
});
Object.defineProperty(exports, "paneForPredicate", {
  enumerable: true,
  get: function () {
    return _paneRegistry.paneForPredicate;
  }
});
Object.defineProperty(exports, "register", {
  enumerable: true,
  get: function () {
    return _paneRegistry.register;
  }
});
Object.defineProperty(exports, "versionInfo", {
  enumerable: true,
  get: function () {
    return _versionInfo.default;
  }
});
var _versionInfo = _interopRequireDefault(require("./versionInfo"));
var UI = _interopRequireWildcard(require("solid-ui-jss"));
exports.UI = UI;
var _solidLogicJss = require("solid-logic-jss");
var _manager = _interopRequireDefault(require("./outline/manager.js"));
var _registerPanes = require("./registerPanes.js");
var _paneRegistry = require("pane-registry");
var _context = require("./outline/context");
var _mainPage = _interopRequireDefault(require("./mainPage"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/*                            SOLID PANES
 **
 **     Panes are regions of the outline view in which a particular subject is
 ** displayed in a particular way.
 ** Different panes about the same subject are typically stacked vertically.
 ** Panes may be used naked or with a pane selection header.
 **
 ** The label() method has two functions: it determines whether the pane is
 ** relevant to a given subject, returning null if not.
 ** If it is relevant, then it returns a suitable tooltip for a control which selects the pane
 */

function getOutliner(dom) {
  if (!dom.outlineManager) {
    const context = (0, _context.createContext)(dom, {
      list: _paneRegistry.list,
      paneForIcon: _paneRegistry.paneForIcon,
      paneForPredicate: _paneRegistry.paneForPredicate,
      register: _paneRegistry.register,
      byName: _paneRegistry.byName
    }, _solidLogicJss.store, _solidLogicJss.solidLogicSingleton);
    dom.outlineManager = new _manager.default(context);
  }
  return dom.outlineManager;
}
if (typeof window !== 'undefined') {
  getOutliner(window.document);
}
(0, _registerPanes.registerPanes)(cjsOrEsModule => (0, _paneRegistry.register)(cjsOrEsModule.default || cjsOrEsModule));

// This has common outline mode functionality for the default and other other panes
// A separate outline manager is required per DOM in cases like a browser extension
// where there are many occurrences of window and of window.document
// But each DOM should have just one outline manager.

// export for simpler access by non-node scripts
if (typeof window !== 'undefined') {
  ;
  window.panes = {
    getOutliner
  };
}
//# sourceMappingURL=index.js.map