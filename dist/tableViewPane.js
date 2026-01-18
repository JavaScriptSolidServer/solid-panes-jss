"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tableViewPane = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
// Format an array of RDF statements as an HTML table.
//
// This can operate in one of three modes: when the class of object is given
// or when the source document from which data is taken is given,
// or if a prepared query object is given.
// (In principle it could operate with neither class nor document
// given but typically
// there would be too much data.)
// When the tableClass is not given, it looks for common  classes in the data,
// and gives the user the option.
//
// 2008 Written, Ilaria Liccardi
// 2014 core functionality now in common/table.js   -timbl

// ///////////////////////////////////////////////////////////////////

// Table view pane  -- view of a class as a table of properties of class members

const tableViewPane = exports.tableViewPane = {
  icon: UI.icons.originalIconBase + 'table.png',
  name: 'tableOfClass',
  label: function (subject, context) {
    const store = context.session.store;
    // if (!store.holds(subject, UI.ns.rdf('type'),UI.ns.rdfs('Class'))) return null
    if (!store.any(undefined, UI.ns.rdf('type'), subject)) {
      return null;
    }
    const n = store.statementsMatching(undefined, UI.ns.rdf('type'), subject).length;
    if (n === 0) {
      // None, suppress pane
      return null;
    }
    if (n > 15) {
      // @@ At the moment this pane can be slow with too many @@ fixme by using limits
      return null;
    }
    return UI.utils.label(subject) + ' table';
  },
  render: function (subject, context) {
    const myDocument = context.dom;
    const div = myDocument.createElement('div');
    div.setAttribute('class', 'tablePane');
    div.appendChild(UI.table(myDocument, {
      tableClass: subject
    }));
    return div;
  }
};
//# sourceMappingURL=tableViewPane.js.map