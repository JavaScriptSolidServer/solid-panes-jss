/**
 * Lazy-loaded home pane wrapper
 */
import * as UI from 'solid-ui-jss';
export const homePane = {
  icon: UI.icons.iconBase + 'noun_547570.svg',
  name: 'home',
  global: true,
  label: function (subject, context) {
    return 'home';
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "home-pane" */'../home/homePane');
    const realPane = mod.default || mod;
    return realPane.render(subject, context);
  }
};
//# sourceMappingURL=homePane.js.map