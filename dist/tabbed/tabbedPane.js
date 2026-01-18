"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _solidUiJss = require("solid-ui-jss");
/*   Tabbed view of anything
 **
 ** data-driven
 **
 */

const TabbedPane = {
  icon: _solidUiJss.icons.iconBase + 'noun_688606.svg',
  name: 'tabbed',
  audience: [_solidUiJss.ns.solid('PowerUser')],
  // Does the subject deserve this pane?
  label: (subject, context) => {
    const kb = context.session.store;
    const typeURIs = kb.findTypeURIs(subject);
    if (_solidUiJss.ns.meeting('Cluster').uri in typeURIs) {
      return 'Tabbed';
    }
    return null;
  },
  render: (subject, context) => {
    const dom = context.dom;
    const store = context.session.store;
    const div = dom.createElement('div');
    (async () => {
      if (!store.fetcher) {
        throw new Error('Store has no fetcher');
      }
      await store.fetcher.load(subject);
      div.appendChild(_solidUiJss.tabs.tabWidget({
        dom,
        subject,
        predicate: store.any(subject, _solidUiJss.ns.meeting('predicate')) || _solidUiJss.ns.meeting('toolList'),
        ordered: true,
        orientation: store.anyValue(subject, _solidUiJss.ns.meeting('orientation')) || '0',
        renderMain: (containerDiv, item) => {
          containerDiv.innerHTML = '';
          const table = containerDiv.appendChild(context.dom.createElement('table'));
          context.getOutliner(context.dom).GotoSubject(item, true, null, false, undefined, table);
        },
        renderTab: (containerDiv, item) => {
          const predicate = store.the(subject, _solidUiJss.ns.meeting('predicate'));
          containerDiv.appendChild(_solidUiJss.widgets.personTR(context.dom, predicate, item, {}));
        },
        backgroundColor: store.anyValue(subject, _solidUiJss.ns.ui('backgroundColor')) || '#ddddcc'
      }));
    })();
    return div;
  }
};
var _default = exports.default = TabbedPane;
//# sourceMappingURL=tabbedPane.js.map