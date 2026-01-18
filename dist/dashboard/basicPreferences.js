import { parse } from 'rdflib';
import { icons, login, ns, widgets } from 'solid-ui-jss';
/* babel-plugin-inline-import './ontologyData.ttl' */
const ontologyData = "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.\n@prefix solid: <http://www.w3.org/ns/solid/terms#>.\n@prefix foaf: <http://xmlns.com/foaf/0.1/>.\n@prefix schema: <http:/schema.org/>.\n@prefix ui: <http://www.w3.org/ns/ui#>.\n@prefix vcard: <http://www.w3.org/2006/vcard/ns#>.\n@prefix : <#>.\n\nsolid:User a rdfs:Class;\n  rdfs:label \"user\"@en, \"utilisateur\"@fr;\n  rdfs:comment \"\"\"Any person who might use a Solid-based system\"\"\";\n  rdfs:subClassOf foaf:Person, schema:Person, vcard:Individual.\n\n# Since these options are opt-in, it is a bit strange to have new users opt in\n# That they are new users - also we do not use this class for anything specific\n# yet\n# solid:NewUser a rdfs:Class;\n#  rdfs:label \"new user\"@en;\n#  rdfs:comment \"\"\"A person who might use a Solid-based system who has a low\n#  level of familiarity with technical details.\"\"\";\n#  rdfs:subClassOf solid:User.\n\nsolid:PowerUser a rdfs:Class;\n  rdfs:label \"power user\"@en;\n  rdfs:comment \"\"\"A person who might use a Solid-based system\n  who is prepared to be given a more complex interface in order\n  to be provided with more pwerful features.\"\"\";\n  rdfs:subClassOf solid:User.\n\n  solid:Developer a rdfs:Class;\n    rdfs:label \"Developer\";\n    rdfs:comment \"\"\"Any person who might use a Solid-based system,\n    who has software development skills.\"\"\";\n    rdfs:subClassOf solid:User.\n";
/* babel-plugin-inline-import './preferencesFormText.ttl' */
const preferencesFormText = "@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.\n@prefix solid: <http://www.w3.org/ns/solid/terms#>.\n@prefix ui: <http://www.w3.org/ns/ui#>.\n@prefix : <#>.\n\n:this <http://purl.org/dc/elements/1.1/title> \"Basic preferences\" ;\n      a ui:Form ;\n      ui:part :categorizeUser, :privateComment, :personalInformationHeading;\n      ui:parts ( :personalInformationHeading :privateComment :categorizeUser ).\n\n:personalInformationHeading a ui:Heading;\n      ui:contents \"Personal information\".\n\n:privateComment a ui:Comment;\n      ui:contents \"This information is private.\".\n\n:categorizeUser a ui:Classifier;\n      ui:label \"Level of user\"; ui:property rdf:type ; ui:category solid:User.\n";
export const basicPreferencesPane = {
  icon: icons.iconBase + 'noun_Sliders_341315_000000.svg',
  name: 'basicPreferences',
  label: _subject => {
    return null;
  },
  // Render the pane
  // The subject should be the logged in user.
  render: (subject, context) => {
    const dom = context.dom;
    const store = context.session.store;
    function complainIfBad(ok, mess) {
      if (ok) return;
      container.appendChild(widgets.errorMessageBlock(dom, mess, '#fee'));
    }
    const container = dom.createElement('div');
    const formArea = setupUserTypesSection(container, dom);
    function loadData(doc, turtle) {
      doc = doc.doc(); // remove # from URI if nec
      if (!store.holds(undefined, undefined, undefined, doc)) {
        // If not loaded already
        ;
        parse(turtle, store, doc.uri, 'text/turtle', null); // Load form directly
      }
    }
    const preferencesForm = store.sym('urn:uuid:93774ba1-d3b6-41f2-85b6-4ae27ffd2597#this');
    loadData(preferencesForm, preferencesFormText);
    const ontologyExtra = store.sym('urn:uuid:93774ba1-d3b6-41f2-85b6-4ae27ffd2597-ONT');
    loadData(ontologyExtra, ontologyData);
    async function doRender() {
      const renderContext = await login.ensureLoadedPreferences({
        dom,
        div: container
      });
      if (!renderContext.preferencesFile) {
        // Could be CORS
        console.log('Not doing private class preferences as no access to preferences file. ' + renderContext.preferencesFileError);
        return;
      }
      const appendedForm = widgets.appendForm(dom, formArea, {}, renderContext.me, preferencesForm, renderContext.preferencesFile, complainIfBad);
      appendedForm.style.borderStyle = 'none';
      const trustedApplicationsView = context.session.paneRegistry.byName('trustedApplications');
      if (trustedApplicationsView) {
        container.appendChild(trustedApplicationsView.render(null, context));
      }

      // @@ TODO Remove need for casting as any and bang (!) syntax
      addDeleteSection(container, store, renderContext.me, dom);
    }
    doRender();
    return container;
  }
};
function setupUserTypesSection(container, dom) {
  const formContainer = createSection(container, dom, 'User types');
  const description = formContainer.appendChild(dom.createElement('p'));
  description.innerText = 'Here you can self-assign user types to help the data browser know which views you would like to access.';
  const userTypesLink = formContainer.appendChild(dom.createElement('a'));
  userTypesLink.href = 'https://github.com/solidos/userguide/#role';
  userTypesLink.innerText = 'Read more';
  const formArea = formContainer.appendChild(dom.createElement('div'));
  return formArea;
}
export default basicPreferencesPane;

