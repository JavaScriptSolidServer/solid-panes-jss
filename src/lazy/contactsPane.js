/**
 * Lazy-loaded contacts pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const contactsPane = {
  icon: UI.icons.iconBase + 'noun_99101.svg',
  name: 'contact',

  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card')
    const dominated2 = subject.uri.endsWith('/profile/card#me')
    if (dominated || dominated2) return null // Let profile pane handle

    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.vcard('AddressBook').uri]) return 'Address Book'
    if (types[ns.vcard('Group').uri]) return 'Group'
    if (types[ns.vcard('Individual').uri]) return 'Contact'
    if (types[ns.foaf('Person').uri]) return 'Person'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "contacts-pane" */ 'contacts-pane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  },

  mintNew: async function (context, options) {
    const mod = await import(/* webpackChunkName: "contacts-pane" */ 'contacts-pane')
    const realPane = mod.default || mod
    if (realPane.mintNew) {
      return realPane.mintNew(context, options)
    }
    return null
  },

  mintClass: ns.vcard('AddressBook')
}
