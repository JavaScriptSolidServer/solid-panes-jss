"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var UI = _interopRequireWildcard(require("solid-ui-jss"));
var _rdflib = require("rdflib");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * ActivityStreams Pane - Vanilla JS rewrite
 *
 * Displays as:Note content as a styled card.
 * Replaces the React-based activitystreams-pane package (~11MB -> ~3KB)
 */

const ns = UI.ns;

// Styles for the note card
const styles = {
  card: `
    font-family: sans-serif;
    display: flex;
    flex-wrap: wrap;
    border-radius: 4px;
    flex-direction: column;
    justify-content: center;
    padding: 1em;
    box-shadow: 0 1px 5px rgba(0,0,0,0.2);
    transition: all .25s ease-in-out;
    max-width: 632px;
  `,
  content: `
    font-size: larger;
    margin: 0.5em 0;
  `,
  date: `
    color: rgba(0, 0, 0, 0.6);
    margin: 0.5em 0;
  `,
  attribution: `
    display: flex;
    align-items: center;
    font-weight: bold;
  `,
  attributionLink: `
    color: black;
    text-decoration: none;
  `,
  attributionImage: `
    margin-right: 5px;
    width: 47px;
    height: 47px;
    border-radius: 5px;
    object-fit: cover;
  `
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 */
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [{
    label: 'year',
    seconds: 31536000
  }, {
    label: 'month',
    seconds: 2592000
  }, {
    label: 'week',
    seconds: 604800
  }, {
    label: 'day',
    seconds: 86400
  }, {
    label: 'hour',
    seconds: 3600
  }, {
    label: 'minute',
    seconds: 60
  }];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}

/**
 * Format date for display
 */
function formatDate(date) {
  if (!date) return null;
  const formatted = date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${timeAgo(date)} · ${formatted}`;
}

/**
 * Check if node is a Person type
 */
function isPerson(store, node) {
  const types = store.findTypeURIs(node);
  return types[ns.as('Person').uri] || types[ns.foaf('Person').uri] || types[ns.vcard('Individual').uri] || types[ns.schema('Person').uri];
}

/**
 * Read person's image URL from store
 */
function readImageSrc(store, node) {
  const image = store.anyValue(node, ns.as('image'));
  if (image) {
    return store.anyValue((0, _rdflib.sym)(image), ns.as('url')) || null;
  }
  return store.anyValue(node, ns.foaf('img')) || store.anyValue(node, ns.vcard('hasPhoto')) || null;
}

/**
 * Read attribution (author) info from store
 */
function readAttribution(store, subject) {
  const attributedTo = store.any(subject, ns.as('attributedTo'));
  if (!attributedTo || !attributedTo.uri) {
    return {
      type: 'none'
    };
  }
  if (isPerson(store, attributedTo)) {
    const name = store.anyValue(attributedTo, ns.as('name')) || store.anyValue(attributedTo, ns.foaf('name')) || store.anyValue(attributedTo, ns.vcard('fn')) || store.anyValue(attributedTo, ns.schema('name')) || '';
    return {
      type: 'person',
      webId: attributedTo.uri,
      name,
      imageSrc: readImageSrc(store, attributedTo)
    };
  }
  return {
    type: 'link',
    uri: attributedTo.uri
  };
}

/**
 * Read note data from store
 */
function readNote(store, subject) {
  const content = store.any(subject, ns.as('content'));
  const published = store.any(subject, ns.as('published'));
  if (!content) return null;
  return {
    content: content.value,
    published: published ? new Date(published.value) : null,
    attribution: readAttribution(store, subject)
  };
}

/**
 * Create the attribution element
 */
function createAttributionElement(doc, attribution) {
  const container = doc.createElement('div');
  container.setAttribute('style', styles.attribution);
  if (attribution.type === 'none') {
    return container;
  }
  if (attribution.type === 'link') {
    const link = doc.createElement('a');
    link.setAttribute('href', attribution.uri);
    link.setAttribute('style', styles.attributionLink);
    link.textContent = attribution.uri;
    container.appendChild(link);
    return container;
  }
  if (attribution.type === 'person') {
    if (attribution.imageSrc) {
      const img = doc.createElement('img');
      img.setAttribute('src', attribution.imageSrc);
      img.setAttribute('alt', attribution.name);
      img.setAttribute('style', styles.attributionImage);
      container.appendChild(img);
    }
    const link = doc.createElement('a');
    link.setAttribute('href', attribution.webId);
    link.setAttribute('style', styles.attributionLink);
    link.textContent = attribution.name || attribution.webId;
    link.addEventListener('mouseover', () => {
      link.style.textDecoration = 'underline';
    });
    link.addEventListener('mouseout', () => {
      link.style.textDecoration = 'none';
    });
    container.appendChild(link);
  }
  return container;
}

/**
 * Create the note card element
 */
function createNoteCard(doc, note) {
  const card = doc.createElement('div');
  card.setAttribute('style', styles.card);

  // Attribution (author)
  card.appendChild(createAttributionElement(doc, note.attribution));

  // Content
  const content = doc.createElement('p');
  content.setAttribute('style', styles.content);
  content.textContent = note.content;
  card.appendChild(content);

  // Date
  if (note.published) {
    const dateEl = doc.createElement('p');
    dateEl.setAttribute('style', styles.date);
    dateEl.textContent = formatDate(note.published);
    card.appendChild(dateEl);
  }
  return card;
}

/**
 * The ActivityStreams Pane
 */
var _default = exports.default = {
  icon: UI.icons.iconBase + 'noun_15695.svg',
  name: 'activitystreams',
  label: function (subject, context) {
    const store = context.session.store;
    const types = store.findTypeURIs(subject);
    if (types[ns.as('Note').uri]) {
      return 'Note';
    }
    return null;
  },
  render: function (subject, context) {
    const doc = context.dom;
    const store = context.session.store;
    const container = doc.createElement('div');
    const note = readNote(store, subject);
    if (!note) {
      const msg = doc.createElement('p');
      msg.textContent = 'Unable to read note content.';
      container.appendChild(msg);
      return container;
    }

    // Render initial card
    container.appendChild(createNoteCard(doc, note));

    // If attribution is just a link, try to fetch and update
    if (note.attribution.type === 'link') {
      const attributionNode = (0, _rdflib.sym)(note.attribution.uri);
      store.fetcher.load(attributionNode).then(() => {
        // Re-read attribution after fetch
        const updatedAttribution = readAttribution(store, subject);
        if (updatedAttribution.type === 'person') {
          note.attribution = updatedAttribution;
          container.innerHTML = '';
          container.appendChild(createNoteCard(doc, note));
        }
      }).catch(() => {
        // Keep original link attribution on error
      });
    }
    return container;
  }
};
//# sourceMappingURL=activitystreamsPane.js.map