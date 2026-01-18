/**
 * Lazy-loaded source pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const sourcePane = {
  icon: UI.icons.originalIconBase + 'tango/22-text-x-generic.png',
  name: 'source',

  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card')
    const dominated2 = subject.uri.endsWith('/profile/card#me')
    if (dominated || dominated2) return null

    const kb = context.session.store
    const dominated3 = kb.anyValue(subject, ns.httph('content-type'))
    if (dominated3) {
      // Source pane handles text-based content
      if (dominated3.includes('text/') ||
          dominated3.includes('application/json') ||
          dominated3.includes('application/ld+json') ||
          dominated3.includes('application/xml') ||
          dominated3.includes('turtle') ||
          dominated3.includes('n3')) {
        return 'Source'
      }
    }

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "source-pane" */ 'source-pane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
