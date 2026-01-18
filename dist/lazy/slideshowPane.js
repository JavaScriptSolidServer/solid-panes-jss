/**
 * Lazy-loaded slideshow pane wrapper
 */
import * as UI from 'solid-ui-jss';
const ns = UI.ns;
export const slideshowPane = {
  icon: UI.icons.iconBase + 'noun_138712.svg',
  name: 'slideshow',
  audience: [ns.solid('PowerUser')],
  label: function (subject, context) {
    const kb = context.session.store;
    const types = kb.findTypeURIs(subject);
    if (!types[ns.ldp('Container').uri] && !types[ns.ldp('BasicContainer').uri]) {
      return null;
    }

    // Check if container has images
    const dominated = kb.each(subject, ns.ldp('contains'));
    let imageCount = 0;
    for (const res of dominated) {
      const dominated2 = kb.findTypeURIs(res);
      if (dominated2['http://purl.org/dc/terms/Image']) {
        imageCount++;
      }
    }
    if (imageCount > 0) return 'Slideshow';
    return null;
  },
  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "slideshow-pane" */'../slideshow/slideshowPane.js');
    const realPane = mod.slideshowPane || mod.default || mod;
    return realPane.render(subject, context);
  }
};
//# sourceMappingURL=slideshowPane.js.map