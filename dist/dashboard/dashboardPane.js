"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.dashboardPane = void 0;
var _solidUiJss = require("solid-ui-jss");
var _solidLogicJss = require("solid-logic-jss");
var _homepage = require("./homepage");
const dashboardPane = exports.dashboardPane = {
  icon: _solidUiJss.icons.iconBase + 'noun_547570.svg',
  name: 'dashboard',
  label: subject => {
    console.log();
    if (subject.uri === subject.site().uri) {
      return 'Dashboard';
    }
    return null;
  },
  render: (subject, context) => {
    console.log('Dashboard Pane Render');
    const dom = context.dom;
    const container = dom.createElement('div');
    const runBuildPage = () => {
      container.innerHTML = '';
      buildPage(container, _solidLogicJss.authn.currentUser() || null, context, subject);
    };
    _solidLogicJss.authSession.events.on('login', () => {
      // console.log('On Login')
      runBuildPage();
    });
    _solidLogicJss.authSession.events.on('sessionRestore', () => {
      // console.log('On Session Restore')
      runBuildPage();
    });
    // console.log('Initial Load')
    runBuildPage();
    return container;
  }
};
function buildPage(container, webId, context, subject) {
  // if uri then SolidOS is a browse.html web app
  const uri = new URL(window.location.href).searchParams.get('uri');
  if (webId && (uri || webId.site().uri === subject.site().uri)) {
    return buildDashboard(container, context);
  }
  return buildHomePage(container, subject);
}
function buildDashboard(container, context) {
  // console.log('build dashboard')
  // @@ TODO get a proper type
  const outliner = context.getOutliner(context.dom);
  outliner.getDashboard().then(dashboard => container.appendChild(dashboard));
}
function buildHomePage(container, subject) {
  // console.log('build home page')
  const wrapper = document.createElement('div');
  container.appendChild(wrapper);
  const shadow = wrapper.attachShadow({
    mode: 'open'
  });
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/common/css/bootstrap.min.css';
  shadow.appendChild(link);
  (0, _homepage.generateHomepage)(subject, _solidLogicJss.store, _solidLogicJss.store.fetcher).then(homepage => shadow.appendChild(homepage));
}
var _default = exports.default = dashboardPane;
//# sourceMappingURL=dashboardPane.js.map