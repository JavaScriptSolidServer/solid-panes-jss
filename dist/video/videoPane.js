"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
var $rdf = _interopRequireWildcard(require("rdflib"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/*   Single video play Pane
 **
 */
var _default = exports.default = {
  icon: UI.icons.iconBase + 'noun_1619.svg',
  name: 'video',
  // Does the subject deserve an slideshow pane?
  label: function (subject, context) {
    const kb = context.session.store;
    const typeURIs = kb.findTypeURIs(subject);
    const prefix = $rdf.Util.mediaTypeClass('video/*').uri.split('*')[0];
    for (const t in typeURIs) {
      if (t.startsWith(prefix)) return 'Play video';
    }
    return null;
  },
  render: function (subject, context) {
    const kb = context.session.store;
    const dom = context.dom;
    const div = dom.createElement('div');
    const video = div.appendChild(dom.createElement('video'));
    video.setAttribute('controls', 'yes');
    // get video with authenticated fetch
    kb.fetcher._fetch(subject.uri).then(function (response) {
      return response.blob();
    }).then(function (myBlob) {
      const objectURL = URL.createObjectURL(myBlob);
      video.setAttribute('src', objectURL); // w640 h480 //
    });
    video.setAttribute('width', '100%');
    return div;
  }
}; // ends
//# sourceMappingURL=videoPane.js.map