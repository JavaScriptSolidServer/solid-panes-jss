"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateRandomString = generateRandomString;
exports.getStatementsToAdd = getStatementsToAdd;
exports.getStatementsToDelete = getStatementsToDelete;
var _rdflib = require("rdflib");
function getStatementsToDelete(origin, person, kb, ns) {
  const applicationStatements = kb.statementsMatching(null, ns.acl('origin'), origin);
  const statementsToDelete = applicationStatements.reduce((memo, st) => {
    return memo.concat(kb.statementsMatching(person, ns.acl('trustedApp'), st.subject)).concat(kb.statementsMatching(st.subject));
  }, []);
  return statementsToDelete;
}
function getStatementsToAdd(origin, nodeName, modes, person, ns) {
  const application = new _rdflib.BlankNode(`bn_${nodeName}`); // NamedNode(`${person.doc().uri}#${nodeName}`)
  return [(0, _rdflib.st)(person, ns.acl('trustedApp'), application, person.doc()), (0, _rdflib.st)(application, ns.acl('origin'), origin, person.doc()), ...modes.map(mode => (0, _rdflib.sym)(mode)).map(mode => (0, _rdflib.st)(application, ns.acl('mode'), mode, person.doc()))];
}
function generateRandomString() {
  return Math.random().toString(36).substr(2, 5);
}
//# sourceMappingURL=trustedApplications.utils.js.map