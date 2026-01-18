"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _solidLogicJss = require("solid-logic-jss");
var UI = _interopRequireWildcard(require("solid-ui-jss"));
var panes = _interopRequireWildcard(require("pane-registry"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/*      View argument Pane
**
**  This pane shows a position and optionally the positions which
** support or oppose it.
** @@ Unfinsihed.
** Should allow editing the data too

*/
// console.log('@@@ argument pane icon at ' + (module.__dirname || __dirname) + '/icon_argument.png')
var _default = exports.default = {
  icon: (module.__dirname || __dirname) + '/icon_argument.png',
  // @@ fix fro mashlib version

  name: 'argument',
  label: function (subject) {
    const kb = _solidLogicJss.store;
    const t = kb.findTypeURIs(subject);
    if (t[UI.ns.arg('Position').uri]) return 'Argument';
    return null;
  },
  // View the data in a file in user-friendly way
  render: function (subject, dom) {
    const outliner = panes.getOutliner(dom);
    const kb = _solidLogicJss.store;
    const arg = UI.ns.arg;
    subject = kb.canon(subject);
    // var types = kb.findTypeURIs(subject)

    const div = dom.createElement('div');
    div.setAttribute('class', 'argumentPane');

    // var title = kb.any(subject, UI.ns.dc('title'))

    const comment = kb.any(subject, UI.ns.rdfs('comment'));
    if (comment) {
      const para = dom.createElement('p');
      para.setAttribute('style', 'margin-left: 2em; font-style: italic;');
      div.appendChild(para);
      para.textContent = comment.value;
    }
    div.appendChild(dom.createElement('hr'));
    let plist = kb.statementsMatching(subject, arg('support'));
    outliner.appendPropertyTRs(div, plist, false);
    div.appendChild(dom.createElement('hr'));
    plist = kb.statementsMatching(subject, arg('opposition'));
    outliner.appendPropertyTRs(div, plist, false);
    div.appendChild(dom.createElement('hr'));
    return div;
  }
}; // ends
//# sourceMappingURL=argumentPane.js.map