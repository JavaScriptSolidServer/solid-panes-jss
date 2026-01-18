/**
 * Lazy-loaded chat pane wrappers
 *
 * Only loads chat-pane (and its UI.messageArea/infiniteMessageArea deps)
 * when the pane is actually rendered. This allows chat to be code-split
 * into a separate chunk.
 */
import * as UI from 'solid-ui-jss'

const ns = UI.ns

/**
 * Long Chat Pane - lazy wrapper
 * Used for LongChat, Thread, and message types
 */
export const longChatPane = {
  icon: UI.icons.iconBase + 'noun_1689339.svg',
  name: 'long chat',

  // Label determines if pane is relevant - must be sync
  label: function (subject, context) {
    const kb = context.session.store
    if (kb.holds(subject, ns.rdf('type'), ns.meeting('LongChat'))) {
      return 'Chat channel'
    }
    if (kb.holds(subject, ns.rdf('type'), ns.sioc('Thread'))) {
      return 'Thread'
    }
    // Message detection
    if (kb.any(subject, ns.sioc('content')) && kb.any(subject, ns.dct('created'))) {
      return 'message'
    }
    return null
  },

  // Lazy render - loads chat-pane chunk only when needed
  render: async function (subject, context) {
    const { longChatPane: realPane } = await import(/* webpackChunkName: "chat-pane" */ 'chat-pane')
    return realPane.render(subject, context)
  },

  // Lazy mintNew
  mintNew: async function (context, newPaneOptions) {
    const { longChatPane: realPane } = await import(/* webpackChunkName: "chat-pane" */ 'chat-pane')
    return realPane.mintNew(context, newPaneOptions)
  },

  mintClass: ns.meeting('LongChat')
}

/**
 * Short Chat Pane - lazy wrapper
 * Used for wf:message based chats and meeting chats
 */
export const shortChatPane = {
  icon: UI.icons.iconBase + 'noun_346319.svg',
  name: 'chat',

  label: function (subject, context) {
    const kb = context.session.store
    const n = kb.each(subject, ns.wf('message')).length
    if (n > 0) return 'Chat (' + n + ')'

    if (kb.holds(subject, ns.rdf('type'), ns.meeting('Chat'))) {
      return 'Meeting chat'
    }
    if (kb.holds(undefined, ns.rdf('type'), ns.foaf('ChatChannel'), subject)) {
      return 'IRC log'
    }
    return null
  },

  render: async function (subject, context) {
    const { shortChatPane: realPane } = await import(/* webpackChunkName: "chat-pane" */ 'chat-pane')
    return realPane.render(subject, context)
  },

  mintNew: async function (context, newPaneOptions) {
    const { shortChatPane: realPane } = await import(/* webpackChunkName: "chat-pane" */ 'chat-pane')
    return realPane.mintNew(context, newPaneOptions)
  },

  mintClass: ns.meeting('Chat')
}
