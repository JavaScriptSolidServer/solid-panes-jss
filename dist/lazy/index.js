/**
 * Lazy-loaded pane wrappers
 *
 * All panes are loaded on-demand when first rendered.
 * Only the lightweight label() functions are loaded upfront.
 */

// Chat pane (already existed)
export { longChatPane, shortChatPane } from './chatPane.js';

// Profile & contacts
export { profilePane, editProfilePane } from './profilePane.js';
export { contactsPane } from './contactsPane.js';

// Issues & meetings
export { issuePane } from './issuePane.js';
export { meetingPane } from './meetingPane.js';

// Content panes
export { folderPane } from './folderPane.js';
export { padPane } from './padPane.js';
export { sourcePane } from './sourcePane.js';

// Media panes
export { imagePane, videoPane, audioPane, playlistPane } from './mediaPane.js';

// Financial panes
export { transactionPane, financialPeriodPane, tripPane } from './transactionPane.js';

// Scheduling
export { schedulePane } from './schedulePane.js';

// Content views
export { slideshowPane } from './slideshowPane.js';
export { dokieliPane } from './dokieliPane.js';
export { socialPane } from './socialPane.js';

// Dashboard & preferences
export { dashboardPane, basicPreferencesPane, trustedApplicationsPane } from './dashboardPane.js';

// Activity & forms
export { activityStreamsPane } from './activityPane.js';
export { formPane } from './formPane.js';
export { tabbedPane } from './tabbedPane.js';

// Sharing & internals
export { sharingPane } from './sharingPane.js';
export { internalPane } from './internalPane.js';

// Global panes
export { homePane } from './homePane.js';
//# sourceMappingURL=index.js.map