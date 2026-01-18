/**
 * Lazy-loaded tabbed pane wrapper
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const tabbedPane = {
  icon: UI.icons.iconBase + 'noun_688606.svg',
  name: 'tabbed',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    const kb = context.session.store;
    const types = kb.findTypeURIs(subject);
    if (types[ns.meeting('Cluster').uri]) return 'Tabbed';
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "tabbed-pane" */'../tabbed/tabbedPane');
    const realPane = mod.default || mod;
    return realPane.render(subject, context);
  }
};
//# sourceMappingURL=tabbedPane.js.map