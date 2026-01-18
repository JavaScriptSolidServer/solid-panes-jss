/**
 * Bookmark Pane - Full Implementation
 *
 * This file is lazy-loaded only when the user views a bookmark.
 * It contains all the heavy logic: UI rendering, RDF queries, updates.
 */

import * as UI from 'solid-ui-jss';
import * as $rdf from 'rdflib';
import { store } from 'solid-logic-jss';
const ns = UI.ns;
const schema = $rdf.Namespace('http://schema.org/');
const dom = document;

/**
 * Render a single bookmark
 */
function renderBookmark(subject, context, container) {
  const kb = context.session.store;
  const div = dom.createElement('div');
  div.className = 'bookmark-item';

  // Get bookmark properties
  const name = kb.anyValue(subject, schema('name')) || 'Untitled';
  const url = kb.any(subject, schema('url'));
  const description = kb.anyValue(subject, schema('description'));
  const dateCreated = kb.anyValue(subject, schema('dateCreated'));

  // Title
  const title = dom.createElement('h3');
  title.className = 'bookmark-title';
  if (url) {
    const link = dom.createElement('a');
    link.href = url.uri || url.value;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = name;
    title.appendChild(link);
  } else {
    title.textContent = name;
  }
  div.appendChild(title);

  // URL display
  if (url) {
    const urlDiv = dom.createElement('div');
    urlDiv.className = 'bookmark-url';
    urlDiv.textContent = url.uri || url.value;
    div.appendChild(urlDiv);
  }

  // Description
  if (description) {
    const desc = dom.createElement('p');
    desc.className = 'bookmark-description';
    desc.textContent = description;
    div.appendChild(desc);
  }

  // Date
  if (dateCreated) {
    const date = dom.createElement('div');
    date.className = 'bookmark-date';
    date.textContent = 'Added: ' + new Date(dateCreated).toLocaleDateString();
    div.appendChild(date);
  }

  // Delete button (if user has write access)
  const deleteBtn = dom.createElement('button');
  deleteBtn.className = 'bookmark-delete';
  deleteBtn.textContent = '×';
  deleteBtn.title = 'Delete bookmark';
  deleteBtn.onclick = async () => {
    if (confirm('Delete this bookmark?')) {
      try {
        // Remove all triples about this bookmark
        const triples = kb.statementsMatching(subject, null, null, subject.doc());
        await store.updater.update(triples, []);
        div.remove();
      } catch (e) {
        alert('Failed to delete: ' + e.message);
      }
    }
  };
  div.appendChild(deleteBtn);
  return div;
}

/**
 * Render the add bookmark form
 */
function renderAddForm(containerUri, context, onAdd) {
  const form = dom.createElement('form');
  form.className = 'bookmark-add-form';
  form.innerHTML = `
    <h4>Add Bookmark</h4>
    <input type="text" name="name" placeholder="Title" required />
    <input type="url" name="url" placeholder="https://example.com" required />
    <textarea name="description" placeholder="Description (optional)"></textarea>
    <button type="submit">Add Bookmark</button>
  `;
  form.onsubmit = async e => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const url = formData.get('url');
    const description = formData.get('description');
    try {
      // Generate unique ID
      const id = 'bookmark-' + Date.now();
      const bookmarkUri = containerUri + '#' + id;
      const subject = $rdf.sym(bookmarkUri);
      const doc = $rdf.sym(containerUri);

      // Create triples
      const ins = [$rdf.st(subject, ns.rdf('type'), schema('Bookmark'), doc), $rdf.st(subject, schema('name'), name, doc), $rdf.st(subject, schema('url'), $rdf.sym(url), doc), $rdf.st(subject, schema('dateCreated'), new Date().toISOString(), doc)];
      if (description) {
        ins.push($rdf.st(subject, schema('description'), description, doc));
      }
      await store.updater.update([], ins);

      // Clear form and refresh
      form.reset();
      if (onAdd) onAdd(subject);
    } catch (e) {
      alert('Failed to add bookmark: ' + e.message);
    }
  };
  return form;
}

/**
 * Main render function
 */
