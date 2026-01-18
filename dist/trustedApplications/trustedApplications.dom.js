"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplicationTable = createApplicationTable;
exports.createContainer = createContainer;
exports.createText = createText;
var _rdflib = require("rdflib");
var _solidUiJss = require("solid-ui-jss");
var _solidLogicJss = require("solid-logic-jss");
var _trustedApplications = require("./trustedApplications.utils");
function createApplicationTable(subject) {
  const applicationsTable = createElement('table', {
    class: 'results'
  });

  // creating headers
  const header = createContainer('tr', [createText('th', 'Application URL'), createText('th', 'Access modes'), createText('th', 'Actions')]);
  applicationsTable.appendChild(header);

  // creating rows
  _solidLogicJss.store.each(subject, _solidUiJss.ns.acl('trustedApp'), undefined, undefined).flatMap(app => _solidLogicJss.store.each(app, _solidUiJss.ns.acl('origin'), undefined, undefined).map(origin => ({
    appModes: _solidLogicJss.store.each(app, _solidUiJss.ns.acl('mode'), undefined, undefined),
    origin: origin
  }))).sort((a, b) => a.origin.value < b.origin.value ? -1 : 1).forEach(({
    appModes,
    origin
  }) => applicationsTable.appendChild(createApplicationEntry(subject, origin, appModes, updateTable)));

  // adding a row for new applications
  applicationsTable.appendChild(createApplicationEntry(subject, null, [_solidUiJss.ns.acl('Read')], updateTable));
  return applicationsTable;
  function updateTable() {
    applicationsTable.parentElement.replaceChild(createApplicationTable(subject), applicationsTable);
  }
}
function createApplicationEntry(subject, origin, appModes, updateTable) {
  const trustedApplicationState = {
    origin,
    appModes,
    formElements: {
      modes: [],
      origin: undefined
    }
  };
  return createContainer('tr', [createContainer('td', [createContainer('form', [createElement('input', {
    class: 'textinput',
    placeholder: 'Write new URL here',
    value: origin ? origin.value : ''
  }, {}, element => {
    trustedApplicationState.formElements.origin = element;
  })], {}, {
    submit: addOrEditApplication
  })]), createContainer('td', [createContainer('form', createModesInput(trustedApplicationState), {}, {
    submit: addOrEditApplication
  })]), createContainer('td', [createContainer('form', origin ? [createText('button', 'Update', {
    class: 'controlButton',
    style: 'background: LightGreen;'
  }), createText('button', 'Delete', {
    class: 'controlButton',
    style: 'background: LightCoral;'
  }, {
    click: removeApplication
  })] : [createText('button', 'Add', {
    class: 'controlButton',
    style: 'background: LightGreen;'
  })], {}, {
    submit: addOrEditApplication
  })])]);
  function addOrEditApplication(event) {
    event.preventDefault();
    let origin;
    try {
      origin = (0, _rdflib.sym)(trustedApplicationState.formElements.origin.value);
    } catch (err) {
      return alert('Please provide an application URL you want to trust');
    }
    const modes = trustedApplicationState.formElements.modes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
    const deletions = (0, _trustedApplications.getStatementsToDelete)(trustedApplicationState.origin || origin, subject, _solidLogicJss.store, _solidUiJss.ns);
    const additions = (0, _trustedApplications.getStatementsToAdd)(origin, (0, _trustedApplications.generateRandomString)(), modes, subject, _solidUiJss.ns);
    if (!_solidLogicJss.store.updater) {
      throw new Error('Store has no updater');
    }
    _solidLogicJss.store.updater.update(deletions, additions, handleUpdateResponse);
  }
  function removeApplication(event) {
    event.preventDefault();
    let origin;
    try {
      origin = (0, _rdflib.sym)(trustedApplicationState.formElements.origin.value);
    } catch (err) {
      return alert('Please provide an application URL you want to remove trust from');
    }
    const deletions = (0, _trustedApplications.getStatementsToDelete)(origin, subject, _solidLogicJss.store, _solidUiJss.ns);
    if (!_solidLogicJss.store.updater) {
      throw new Error('Store has no updater');
    }
    _solidLogicJss.store.updater.update(deletions, [], handleUpdateResponse);
  }
  function handleUpdateResponse(uri, success, errorBody) {
    if (success) {
      return updateTable();
    }
    // console.error(uri, errorBody)
  }
}
function createElement(elementName, attributes = {}, eventListeners = {}, onCreated = null) {
  const element = document.createElement(elementName);
  if (onCreated) {
    onCreated(element);
  }
  Object.keys(attributes).forEach(attName => {
    element.setAttribute(attName, attributes[attName]);
  });
  Object.keys(eventListeners).forEach(eventName => {
    element.addEventListener(eventName, eventListeners[eventName]);
  });
  return element;
}
function createContainer(elementName, children, attributes = {}, eventListeners = {}, onCreated = null) {
  const element = createElement(elementName, attributes, eventListeners, onCreated);
  children.forEach(child => element.appendChild(child));
  return element;
}
function createText(elementName, textContent, attributes = {}, eventListeners = {}, onCreated = null) {
  const element = createElement(elementName, attributes, eventListeners, onCreated);
  element.textContent = textContent;
  return element;
}
function createModesInput({
  appModes,
  formElements
}) {
  return ['Read', 'Write', 'Append', 'Control'].map(mode => {
    const isChecked = appModes.some(appMode => appMode.value === _solidUiJss.ns.acl(mode).value);
    return createContainer('label', [createElement('input', {
      type: 'checkbox',
      ...(isChecked ? {
        checked: ''
      } : {}),
      value: _solidUiJss.ns.acl(mode).uri
    }, {}, element => formElements.modes.push(element)), createText('span', mode)]);
  });
}
//# sourceMappingURL=trustedApplications.dom.js.map