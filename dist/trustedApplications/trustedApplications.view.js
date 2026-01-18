"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _solidUiJss = require("solid-ui-jss");
var _solidLogicJss = require("solid-logic-jss");
var _trustedApplications = require("./trustedApplications.dom");
const thisColor = '#418d99';
const trustedApplicationView = {
  global: true,
  icon: `${_solidUiJss.icons.iconBase}noun_15177.svg`,
  name: 'trustedApplications',
  label: () => null,
  render: (subject, context) => {
    const dom = context.dom;
    const div = dom.createElement('div');
    div.classList.add('trusted-applications-pane');
    div.setAttribute('style', 'border: 0.3em solid ' + thisColor + '; border-radius: 0.5em; padding: 0.7em; margin-top:0.7em;');
    const table = div.appendChild(dom.createElement('table'));
    const main = table.appendChild(dom.createElement('tr'));
    const bottom = table.appendChild(dom.createElement('tr'));
    const statusArea = bottom.appendChild(dom.createElement('div'));
    statusArea.setAttribute('style', 'padding: 0.7em;');
    render(dom, main, statusArea).catch(err => statusArea.appendChild(_solidUiJss.widgets.errorMessageBlock(dom, err)));
    return div;
  }
};
async function render(dom, main, statusArea) {
  const authContext = await _solidUiJss.login.ensureLoadedProfile({
    dom,
    div: main,
    statusArea,
    me: null
  });
  const subject = authContext.me;
  const profile = subject.doc();
  if (!_solidLogicJss.store.updater) {
    throw new Error('Store has no updater');
  }
  const editable = _solidLogicJss.store.updater.editable(profile.uri, _solidLogicJss.store);
  main.appendChild((0, _trustedApplications.createText)('h3', 'Manage your trusted applications'));
  if (!editable) {
    main.appendChild(_solidUiJss.widgets.errorMessageBlock(dom, `Your profile ${subject.doc().uri} is not editable, so we cannot do much here.`));
    return;
  }
  main.appendChild((0, _trustedApplications.createText)('p', 'Here you can manage the applications you trust.'));
  const applicationsTable = (0, _trustedApplications.createApplicationTable)(subject);
  main.appendChild(applicationsTable);
  main.appendChild((0, _trustedApplications.createText)('h4', 'Notes'));
  main.appendChild((0, _trustedApplications.createContainer)('ol', [main.appendChild((0, _trustedApplications.createText)('li', 'Trusted applications will get access to all resources that you have access to.')), main.appendChild((0, _trustedApplications.createText)('li', 'You can limit which modes they have by default.')), main.appendChild((0, _trustedApplications.createText)('li', 'They will not gain more access than you have.'))]));
  main.appendChild((0, _trustedApplications.createText)('p', 'Application URLs must be valid URL. Examples are http://localhost:3000, https://trusted.app, and https://sub.trusted.app.'));
}
var _default = exports.default = trustedApplicationView;
//# sourceMappingURL=trustedApplications.view.js.map