/**
 * Bookmark Pane - Lazy Wrapper
 *
 * This lightweight wrapper is always loaded. It contains only:
 * - Icon and name
 * - label() function for type checking
 * - Async render() that loads the full implementation on demand
 *
 * The actual rendering code is in render.js and only loads
 * when someone views a bookmark.
 */

// Import only what's needed for label() checks
import * as UI from 'solid-ui-jss'

const ns = UI.ns

// Define schema namespace for bookmarks
const schema = UI.rdf.Namespace('http://schema.org/')

export const bookmarkPane = {
  // Unique identifier for this pane
  name: 'bookmark',

  // Icon shown in pane selector
  icon: UI.icons.iconBase + 'noun_97839.svg', // bookmark icon

  // Optional: restrict to power users
  // audience: [ns.solid('PowerUser')],

  /**
   * Label function - determines if this pane is relevant
   *
   * MUST be synchronous and lightweight!
   * Called for every subject the user views.
   *
   * @param {NamedNode} subject - The RDF resource being viewed
   * @param {Object} context - Contains session, dom, etc.
   * @returns {string|null} - Tooltip string if relevant, null if not
   */
  label: function (subject, context) {
    const kb = context.session.store

    // Check if subject is a Bookmark
    const types = kb.findTypeURIs(subject)
    if (types[schema('Bookmark').uri]) {
      return 'Bookmark'
    }

    // Check if subject is a container with bookmarks
    if (types[ns.ldp('Container').uri] || types[ns.ldp('BasicContainer').uri]) {
      const contents = kb.each(subject, ns.ldp('contains'))
      const hasBookmarks = contents.some(item => {
        const itemTypes = kb.findTypeURIs(item)
        return itemTypes[schema('Bookmark').uri]
      })
      if (hasBookmarks) {
        return 'Bookmarks'
      }
    }

    return null
  },

  /**
   * Render function - creates the UI
   *
   * Can be async! The outline manager handles Promise returns.
   * Use dynamic import() to load the full implementation.
   *
   * @param {NamedNode} subject - The RDF resource to render
   * @param {Object} context - Contains session, dom, etc.
   * @param {Object} options - Additional render options
   * @returns {Promise<HTMLElement>} - The rendered pane
   */
  render: async function (subject, context, options) {
    // Dynamic import - webpack creates a separate chunk
    const { render } = await import(
      /* webpackChunkName: "bookmark-pane" */
      './render.js'
    )
    return render(subject, context, options)
  },

  /**
   * MintNew - creates a new bookmark
   *
   * Called when user wants to create a new instance of this type.
   *
   * @param {Object} context - Contains session, dom, etc.
   * @param {Object} options - Contains newBase (suggested URI base)
   * @returns {Promise<NamedNode>} - The newly created resource
   */
  mintNew: async function (context, options) {
    const { mintNew } = await import(
      /* webpackChunkName: "bookmark-pane" */
      './render.js'
    )
    return mintNew(context, options)
  },

  // RDF class this pane can create
  mintClass: schema('Bookmark')
}

// Also export as default for standalone use
export default bookmarkPane
