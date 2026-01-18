"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imagePane = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/*   Image Pane
 **
 **  This outline pane contains the document contents for an Image document
 */

const imagePane = exports.imagePane = {
  icon: UI.icons.originalIconBase + 'tango/22-image-x-generic.png',
  name: 'image',
  label: function (subject, context) {
    const store = context.session.store;
    if (!store.anyStatementMatching(subject, UI.ns.rdf('type'), store.sym('http://purl.org/dc/terms/Image'))) {
      // NB: Not dc: namespace!
      return null;
    }

    //   See also the source pane, which has lower precedence.

    const contentTypeMatch = function (store, x, contentTypes) {
      const cts = store.fetcher.getHeader(x, 'content-type');
      if (cts) {
        for (let j = 0; j < cts.length; j++) {
          for (let k = 0; k < contentTypes.length; k++) {
            if (cts[j].indexOf(contentTypes[k]) >= 0) {
              return true;
            }
          }
        }
      }
      return false;
    };
    const suppressed = ['application/pdf'];
    if (contentTypeMatch(store, subject, suppressed)) {
      return null;
    }
    return 'view';
  },
  render: function (subject, context) {
    const myDocument = context.dom;
    const store = context.session.store;
    const div = myDocument.createElement('div');
    div.setAttribute('class', 'imageView');
    const img = myDocument.createElement('IMG');

    // get image with authenticated fetch
    store.fetcher._fetch(subject.uri).then(function (response) {
      return response.blob();
    }).then(function (myBlob) {
      const objectURL = URL.createObjectURL(myBlob);
      img.setAttribute('src', objectURL); // w640 h480 //
    });
    img.setAttribute('style', 'max-width: 100%; max-height: 100%;');
    //        div.style['max-width'] = '640'
    //        div.style['max-height'] = '480'
    const tr = myDocument.createElement('TR'); // why need tr?
    tr.appendChild(img);
    div.appendChild(tr);
    return div;
  }
};

// ends
//# sourceMappingURL=imagePane.js.map