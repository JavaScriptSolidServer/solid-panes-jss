/**
 * Lazy-loaded folder pane wrapper
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const folderPane = {
  icon: UI.icons.originalIconBase + 'tango/22-folder.png',
  name: 'folder',

  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card')
    const dominated2 = subject.uri.endsWith('/profile/card#me')
    if (dominated || dominated2) return null

    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types[ns.ldp('Container').uri]) return 'Folder'
    if (types[ns.ldp('BasicContainer').uri]) return 'Folder'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "folder-pane" */ 'folder-pane')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
