"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _solidLogicJss = require("solid-logic-jss");
var _solidUiJss = require("solid-ui-jss");
/*   Home Pane
 **
 ** The home pane is avaiable everywhere and allows a user
 ** to
 **  - keep track of their stuff
 **  - make new things, and possibly
 **  - keep track of accounts and workspaces etc
 **
 */

const HomePaneSource = {
  icon: _solidUiJss.icons.iconBase + 'noun_547570.svg',
  // noun_25830

  global: true,
  name: 'home',
  // Does the subject deserve an home pane?
  //
  //   yes, always!
  //
  label: function () {
    return 'home';
  },
  render: function (subject, context) {
    const dom = context.dom;
    const showContent = async function () {
      const homePaneContext = {
        div,
        dom,
        statusArea: div,
        me
      };
      /*
            div.appendChild(dom.createElement('h4')).textContent = 'Login status'
            var loginStatusDiv = div.appendChild(context.dom.createElement('div'))
            // TODO: Find out what the actual type is:
            type UriType = unknown;
            loginStatusDiv.appendChild(UI.login.loginStatusBox(context.dom, () => {
              // Here we know new log in status
            }))
      */
      div.appendChild(dom.createElement('h4')).textContent = 'Create new thing somewhere';
      const creationDiv = div.appendChild(dom.createElement('div'));
      const creationContext = {
        div: creationDiv,
        dom,
        statusArea: div,
        me
      };
      const relevantPanes = await _solidUiJss.login.filterAvailablePanes(context.session.paneRegistry.list);
      _solidUiJss.create.newThingUI(creationContext, context, relevantPanes); // newUI Have to pass panes down

      _solidUiJss.login.registrationList(homePaneContext, {}).then(function () {});
    };
    const div = dom.createElement('div');
    const me = _solidLogicJss.authn.currentUser(); // this will be incorrect if not logged in

    showContent();
    return div;
  }
}; // pane object

// ends
var _default = exports.default = HomePaneSource;
//# sourceMappingURL=homePane.js.map