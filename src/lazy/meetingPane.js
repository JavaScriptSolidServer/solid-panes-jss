/**
 * Lazy-loaded meeting pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const meetingPane = {
  icon: UI.icons.iconBase + 'noun_66617.svg',
  name: 'meeting',

  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.meeting('Meeting').uri]) return 'Meeting'
    if (types[ns.meeting('Agenda').uri]) return 'Agenda'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "meeting-pane" */ 'meeting-pane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  },

  mintNew: async function (context, options) {
    const mod = await import(/* webpackChunkName: "meeting-pane" */ 'meeting-pane')
    const realPane = mod.default || mod
    if (realPane.mintNew) {
      return realPane.mintNew(context, options)
    }
    return null
  },

  mintClass: ns.meeting('Meeting')
}