export function render(subject, context, options) {
  const kb = context.session.store;
  const div = dom.createElement('div');
  div.className = 'bookmark-pane';

  // Add styles
  const style = dom.createElement('style');
  style.textContent = `
    .bookmark-pane {
      padding: 1em;
      font-family: system-ui, sans-serif;
    }
    .bookmark-item {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1em;
      margin-bottom: 1em;
      position: relative;
      background: #fafafa;
    }
    .bookmark-title {
      margin: 0 0 0.5em 0;
      font-size: 1.2em;
    }
    .bookmark-title a {
      color: #0066cc;
      text-decoration: none;
    }
    .bookmark-title a:hover {
      text-decoration: underline;
    }
    .bookmark-url {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 0.5em;
    }
    .bookmark-description {
      margin: 0.5em 0;
      color: #333;
    }
    .bookmark-date {
      font-size: 0.8em;
      color: #999;
    }
    .bookmark-delete {
      position: absolute;
      top: 0.5em;
      right: 0.5em;
      background: #ff4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    .bookmark-delete:hover {
      background: #cc0000;
    }
    .bookmark-add-form {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 1em;
      margin-top: 1em;
    }
    .bookmark-add-form h4 {
      margin: 0 0 1em 0;
    }
    .bookmark-add-form input,
    .bookmark-add-form textarea {
      display: block;
      width: 100%;
      padding: 0.5em;
      margin-bottom: 0.5em;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .bookmark-add-form button {
      background: #0066cc;
      color: white;
      border: none;
      padding: 0.5em 1em;
      border-radius: 4px;
      cursor: pointer;
    }
    .bookmark-add-form button:hover {
      background: #0055aa;
    }
    .bookmark-empty {
      color: #666;
      font-style: italic;
      padding: 2em;
      text-align: center;
    }
  `;
  div.appendChild(style);

  // Header
  const header = dom.createElement('h2');
  header.textContent = '🔖 Bookmarks';
  div.appendChild(header);

  // Check what we're rendering
  const types = kb.findTypeURIs(subject);
  const isContainer = types[ns.ldp('Container').uri] || types[ns.ldp('BasicContainer').uri];
  const isBookmark = types[schema('Bookmark').uri];

  // Bookmark list container
  const list = dom.createElement('div');
  list.className = 'bookmark-list';
  div.appendChild(list);
  if (isBookmark) {
    // Single bookmark view
    list.appendChild(renderBookmark(subject, context, list));
  } else if (isContainer) {
    // Container with bookmarks
    const contents = kb.each(subject, ns.ldp('contains'));
    const bookmarks = contents.filter(item => {
      const itemTypes = kb.findTypeURIs(item);
      return itemTypes[schema('Bookmark').uri];
    });
    if (bookmarks.length === 0) {
      const empty = dom.createElement('div');
      empty.className = 'bookmark-empty';
      empty.textContent = 'No bookmarks yet. Add one below!';
      list.appendChild(empty);
    } else {
      bookmarks.forEach(bookmark => {
        list.appendChild(renderBookmark(bookmark, context, list));
      });
    }

    // Add form for containers
    const addForm = renderAddForm(subject.uri, context, newBookmark => {
      // Remove empty message if present
      const empty = list.querySelector('.bookmark-empty');
      if (empty) empty.remove();
      // Add new bookmark to list
      list.appendChild(renderBookmark(newBookmark, context, list));
    });
    div.appendChild(addForm);
  }
  return div;
}

/**
 * Create a new bookmark resource
 */
export async function mintNew(context, options) {
  const newBase = options.newBase || context.session.store.any(null, ns.space('preferencesFile'))?.uri;
  if (!newBase) {
    throw new Error('No location specified for new bookmark');
  }
  const bookmarkUri = newBase + 'bookmarks.ttl';
  const subject = $rdf.sym(bookmarkUri + '#bookmark-' + Date.now());
  const doc = $rdf.sym(bookmarkUri);

  // Create minimal bookmark
  const ins = [$rdf.st(subject, ns.rdf('type'), schema('Bookmark'), doc), $rdf.st(subject, schema('name'), 'New Bookmark', doc), $rdf.st(subject, schema('dateCreated'), new Date().toISOString(), doc)];
  await store.updater.update([], ins);
  return subject;
}
//# sourceMappingURL=bookmarkRender.js.map