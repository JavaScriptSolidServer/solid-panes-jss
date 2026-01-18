/**
 * Register all panes with the pane registry
 *
 * Panes are lazy-loaded - only the lightweight label() functions run upfront.
 * The actual pane code is loaded on-demand when render() is called.
 */

// Lazy-loaded pane wrappers
import {
  // Chat
  longChatPane,
  shortChatPane,
  // Profile & contacts
  profilePane,
  editProfilePane,
  contactsPane,
  // Issues & meetings
  issuePane,
  meetingPane,
  // Content panes
  folderPane,
  padPane,
  sourcePane,
  // Media panes
  imagePane,
  videoPane,
  audioPane,
  playlistPane,
  // Financial panes
  transactionPane,
  financialPeriodPane,
  tripPane,
  // Scheduling
  schedulePane,
  // Content views
  slideshowPane,
  dokieliPane,
  socialPane,
  // Dashboard & preferences
  dashboardPane,
  basicPreferencesPane,
  trustedApplicationsPane,
  // Activity & forms
  activityStreamsPane,
  formPane,
  tabbedPane,
  // Sharing & internals
  sharingPane,
  internalPane,
  // Global panes
  homePane,
  // Example panes
  bookmarkPane
} from './lazy/index.js'

// Core panes that are always loaded (small, essential)
import { classInstancePane } from './classInstancePane.js'
import { dataContentPane } from './dataContentPane.js'
import { n3Pane } from './n3Pane.js'
import { RDFXMLPane } from './RDFXMLPane.js'
import { tableViewPane } from './tableViewPane.js'
import { defaultPane } from './defaultPane.js'
import humanReadablePane from './humanReadablePane.js'
import uiPane from './ui/pane.js'

export function registerPanes (register) {
  /*  Note that the earliest panes have priority. So the most specific ones are first.
   **
   */

  // === LAZY-LOADED PANES ===

  // Profile panes - high priority for person URIs
  register(profilePane)
  register(editProfilePane)

  // Preferences - must be before basicPreferences
  register(trustedApplicationsPane)
  register(dashboardPane)
  register(basicPreferencesPane)

  // Issue tracking
  register(issuePane)

  // Contacts
  register(contactsPane)

  // Activity streams
  register(activityStreamsPane)

  // Notepad
  register(padPane)

  // Financial
  register(transactionPane)
  register(financialPeriodPane)

  // Meetings
  register(meetingPane)
  register(tabbedPane)

  // Chat - lazy-loaded
  register(longChatPane)
  register(shortChatPane)

  // Scheduling
  register(schedulePane)

  // Trip expenses
  register(tripPane)

  // Media panes
  register(imagePane)
  register(playlistPane)
  register(videoPane)
  register(audioPane)

  // Document panes
  register(dokieliPane)
  register(folderPane)
  register(classInstancePane) // Core - not lazy
  register(slideshowPane)

  // Example panes - must be before dataContentPane
  register(bookmarkPane)

  // Social
  register(socialPane)

  // Human readable (web pages)
  register(humanReadablePane) // Core - not lazy

  // === CORE PANES (always loaded) ===

  // Data content pane - essential for RDF browsing
  register(dataContentPane)

  // Source viewing - lazy
  register(sourcePane)

  // RDF format panes - core
  register(n3Pane)
  register(RDFXMLPane)

  // Forms - lazy
  register(formPane)

  // Table view - core
  register(tableViewPane)

  // Default fallback - core, always needed
  register(defaultPane)

  // UI pane - core
  register(uiPane)

  // Sharing - lazy
  register(sharingPane)

  // Internal/developer - lazy
  register(internalPane)

  // Home - global, lazy
  register(homePane)
}
