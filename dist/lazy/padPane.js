/**
 * Lazy-loaded pad (notepad) pane wrapper
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const padPane = {
  icon: UI.icons.iconBase + 'noun_79217.svg',
  name: 'pad',
  label: function (subject, context) {
    const kb = context.session.store;
    const types = kb.findTypeURIs(subject);
    if (types[ns.pad('Notepad').uri]) return 'Notepad';
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "pad-pane" */'../pad/padPane');
    const realPane = mod.default || mod;
    return realPane.render(subject, context);
  },
  mintNew: async function (context, options) {
    const mod = await import(/* webpackChunkName: "pad-pane" */'../pad/padPane');
    const realPane = mod.default || mod;
    if (realPane.mintNew) {
      return realPane.mintNew(context, options);
    }
    return null;
  },
  mintClass: ns.pad('Notepad')
};
//# sourceMappingURL=padPane.js.map