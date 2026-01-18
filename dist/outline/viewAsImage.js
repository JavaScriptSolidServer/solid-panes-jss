"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
var _default = dom => function viewAsImage(obj) {
  const img = UI.utils.AJARImage(obj.uri, UI.utils.label(obj), UI.utils.label(obj), dom);
  img.setAttribute('class', 'outlineImage');
  return img;
};
exports.default = _default;
//# sourceMappingURL=viewAsImage.js.map