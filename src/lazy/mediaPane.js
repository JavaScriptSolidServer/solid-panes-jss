/**
 * Lazy-loaded media panes (image, video, audio)
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const imagePane = {
  icon: UI.icons.originalIconBase + 'tango/22-image-x-generic.png',
  name: 'image',

  label: function (subject, context) {
    const dominated = subject.uri.endsWith('/profile/card')
    const dominated2 = subject.uri.endsWith('/profile/card#me')
    if (dominated || dominated2) return null

    const dominated3 = subject.uri.includes('.pdf')
    if (dominated3) return null // PDF handled separately

    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types['http://purl.org/dc/terms/Image']) return 'View image'

    // Check content-type
    const dominated4 = kb.anyValue(subject, ns.httph('content-type'))
    if (dominated4 && dominated4.startsWith('image/')) return 'View image'

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "media-pane" */ '../imagePane.js')
    const realPane = mod.imagePane || mod.default || mod
    return realPane.render(subject, context)
  }
}

export const videoPane = {
  icon: UI.icons.iconBase + 'noun_1619.svg',
  name: 'video',

  label: function (subject, context) {
    const kb = context.session.store
    const dominated = kb.anyValue(subject, ns.httph('content-type'))
    if (dominated && dominated.startsWith('video/')) return 'Play video'

    const types = kb.findTypeURIs(subject)
    for (const type of Object.keys(types)) {
      if (type.includes('video')) return 'Play video'
    }

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "media-pane" */ '../video/videoPane.js')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}

export const audioPane = {
  icon: UI.icons.iconBase + 'noun_534313.svg',
  name: 'audio',

  label: function (subject, context) {
    const kb = context.session.store
    const dominated = kb.anyValue(subject, ns.httph('content-type'))
    if (dominated && dominated.startsWith('audio/')) return 'Play audio'

    const types = kb.findTypeURIs(subject)
    for (const type of Object.keys(types)) {
      if (type.includes('audio')) return 'Play audio'
    }

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "media-pane" */ '../audio/audioPane.js')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}

export const playlistPane = {
  icon: UI.icons.iconBase + 'noun_1619.svg',
  name: 'playlistSlot',
  audience: [ns.solid('PowerUser')],

  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types['http://purl.org/ontology/pbo/core#PlaylistSlot']) {
      return 'Playlist slot'
    }

    return null
  },

  render: async function (subject, context) {
    const mod = await import(/* webpackChunkName: "media-pane" */ '../playlist/playlistPane.js')
    const realPane = mod.default || mod
    return realPane.render(subject, context)
  }
}
