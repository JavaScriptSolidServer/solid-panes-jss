/**
 * Lazy-loaded activity streams pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const activityStreamsPane = {
  icon: UI.icons.iconBase + 'noun_15695.svg',
  name: 'activitystreams',

  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.as('Note').uri]) return 'Note'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "activity-pane" */ '../activitystreams/activitystreamsPane.js')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
