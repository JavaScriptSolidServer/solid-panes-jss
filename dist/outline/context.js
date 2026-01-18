"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createContext = createContext;
var _index = require("../index");
function createContext(dom, paneRegistry, store, logic) {
  return {
    dom,
    getOutliner: _index.getOutliner,
    session: {
      paneRegistry,
      store,
      // Cast to any to bridge solid-logic-jss and solid-logic type differences
      logic: logic
    }
  };
}
//# sourceMappingURL=context.js.map