// ends

function addDeleteSection(container, store, profile, dom) {
  const section = createSection(container, dom, 'Delete account');
  const podServerNodes = store.each(profile, ns.space('storage'), null, profile.doc());
  const podServers = podServerNodes.map(node => node.value);
  const list = section.appendChild(dom.createElement('ul'));
  podServers.forEach(async server => {
    const deletionLink = await generateDeletionLink(server, dom);
    if (deletionLink) {
      const listItem = list.appendChild(dom.createElement('li'));
      listItem.appendChild(deletionLink);
    }
  });
}
async function generateDeletionLink(podServer, dom) {
  const link = dom.createElement('a');
  link.textContent = `Delete your account at ${podServer}`;
  const deletionUrl = await getDeletionUrlForServer(podServer);
  if (typeof deletionUrl !== 'string') {
    return null;
  }
  link.href = deletionUrl;
  return link;
}

/**
 * Hacky way to get the deletion link to a Pod
 *
 * This function infers the deletion link by assuming the URL structure of Node Solid server.
 * In the future, Solid will hopefully provide a standardised way of discovering the deletion link:
 * https://github.com/solidos/data-interoperability-panel/issues/18
 *
 * If NSS is in multi-user mode (the case on inrupt.net and solid.community), the deletion URL for
 * vincent.dev.inrupt.net would be at dev.inrupt.net/account/delete. In single-user mode, the
 * deletion URL would be at vincent.dev.inrupt.net/account/delete.
 *
 * @param server Pod server containing the user's account.
 * @returns URL of the page that Node Solid Server would offer to delete the account, or null if
 *          the URLs we tried give invalid responses.
 */
async function getDeletionUrlForServer(server) {
  const singleUserUrl = new URL(server);
  const multiUserUrl = new URL(server);
  multiUserUrl.pathname = singleUserUrl.pathname = '/account/delete';
  const hostnameParts = multiUserUrl.hostname.split('.');
  // Remove `vincent.` from `vincent.dev.inrupt.net`, for example:
  multiUserUrl.hostname = hostnameParts.slice(1).join('.');
  const multiUserNssResponse = await fetch(multiUserUrl.href, {
    method: 'HEAD'
  });
  if (multiUserNssResponse.ok) {
    return multiUserUrl.href;
  }
  const singleUserNssResponse = await fetch(singleUserUrl.href, {
    method: 'HEAD'
  });
  if (singleUserNssResponse.ok) {
    return singleUserUrl.href;
  }
  return null;
}
function createSection(container, dom, title) {
  const section = container.appendChild(dom.createElement('div'));
  section.style.border = '0.3em solid #418d99';
  section.style.borderRadius = '0.5em';
  section.style.padding = '0.7em';
  section.style.marginTop = '0.7em';
  const titleElement = section.appendChild(dom.createElement('h3'));
  titleElement.innerText = title;
  return section;
}
//# sourceMappingURL=basicPreferences.js.map