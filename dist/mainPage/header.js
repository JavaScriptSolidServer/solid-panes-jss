"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHeader = createHeader;
var _solidLogicJss = require("solid-logic-jss");
var _solidUiJss = require("solid-ui-jss");
/**
 * menu icons
*/
const HELP_MENU_ICON = _solidUiJss.icons.iconBase + 'noun_help.svg';
const SOLID_ICON_URL = 'https://solidproject.org/assets/img/solid-emblem.svg';

/**
 * menu elements
*/
const USER_GUIDE_MENU_ITEM = 'User guide';
const REPORT_A_PROBLEM_MENU_ITEM = 'Report a problem';
const SHOW_YOUR_PROFILE_MENU_ITEM = 'Show your profile';
const LOG_OUT_MENU_ITEM = 'Log out';
/**
 * URLS
 */
const USER_GUIDE_MENU_URL = 'https://solidos.github.io/userguide/';
const REPORT_A_PROBLEM_MENU_URL = 'https://github.com/solidos/solidos/issues';
async function createHeader(store, outliner) {
  (0, _solidUiJss.initHeader)(store, await setUserMenu(outliner), setHeaderOptions());
}
function setHeaderOptions() {
  const helpMenuList = [{
    label: USER_GUIDE_MENU_ITEM,
    url: USER_GUIDE_MENU_URL,
    target: '_blank'
  }, {
    label: REPORT_A_PROBLEM_MENU_ITEM,
    url: REPORT_A_PROBLEM_MENU_URL,
    target: '_blank'
  }];
  const headerOptions = {
    logo: SOLID_ICON_URL,
    helpIcon: HELP_MENU_ICON,
    helpMenuList
  };
  return headerOptions;
}
async function setUserMenu(outliner) {
  // @ts-ignore: showProfile is used conditionally
  const showProfile = {
    label: SHOW_YOUR_PROFILE_MENU_ITEM,
    onclick: () => openUserProfile(outliner)
  };
  const logOut = {
    label: LOG_OUT_MENU_ITEM,
    onclick: () => {
      _solidLogicJss.authSession.logout();
    }
  };

  // the order of the menu is important here, show profile first and logout last
  let userMenuList = []; // was [showProfile]
  userMenuList = userMenuList.concat(await getMenuItems(outliner));
  userMenuList.push(logOut);
  return userMenuList;
}

// Does not work to jump to user profile,
function openUserProfile(outliner) {
  outliner.GotoSubject(_solidLogicJss.authn.currentUser(), true, undefined, true, undefined);
  location.reload();
}
async function getMenuItems(outliner) {
  const items = await outliner.getDashboardItems();
  return items.map(element => {
    return {
      label: element.label,
      onclick: () => openDashboardPane(outliner, element.tabName || element.paneName)
    };
  });
}
async function openDashboardPane(outliner, pane) {
  outliner.showDashboard({
    pane
  });
}
//# sourceMappingURL=header.js.map