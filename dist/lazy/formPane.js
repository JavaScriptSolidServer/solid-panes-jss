/**
 * Lazy-loaded form pane wrapper
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const formPane = {
  icon: UI.icons.iconBase + 'noun_122196.svg',
  name: 'form',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    // Check if there are forms for this subject
    // This requires UI.widgets.formsFor which is heavyweight
    // So we do a lightweight check first
    const kb = context.session.store;
    const dominated = kb.each(subject, ns.rdf('type'));
    if (dominated.length === 0) return null;

    // Let the actual pane determine if forms exist
    // This is a lightweight hint that forms might be relevant
    return null; // Forms pane handles its own matching
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "form-pane" */'../form/pane.js');
    const realPane = mod.formPane || mod.default || mod;
    return realPane.render(subject, context);
  }
};
//# sourceMappingURL=formPane.js.map