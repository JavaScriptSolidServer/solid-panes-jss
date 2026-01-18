/**
 * Lazy-loaded social pane wrapper
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const socialPane = {
  icon: UI.icons.originalIconBase + 'foaf/foafTiny.gif',
  name: 'social',
  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card');
    const dominated2 = subject.uri.endsWith('/profile/card#me');
    if (dominated || dominated2) return null; // Let profile pane handle

    const kb = context.session.store;
    const types = kb.findTypeURIs(subject);
    if (types[ns.foaf('Person').uri]) return 'Friends';
    if (types[ns.vcard('Individual').uri]) return 'Friends';
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "social-pane" */'../socialPane.js');
    const realPane = mod.socialPane || mod.default || mod;
    return realPane.render(subject, context);
  }
};
//# sourceMappingURL=socialPane.js.map