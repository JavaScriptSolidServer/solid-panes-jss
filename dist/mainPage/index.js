"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initMainPage;
var _index = require("../index");
var _header = require("./header");
var _footer = require("./footer");
/*   Main Page
 **
 **  This code is called in mashlib and renders the header and footer of the Databrowser.
 */

async function initMainPage(store, uri) {
  const outliner = (0, _index.getOutliner)(document);
  uri = uri || window.location.href;
  let subject = uri;
  if (typeof uri === 'string') subject = store.sym(uri);
  outliner.GotoSubject(subject, true, undefined, true, undefined);
  const header = await (0, _header.createHeader)(store, outliner);
  const footer = (0, _footer.createFooter)(store);
  return Promise.all([header, footer]);
}
//# sourceMappingURL=index.js.map