/**
 * Lazy-loaded profile pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const profilePane = {
  icon: UI.icons.iconBase + 'noun_15059.svg',
  name: 'profile',

  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card')
    const dominated2 = subject.uri.endsWith('/profile/card#me')
    if (dominated || dominated2) return 'Profile'

    const kb = context.session.store
    const types = kb.findTypeURIs(subject)
    if (types[ns.foaf('Person').uri] || types[ns.vcard('Individual').uri]) {
      return 'Profile'
    }
    return null
  },

  render: async function (subject, context) {
    const profilePaneMod = await import(/* webpackChunkName: "profile-pane" */ 'profile-pane')
    const realPane = profilePaneMod.default || profilePaneMod
    return realPane.render(subject, context)
  }
}

export const editProfilePane = {
  icon: UI.icons.iconBase + 'noun_15059.svg',
  name: 'editProfile',

  label: function (subject, context) {
    // Editor pane - only shows when editing own profile
    return null // Controlled by profile pane
  },

  render: async function (subject, context) {
    const profilePaneMod = await import(/* webpackChunkName: "profile-pane" */ 'profile-pane')
    const realPane = profilePaneMod.default || profilePaneMod
    if (realPane.editor) {
      return realPane.editor.render(subject, context)
    }
    return null
  }
}
