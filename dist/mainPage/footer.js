"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFooter = createFooter;
var _solidUiJss = require("solid-ui-jss");
/**
 * links in the footer
*/
const SOLID_PROJECT_URL = 'https://solidproject.org';
const SOLID_PROJECT_NAME = 'solidproject.org';
function createFooter(store) {
  (0, _solidUiJss.initFooter)(store, setFooterOptions());
}
function setFooterOptions() {
  return {
    solidProjectUrl: SOLID_PROJECT_URL,
    solidProjectName: SOLID_PROJECT_NAME
  };
}
//# sourceMappingURL=footer.js.map