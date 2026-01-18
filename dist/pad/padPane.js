"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _solidUiJss = require("solid-ui-jss");
var _solidLogicJss = require("solid-logic-jss");
var _rdflib = require("rdflib");
/*   pad Pane
 **
 */

const paneDef = {
  // icon:  (module.__dirname || __dirname) + 'images/ColourOn.png',
  icon: _solidUiJss.icons.iconBase + 'noun_79217.svg',
  name: 'pad',
  audience: [_solidUiJss.ns.solid('PowerUser')],
  // Does the subject deserve an pad pane?
  label: function (subject, context) {
    const t = context.session.store.findTypeURIs(subject);
    if (t['http://www.w3.org/ns/pim/pad#Notepad']) {
      return 'pad';
    }
    return null; // No under other circumstances
  },
  mintClass: _solidUiJss.ns.pad('Notepad'),
  mintNew: function (context, newPaneOptions) {
    const store = context.session.store;
    const updater = store.updater;
    if (newPaneOptions.me && !newPaneOptions.me.uri) {
      throw new Error('notepad mintNew:  Invalid userid');
    }
    const newInstance = newPaneOptions.newInstance = newPaneOptions.newInstance || store.sym(newPaneOptions.newBase + 'index.ttl#this');
    // const newInstance = kb.sym(newBase + 'pad.ttl#thisPad');
    const newPadDoc = newInstance.doc();
    store.add(newInstance, _solidUiJss.ns.rdf('type'), _solidUiJss.ns.pad('Notepad'), newPadDoc);
    store.add(newInstance, _solidUiJss.ns.dc('title'), 'Shared Notes', newPadDoc);
    store.add(newInstance, _solidUiJss.ns.dc('created'), new Date(), newPadDoc); // @@ TODO Remove casting
    if (newPaneOptions.me) {
      store.add(newInstance, _solidUiJss.ns.dc('author'), newPaneOptions.me, newPadDoc);
    }
    // kb.add(newInstance, ns.pad('next'), newInstance, newPadDoc);
    // linked list empty @@
    const chunk = store.sym(newInstance.uri + '_line0');
    store.add(newInstance, _solidUiJss.ns.pad('next'), chunk, newPadDoc); // Linked list has one entry
    store.add(chunk, _solidUiJss.ns.pad('next'), newInstance, newPadDoc);
    store.add(chunk, _solidUiJss.ns.dc('author'), newPaneOptions.me, newPadDoc);
    store.add(chunk, _solidUiJss.ns.sioc('content'), '', newPadDoc);
    return new Promise(function (resolve, reject) {
      if (!updater) {
        reject(new Error('Have no updater'));
        return;
      }
      updater.put(newPadDoc, store.statementsMatching(undefined, undefined, undefined, newPadDoc), 'text/turtle', function (uri2, ok, message) {
        if (ok) {
          resolve(newPaneOptions);
        } else {
          reject(new Error('FAILED to save new tool at: ' + uri2 + ' : ' + message));
        }
      });
    });
  },
  // and follow instructions there
  // @@ TODO Set better type for paneOptions
  render: function (subject, context, paneOptions) {
    const dom = context.dom;
    const store = context.session.store;
    // Utility functions
    const complainIfBad = function (ok, message) {
      if (!ok) {
        div.appendChild(_solidUiJss.widgets.errorMessageBlock(dom, message, 'pink'));
      }
    };
    const clearElement = function (ele) {
      while (ele.firstChild) {
        ele.removeChild(ele.firstChild);
      }
      return ele;
    };

    // Access control

    // Two constiations of ACL for this app, public read and public read/write
    // In all cases owner has read write control
    const genACLtext = function (docURI, aclURI, allWrite) {
      const g = (0, _rdflib.graph)();
      const auth = (0, _rdflib.Namespace)('http://www.w3.org/ns/auth/acl#');
      let a = g.sym(aclURI + '#a1');
      const acl = g.sym(aclURI);
      const doc = g.sym(docURI);
      g.add(a, _solidUiJss.ns.rdf('type'), auth('Authorization'), acl);
      g.add(a, auth('accessTo'), doc, acl);
      g.add(a, auth('agent'), me, acl);
      g.add(a, auth('mode'), auth('Read'), acl);
      g.add(a, auth('mode'), auth('Write'), acl);
      g.add(a, auth('mode'), auth('Control'), acl);
      a = g.sym(aclURI + '#a2');
      g.add(a, _solidUiJss.ns.rdf('type'), auth('Authorization'), acl);
      g.add(a, auth('accessTo'), doc, acl);
      g.add(a, auth('agentClass'), _solidUiJss.ns.foaf('Agent'), acl);
      g.add(a, auth('mode'), auth('Read'), acl);
      if (allWrite) {
        g.add(a, auth('mode'), auth('Write'), acl);
      }
      // TODO: Figure out why `serialize` isn't on the type definition according to TypeScript:
      return (0, _rdflib.serialize)(acl, g, aclURI, 'text/turtle');
    };

    /**
     * @param docURI
     * @param allWrite
     * @param callbackFunction
     *
     * @returns {Promise<Response>}
     */
    const setACL = function setACL(docURI, allWrite, callbackFunction) {
      const aclDoc = store.any((0, _rdflib.sym)(docURI), (0, _rdflib.sym)('http://www.iana.org/assignments/link-relations/acl')); // @@ check that this get set by web.js
      if (!fetcher) {
        throw new Error('Have no fetcher');
      }
      if (aclDoc) {
        // Great we already know where it is
        const aclText = genACLtext(docURI, aclDoc.uri, allWrite);
        return fetcher.webOperation('PUT', aclDoc.uri, {
          data: aclText,
          contentType: 'text/turtle'
        }).then(() => callbackFunction(true)).catch(err => {
          callbackFunction(false, err.message);
        });
      } else {
        return fetcher.load(docURI).catch(err => {
          callbackFunction(false, 'Getting headers for ACL: ' + err);
        }).then(() => {
          const aclDoc = store.any((0, _rdflib.sym)(docURI), (0, _rdflib.sym)('http://www.iana.org/assignments/link-relations/acl'));
          if (!aclDoc) {
            // complainIfBad(false, "No Link rel=ACL header for " + docURI);
            throw new Error('No Link rel=ACL header for ' + docURI);
          }
          const aclText = genACLtext(docURI, aclDoc.uri, allWrite);
          return fetcher.webOperation('PUT', aclDoc.uri, {
            data: aclText,
            contentType: 'text/turtle'
          });
        }).then(() => callbackFunction(true)).catch(err => {
          callbackFunction(false, err.message);
        });
      }
    };

    //  Reproduction: spawn a new instance
    //
    // Viral growth path: user of app decides to make another instance
    const newInstanceButton = function () {
      const button = div.appendChild(dom.createElement('button'));
      button.textContent = 'Start another pad';
      button.addEventListener('click', function () {
        return showBootstrap(subject, spawnArea, 'pad');
      });
      return button;
    };

    // Option of either using the workspace system or just typing in a URI
    const showBootstrap = function showBootstrap(thisInstance, container, noun) {
      const div = clearElement(container);
      const appDetails = {
        noun: 'notepad'
      };
      div.appendChild(_solidUiJss.login.newAppInstance(dom, appDetails, (workspace, newBase) => {
        // FIXME: not sure if this will work at all, just
        // trying to get the types to match - Michiel.
        return initializeNewInstanceInWorkspace(new _rdflib.NamedNode(workspace || newBase));
      }));
      div.appendChild(dom.createElement('hr')); // @@

      const p = div.appendChild(dom.createElement('p'));
      p.textContent = 'Where would you like to store the data for the ' + noun + '?  ' + 'Give the URL of the directory where you would like the data stored.';
      const baseField = div.appendChild(dom.createElement('input'));
      baseField.setAttribute('type', 'text');
      baseField.size = 80 // really a string
      ;
      baseField.label = 'base URL';
      baseField.autocomplete = 'on';
      div.appendChild(dom.createElement('br')); // @@

      const button = div.appendChild(dom.createElement('button'));
      button.textContent = 'Start new ' + noun + ' at this URI';
      button.addEventListener('click', function (_e) {
        let newBase = baseField.value;
        if (newBase.slice(-1) !== '/') {
          newBase += '/';
        }
        initializeNewInstanceAtBase(thisInstance, newBase);
      });
    };

    //  Create new document files for new instance of app
    const initializeNewInstanceInWorkspace = function (ws) {
      // @@ TODO Clean up type for newBase
      let newBase = store.any(ws, _solidUiJss.ns.space('uriPrefix'));
      if (!newBase) {
        newBase = ws.uri.split('#')[0];
      } else {
        newBase = newBase.value;
      }
      if (newBase.slice(-1) !== '/') {
        _rdflib.log.error(appPathSegment + ': No / at end of uriPrefix ' + newBase); // @@ paramater?
        newBase = newBase + '/';
      }
      const now = new Date();
      newBase += appPathSegment + '/id' + now.getTime() + '/'; // unique id

      initializeNewInstanceAtBase(thisInstance, newBase);
    };
    const initializeNewInstanceAtBase = function (thisInstance, newBase) {
      const here = (0, _rdflib.sym)(thisInstance.uri.split('#')[0]);
      const base = here; // @@ ???

      const newPadDoc = store.sym(newBase + 'pad.ttl');
      const newIndexDoc = store.sym(newBase + 'index.html');
      const toBeCopied = [{
        local: 'index.html',
        contentType: 'text/html'
      }];
      const newInstance = store.sym(newPadDoc.uri + '#thisPad');

      // log.debug("\n Ready to put " + kb.statementsMatching(undefined, undefined, undefined, there)); //@@

      const agenda = [];
      let f; //   @@ This needs some form of visible progress bar
      for (f = 0; f < toBeCopied.length; f++) {
        const item = toBeCopied[f];
        const fun = function copyItem(item) {
          agenda.push(function () {
            const newURI = newBase + item.local;
            console.log('Copying ' + base + item.local + ' to ' + newURI);
            const setThatACL = function () {
              setACL(newURI, false, function (ok, message) {
                if (!ok) {
                  complainIfBad(ok, 'FAILED to set ACL ' + newURI + ' : ' + message);
                  console.log('FAILED to set ACL ' + newURI + ' : ' + message);
                } else {
                  agenda.shift()(); // beware too much nesting
                }
              });
            };
            if (!store.fetcher) {
              throw new Error('Store has no fetcher');
            }
            store.fetcher.webCopy(base + item.local, newBase + item.local, item.contentType).then(() => _solidLogicJss.authn.checkUser()).then(webId => {
              me = webId;
              setThatACL();
            }).catch(err => {
              console.log('FAILED to copy ' + base + item.local + ' : ' + err.message);
              complainIfBad(false, 'FAILED to copy ' + base + item.local + ' : ' + err.message);
            });
          });
        };
        fun(item);
      }
      agenda.push(function createNewPadDataFile() {
        store.add(newInstance, _solidUiJss.ns.rdf('type'), PAD('Notepad'), newPadDoc);

        // TODO @@ Remove casting of add
        store.add(newInstance, _solidUiJss.ns.dc('created'), new Date(),
        // @@ TODO Remove casting
        newPadDoc);
        if (me) {
          store.add(newInstance, _solidUiJss.ns.dc('author'), me, newPadDoc);
        }
        store.add(newInstance, PAD('next'), newInstance, newPadDoc); // linked list empty

        // Keep a paper trail   @@ Revisit when we have non-public ones @@ Privacy
        store.add(newInstance, _solidUiJss.ns.space('inspiration'), thisInstance, padDoc);
        store.add(newInstance, _solidUiJss.ns.space('inspiration'), thisInstance, newPadDoc);
        if (!updater) {
          throw new Error('Have no updater');
        }
        updater.put(newPadDoc, store.statementsMatching(undefined, undefined, undefined, newPadDoc), 'text/turtle', function (_uri2, ok, message) {
          if (ok) {
            agenda.shift()();
          } else {
            complainIfBad(ok, 'FAILED to save new notepad at: ' + newPadDoc.uri + ' : ' + message);
            console.log('FAILED to save new notepad at: ' + newPadDoc.uri + ' : ' + message);
          }
        });
      });
      agenda.push(function () {
        setACL(newPadDoc.uri, true, function (ok, body) {
          complainIfBad(ok, 'Failed to set Read-Write ACL on pad data file: ' + body);
          if (ok) agenda.shift()();
        });
      });
      agenda.push(function () {
        // give the user links to the new app

        const p = div.appendChild(dom.createElement('p'));
        p.setAttribute('style', 'font-size: 140%;');
        p.innerHTML = 'Your <a href=\'' + newIndexDoc.uri + '\'><b>new notepad</b></a> is ready. ' + '<br/><br/><a href=\'' + newIndexDoc.uri + '\'>Go to new pad</a>';
      });
      agenda.shift()();
      // Created new data files.
    };

    //  Update on incoming changes
    const showResults = function (exists) {
      console.log('showResults()');
      me = _solidLogicJss.authn.currentUser();
      _solidLogicJss.authn.checkUser().then(webId => {
        me = webId;
      });
      const title = store.any(subject, _solidUiJss.ns.dc('title')) || store.any(subject, _solidUiJss.ns.vcard('fn'));
      if (paneOptions.solo && typeof window !== 'undefined' && title) {
        window.document.title = title.value;
      }
      options.exists = exists;
      padEle = _solidUiJss.pad.notepad(dom, padDoc, subject, me, options);
      naviMain.appendChild(padEle);
      const partipationTarget = store.any(subject, _solidUiJss.ns.meeting('parentMeeting')) || subject;
      _solidUiJss.pad.manageParticipation(dom, naviMiddle2, padDoc, partipationTarget, me, options);
      if (!store.updater) {
        throw new Error('Store has no updater');
      }
      store.updater.setRefreshHandler(padDoc, padEle.reloadAndSync); // initiated =
    };

    // Read or create empty data file
    const loadPadData = function () {
      if (!fetcher) {
        throw new Error('Have no fetcher');
      }
      fetcher.nowOrWhenFetched(padDoc.uri, undefined, function (ok, body, response) {
        if (!ok) {
          if (response.status === 404) {
            // /  Check explicitly for 404 error
            console.log('Initializing results file ' + padDoc);
            if (!updater) {
              throw new Error('Have no updater');
            }
            updater.put(padDoc, [], 'text/turtle', function (_uri2, ok, message) {
              if (ok) {
                clearElement(naviMain);
                showResults(false);
              } else {
                complainIfBad(ok, 'FAILED to create results file at: ' + padDoc.uri + ' : ' + message);
                console.log('FAILED to craete results file at: ' + padDoc.uri + ' : ' + message);
              }
            });
          } else {
            // Other error, not 404 -- do not try to overwite the file
            complainIfBad(ok, 'FAILED to read results file: ' + body);
          }
        } else {
          // Happy read
          clearElement(naviMain);
          if (store.holds(subject, _solidUiJss.ns.rdf('type'), _solidUiJss.ns.wf('TemplateInstance'))) {
            showBootstrap(subject, naviMain, 'pad');
          }
          showResults(true);
          naviMiddle3.appendChild(newInstanceButton());
        }
      });
    };

    //  Body of Pane
    const appPathSegment = 'app-pad.timbl.com'; // how to allocate this string and connect to

    const fetcher = store.fetcher;
    const updater = store.updater;
    let me;
    const PAD = (0, _rdflib.Namespace)('http://www.w3.org/ns/pim/pad#');
    const thisInstance = subject;
    const padDoc = subject.doc();
    let padEle;
    const div = dom.createElement('div');

    //  Build the DOM
    const structure = div.appendChild(dom.createElement('table')); // @@ make responsive style
    structure.setAttribute('style', 'background-color: white; min-width: 94%; margin-right:3% margin-left: 3%; min-height: 13em;');
    const naviLoginoutTR = structure.appendChild(dom.createElement('tr'));
    naviLoginoutTR.appendChild(dom.createElement('td')); // naviLoginout1
    naviLoginoutTR.appendChild(dom.createElement('td'));
    naviLoginoutTR.appendChild(dom.createElement('td'));
    const naviTop = structure.appendChild(dom.createElement('tr')); // stuff
    const naviMain = naviTop.appendChild(dom.createElement('td'));
    naviMain.setAttribute('colspan', '3');
    const naviMiddle = structure.appendChild(dom.createElement('tr')); // controls
    const naviMiddle1 = naviMiddle.appendChild(dom.createElement('td'));
    const naviMiddle2 = naviMiddle.appendChild(dom.createElement('td'));
    const naviMiddle3 = naviMiddle.appendChild(dom.createElement('td'));
    const naviStatus = structure.appendChild(dom.createElement('tr')); // status etc
    const statusArea = naviStatus.appendChild(dom.createElement('div'));
    const naviSpawn = structure.appendChild(dom.createElement('tr')); // create new
    const spawnArea = naviSpawn.appendChild(dom.createElement('div'));
    const naviMenu = structure.appendChild(dom.createElement('tr'));
    naviMenu.setAttribute('class', 'naviMenu');
    // naviMenu.setAttribute('style', 'margin-top: 3em;');
    naviMenu.appendChild(dom.createElement('td')); // naviLeft
    naviMenu.appendChild(dom.createElement('td'));
    naviMenu.appendChild(dom.createElement('td'));
    const options = {
      statusArea,
      timingArea: naviMiddle1
    };
    loadPadData();
    return div;
  }
};
// ends
var _default = exports.default = paneDef;
//# sourceMappingURL=padPane.js.map