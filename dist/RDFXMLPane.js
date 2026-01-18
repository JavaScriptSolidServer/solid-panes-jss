"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RDFXMLPane = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
var $rdf = _interopRequireWildcard(require("rdflib"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/*      RDF/XML content Pane
 **
 **  This pane shows the content of a particular RDF resource
 ** or at least the RDF semantics we attribute to that resource,
 ** in generated N3 syntax.
 */

const ns = UI.ns;
const RDFXMLPane = exports.RDFXMLPane = {
  icon: UI.icons.originalIconBase + '22-text-xml4.png',
  name: 'RDFXML',
  audience: [ns.solid('Developer')],
  label: function (subject, context) {
    const store = context.session.store;
    if ('http://www.w3.org/2007/ont/link#ProtocolEvent' in store.findTypeURIs(subject)) {
      return null;
    }
    const n = store.statementsMatching(undefined, undefined, undefined, subject).length;
    if (n === 0) return null;
    return 'As RDF/XML (' + n + ')';
  },
  render: function (subject, context) {
    const myDocument = context.dom;
    const kb = context.session.store;
    const div = myDocument.createElement('div');
    div.setAttribute('class', 'RDFXMLPane');
    // Because of smushing etc, this will not be a copy of the original source
    // We could instead either fetch and re-parse the source,
    // or we could keep all the pre-smushed triples.
    const sts = kb.statementsMatching(undefined, undefined, undefined, subject); // @@ slow with current store!
    /*
    var kludge = kb.formula([]) // No features
    for (var i=0; i< sts.length; i++) {
        s = sts[i]
        kludge.add(s.subject, s.predicate, s.object)
    }
    */
    const sz = $rdf.Serializer(kb);
    sz.suggestNamespaces(kb.namespaces);
    sz.setBase(subject.uri);
    const str = sz.statementsToXML(sts);
    const pre = myDocument.createElement('PRE');
    pre.appendChild(myDocument.createTextNode(str));
    div.appendChild(pre);
    return div;
  }
};

// ends
//# sourceMappingURL=RDFXMLPane.js.map