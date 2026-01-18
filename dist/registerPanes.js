"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPanes = registerPanes;
var _profilePane = _interopRequireDefault(require("profile-pane"));
var _trustedApplications = _interopRequireDefault(require("./trustedApplications/trustedApplications.view"));
var _dashboardPane = _interopRequireDefault(require("./dashboard/dashboardPane"));
var _basicPreferences = _interopRequireDefault(require("./dashboard/basicPreferences"));
var _issuePane = _interopRequireDefault(require("issue-pane"));
var _contactsPane = _interopRequireDefault(require("contacts-pane"));
var _activitystreamsPane = _interopRequireDefault(require("activitystreams-pane"));
var _padPane = _interopRequireDefault(require("./pad/padPane"));
var _pane = _interopRequireDefault(require("./transaction/pane.js"));
var _period = _interopRequireDefault(require("./transaction/period.js"));
var _meetingPane = _interopRequireDefault(require("meeting-pane"));
var _tabbedPane = _interopRequireDefault(require("./tabbed/tabbedPane"));
var _chatPane = require("chat-pane");
var _schedulePane = require("./schedule/schedulePane.js");
var _tripPane = _interopRequireDefault(require("./trip/tripPane.js"));
var _imagePane = require("./imagePane.js");
var _playlistPane = _interopRequireDefault(require("./playlist/playlistPane.js"));
var _videoPane = _interopRequireDefault(require("./video/videoPane.js"));
var _audioPane = _interopRequireDefault(require("./audio/audioPane.js"));
var _dokieliPane = _interopRequireDefault(require("./dokieli/dokieliPane.js"));
var _folderPane = _interopRequireDefault(require("folder-pane"));
var _classInstancePane = require("./classInstancePane.js");
var _slideshowPane = require("./slideshow/slideshowPane.js");
var _socialPane = require("./socialPane.js");
var _humanReadablePane = _interopRequireDefault(require("./humanReadablePane.js"));
var _dataContentPane = require("./dataContentPane.js");
var _sourcePane = _interopRequireDefault(require("source-pane"));
var _n3Pane = require("./n3Pane.js");
var _RDFXMLPane = require("./RDFXMLPane.js");
var _pane2 = require("./form/pane.js");
var _tableViewPane = require("./tableViewPane.js");
var _defaultPane = require("./defaultPane.js");
var _pane3 = _interopRequireDefault(require("./ui/pane.js"));
var _sharingPane = _interopRequireDefault(require("./sharing/sharingPane"));
var _internalPane = _interopRequireDefault(require("./internal/internalPane"));
var _homePane = _interopRequireDefault(require("./home/homePane"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import editProfileView from './profile/editProfile.view'

// import argumentPane from './argument/argumentPane.js'

// import publicationPane from './publication/publicationPane.js'

function registerPanes(register) {
  /*  Note that the earliest panes have priority. So the most specific ones are first.
   **
   */
  // Developer designed:

  register(_profilePane.default); // View someone's public profile - dominates all other panes.
  const editProfileView = _profilePane.default.editor;
  if (!editProfileView) {
    console.log('@@@ editProfileView', 'profilePane is not providing an editor pane');
  }
  register(editProfileView); // Edit my profile.

  register(_trustedApplications.default); // must be registered before basicPreferences
  register(_dashboardPane.default);
  register(_basicPreferences.default);
  register(_issuePane.default);
  register(_contactsPane.default);
  register(_activitystreamsPane.default);
  register(_padPane.default);
  // register(argumentPane) // A position in an argument tree

  register(_pane.default);
  register(_period.default);
  register(_meetingPane.default);
  register(_tabbedPane.default);
  register(_chatPane.longChatPane); // Long pane must have prio in case short pane tries to do a long pane
  register(_chatPane.shortChatPane); // was './chat/chatPane.js'

  // register(publicationPane)  // Suppress for now

  register(_schedulePane.schedulePane); // doodle poll

  register(_tripPane.default);
  // register(require('./airPane.js'))

  // Content views

  register(_imagePane.imagePane); // Basic image view
  register(_playlistPane.default); // Basic playlist view

  register(_videoPane.default); // Video clip player
  register(_audioPane.default); // Audio clip player

  register(_dokieliPane.default); // Should be above dataContentPane
  register(_folderPane.default); // Should be above dataContentPane
  register(_classInstancePane.classInstancePane); // Should be above dataContentPane
  // register(require('./dynamic/dynamicPanes.js')) // warp etc  warp broken 2017/8
  register(_slideshowPane.slideshowPane);
  register(_socialPane.socialPane);
  register(_humanReadablePane.default); // A web page as a web page -- how to escape to tabr?
  // register(require('markdown-pane').Pane) // replaced by markdown in humanReadablePane

  register(_dataContentPane.dataContentPane); // Preferred for a data file
  register(_sourcePane.default); // edit source
  register(_n3Pane.n3Pane);
  register(_RDFXMLPane.RDFXMLPane);

  // User configured - data driven
  register(_pane2.formPane);

  // Generic:

  register(_tableViewPane.tableViewPane);

  // Fallback totally generic:
  register(_defaultPane.defaultPane);
  register(_pane3.default);

  // register(require("categoryPane.js"))  // Not useful enough
  // register(require("pubsPane.js")) // not finished

  // @@ jambo commented these things out to pare things down temporarily.
  // Note must use // not /* to comment out to make sure expander sees it
  // register(require("lawPane.js"))

  // register(require('./microblogPane/microblogPane.js'))

  // register(require("./social/pane.js")) // competitor to other social
  // register(require("./airPane.js"))
  // register(require("./lawPane.js"))
  // register(require("pushbackPane.js"))
  // register(require("CVPane.js"))
  // register(require("photoPane.js"))
  // register(require("tagPane.js"))
  // register(require("photoImportPane.js"))

  // The sharing pane is fairly generic and administrative  201
  register(_sharingPane.default);

  // The internals pane is always (almost?) the last as it is the least user-friendly
  register(_internalPane.default);
  register(_homePane.default); // This is a global pane

  // ENDS
}
//# sourceMappingURL=registerPanes.js.map