/**
 * Lazy-loaded sharing pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const sharingPane = {
  icon: UI.icons.iconBase + 'padlock-timbl.svg',
  name: 'sharing',

  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.ldp('Resource').uri]) return 'Sharing'
    if (types[ns.ldp('Container').uri]) return 'Sharing'
    if (types[ns.ldp('BasicContainer').uri]) return 'Sharing'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "sharing-pane" */ '../sharing/sharingPane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
