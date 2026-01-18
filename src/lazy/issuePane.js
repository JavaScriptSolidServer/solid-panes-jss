/**
 * Lazy-loaded issue pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const issuePane = {
  icon: UI.icons.iconBase + 'noun_97839.svg',
  name: 'issue',

  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.wf('Tracker').uri]) return 'Issue Tracker'
    if (types[ns.wf('Issue').uri]) return 'Issue'
    if (types[ns.wf('Task').uri]) return 'Task'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "issue-pane" */ 'issue-pane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  },

  mintNew: async function (context, options) {
    const mod = await import(/* webpackChunkName: "issue-pane" */ 'issue-pane')
    const realPane = mod.default || mod
    if (realPane.mintNew) {
      return realPane.mintNew(context, options)
    }
    return null
  },

  mintClass: ns.wf('Tracker')
}
