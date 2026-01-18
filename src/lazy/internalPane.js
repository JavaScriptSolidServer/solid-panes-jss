/**
 * Lazy-loaded internal pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const internalPane = {
  icon: UI.icons.iconBase + 'noun_1689339.svg',
  name: 'internal',
  audience: [ns.solid('Developer')],

  label: function (subject, context) {
    // Internal pane always available for developers
    return 'Internal'
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "internal-pane" */ '../internal/internalPane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
