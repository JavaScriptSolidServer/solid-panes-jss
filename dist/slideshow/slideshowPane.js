"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slideshowPane = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
var _betterSimpleSlideshow = _interopRequireDefault(require("@solid/better-simple-slideshow"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/*   slideshow Pane
 **
 */

const ns = UI.ns;
const slideshowPane = exports.slideshowPane = {
  icon: UI.icons.iconBase + 'noun_138712.svg',
  name: 'slideshow',
  audience: [ns.solid('PowerUser')],
  // Does the subject deserve an slideshow pane?
  label: function (subject, context) {
    const store = context.session.store;
    const ns = UI.ns;
    const t = store.findTypeURIs(subject);
    if (t[ns.ldp('Container').uri] || t[ns.ldp('BasicContainer').uri]) {
      const contents = store.each(subject, ns.ldp('contains'));
      let count = 0;
      contents.forEach(function (file) {
        if (UI.widgets.isImage(file)) count++;
      });
      return count > 0 ? 'Slideshow' : null;
    }
    return null;
  },
  // See https://github.com/leemark/better-simple-slideshow
  // and follow instructions there
  render: function (subject, context) {
    const dom = context.dom;
    const styleSheet = 'https://leemark.github.io/better-simple-slideshow/css/simple-slideshow-styles.css';
    UI.widgets.addStyleSheet(dom, styleSheet);
    const store = context.session.store;
    const ns = UI.ns;
    const div = dom.createElement('div');
    div.setAttribute('class', 'bss-slides');
    const t = store.findTypeURIs(subject);
    let predicate;
    if (t[ns.ldp('BasicContainer').uri] || t[ns.ldp('Container').uri]) {
      predicate = ns.ldp('contains');
    }
    const images = store.each(subject, predicate); // @@ random order?
    // @@ Ideally: sort by embedded time of image
    images.sort(); // Sort for now by URI
    for (let i = 0; i < images.length; i++) {
      if (!UI.widgets.isImage(images[i])) continue;
      const figure = div.appendChild(dom.createElement('figure'));
      const img = figure.appendChild(dom.createElement('img'));

      // get image with authenticated fetch
      store.fetcher._fetch(images[i].uri).then(function (response) {
        return response.blob();
      }).then(function (myBlob) {
        const objectURL = URL.createObjectURL(myBlob);
        img.setAttribute('src', objectURL); // w640 h480 //
      });
      img.setAttribute('width', '100%');
      figure.appendChild(dom.createElement('figcaption'));
    }
    const options = {
      dom
    };
    setTimeout(function () {
      (0, _betterSimpleSlideshow.default)('.bss-slides', options);
    }, 1000); // Must run after the code which called this

    return div;
  }
};

// ends
//# sourceMappingURL=slideshowPane.js.map