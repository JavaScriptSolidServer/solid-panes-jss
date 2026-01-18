/**
 * Lazy-loaded dokieli pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const dokieliPane = {
  icon: UI.icons.iconBase + 'dokieli-logo.png',
  name: 'Dokieli',

  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.link('WebPage').uri]) return 'view'

    // Check content-type
    const contentType = kb.anyValue(subject, ns.httph('content-type'))
    if (contentType) {
      if (contentType.includes('text/html') || contentType.includes('application/xhtml+xml')) {
        return 'Dok'
      }
    }

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "dokieli-pane" */ '../dokieli/dokieliPane.js')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  },

  mintClass: ns.solid('DokieliDocument')
}
