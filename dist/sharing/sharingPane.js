"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _solidUiJss = require("solid-ui-jss");
/*   Sharing Pane
 **
 ** This outline pane allows a user to view and adjust the sharing -- access control lists
 ** for anything which has that capability.
 **
 ** I am using in places single quotes strings like 'this'
 ** where internationalization ("i18n") is not a problem, and double quoted
 ** like "this" where the string is seen by the user and so I18n is an issue.
 */

const sharingPane = {
  icon: _solidUiJss.icons.iconBase + 'padlock-timbl.svg',
  name: 'sharing',
  label: (subject, context) => {
    const store = context.session.store;
    const t = store.findTypeURIs(subject);
    if (t[_solidUiJss.ns.ldp('Resource').uri]) return 'Sharing'; // @@ be more sophisticated?
    if (t[_solidUiJss.ns.ldp('Container').uri]) return 'Sharing'; // @@ be more sophisticated?
    if (t[_solidUiJss.ns.ldp('BasicContainer').uri]) return 'Sharing'; // @@ be more sophisticated?
    // check being allowed to see/change sharing?
    return null; // No under other circumstances
  },
  render: (subject, context) => {
    const dom = context.dom;
    const store = context.session.store;
    const noun = getNoun();
    const div = dom.createElement('div');
    div.classList.add('sharingPane');
    _solidUiJss.aclControl.preventBrowserDropEvents(dom);
    div.appendChild(_solidUiJss.aclControl.ACLControlBox5(subject, context, noun, store));
    return div;
    function getNoun() {
      const t = store.findTypeURIs(subject);
      if (t[_solidUiJss.ns.ldp('BasicContainer').uri] || t[_solidUiJss.ns.ldp('Container').uri]) {
        return 'folder';
      }
      return 'file';
    }
  }
};
var _default = exports.default = sharingPane;
//# sourceMappingURL=sharingPane.js.map