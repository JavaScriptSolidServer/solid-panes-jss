# Creating Custom Panes for solid-panes-jss

This guide explains how to create custom panes that integrate with the Solid data browser.

## Architecture Overview

Panes are UI components that render specific types of Linked Data. The pane registry matches content to panes using RDF type checks.

```
┌─────────────────────────────────────────────────────────┐
│                    Pane Registry                        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │ profile │ │ folder  │ │  chat   │ │ custom  │ ...   │
│  │  pane   │ │  pane   │ │  pane   │ │  pane   │       │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘       │
│       │           │           │           │             │
│       ▼           ▼           ▼           ▼             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              label() - sync type check          │   │
│  │         "Is this pane relevant to subject?"     │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │             render() - async lazy load          │   │
│  │         "Load chunk and render the UI"          │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Pane Interface

```typescript
interface Pane {
  // Required
  name: string                    // Unique pane identifier
  icon: string                    // Icon URL for pane selector
  label: (subject, context) => string | null  // Sync relevance check
  render: (subject, context, options?) => HTMLElement | Promise<HTMLElement>

  // Optional
  audience?: NamedNode[]          // e.g., [ns.solid('PowerUser')]
  global?: boolean                // Always available (like home pane)
  mintClass?: NamedNode           // RDF class this pane can create
  mintNew?: (context, options) => Promise<NamedNode>  // Create new instance
}
```

## Simple Pane Example

```javascript
// my-pane.js
export const myPane = {
  name: 'my-custom-pane',
  icon: 'https://example.com/icon.svg',

  // label() determines if pane is relevant - MUST be synchronous
  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    // Return tooltip string if relevant, null if not
    if (types['http://example.com/MyType']) {
      return 'My Custom View'
    }
    return null
  },

  // render() creates the UI - can be async for lazy loading
  render: function (subject, context) {
    const div = document.createElement('div')
    div.innerHTML = `<h2>Custom view for ${subject.uri}</h2>`
    return div
  }
}
```

## Lazy-Loaded Pane (Recommended)

For better performance, use dynamic imports to load pane code on-demand:

```javascript
// lazy/myPane.js - Lightweight wrapper (always loaded)
import * as UI from 'solid-ui-jss'

const ns = UI.ns

export const myPane = {
  name: 'my-custom-pane',
  icon: UI.icons.iconBase + 'custom-icon.svg',

  // Sync label check - keep lightweight!
  label: function (subject, context) {
    const kb = context.session.store
    const types = kb.findTypeURIs(subject)

    if (types['http://example.com/MyType']) {
      return 'My Custom View'
    }
    return null
  },

  // Async render - loads full pane code on demand
  render: async function (subject, context) {
    // Dynamic import creates a separate webpack chunk
    const { render } = await import(
      /* webpackChunkName: "my-pane" */
      '../myPane/render.js'
    )
    return render(subject, context)
  },

  // Optional: create new instances
  mintNew: async function (context, options) {
    const { mintNew } = await import(
      /* webpackChunkName: "my-pane" */
      '../myPane/render.js'
    )
    return mintNew(context, options)
  },

  mintClass: ns.ex('MyType')
}
```

```javascript
// myPane/render.js - Full implementation (lazy loaded)
import * as UI from 'solid-ui-jss'
import { store } from 'solid-logic-jss'

export function render(subject, context) {
  const div = document.createElement('div')
  div.className = 'my-pane'

  // Use solid-ui widgets
  const header = UI.widgets.headerSection(subject, context)
  div.appendChild(header)

  // Query RDF data
  const kb = context.session.store
  const properties = kb.each(subject, null, null)

  // Build UI...
  const list = document.createElement('ul')
  properties.forEach(prop => {
    const li = document.createElement('li')
    li.textContent = prop.value
    list.appendChild(li)
  })
  div.appendChild(list)

  return div
}

export async function mintNew(context, options) {
  // Create a new instance of this type
  const newUri = options.newBase + 'new-thing.ttl'
  const subject = store.sym(newUri)

  // Add RDF triples
  const ins = []
  ins.push($rdf.st(subject, ns.rdf('type'), ns.ex('MyType'), subject.doc()))

  await store.updater.update([], ins)
  return subject
}
```

## Registering Your Pane

### Option 1: Bundle with solid-panes-jss

Add to `registerPanes.js`:

```javascript
import { myPane } from './lazy/myPane.js'

export function registerPanes(register) {
  // ... other panes
  register(myPane)
}
```

### Option 2: Register at runtime

```javascript
import { register } from 'solid-panes-jss'
import { myPane } from 'my-custom-pane'

register(myPane)
```

### Option 3: Load from URL (experimental)

```javascript
import { register } from 'solid-panes-jss'

// Load pane definition from remote source
async function loadRemotePane(url) {
  const module = await import(/* webpackIgnore: true */ url)
  register(module.default || module.pane)
}

loadRemotePane('https://example.com/panes/calendar-pane.mjs')
```

## Common Patterns

### Type-based matching

```javascript
label: function (subject, context) {
  const kb = context.session.store
  const types = kb.findTypeURIs(subject)

  // Match specific RDF types
  if (types[ns.schema('Event').uri]) return 'Event'
  if (types[ns.schema('Person').uri]) return 'Person'
  return null
}
```

### Predicate-based matching

```javascript
label: function (subject, context) {
  const kb = context.session.store

  // Match if subject has specific predicates
  if (kb.any(subject, ns.schema('startDate'))) {
    return 'Calendar Event'
  }
  return null
}
```

### Content-type matching

```javascript
label: function (subject, context) {
  const kb = context.session.store
  const contentType = kb.anyValue(subject, ns.httph('content-type'))

  if (contentType && contentType.includes('application/pdf')) {
    return 'PDF Viewer'
  }
  return null
}
```

### Container matching (for folders with specific content)

```javascript
label: function (subject, context) {
  const kb = context.session.store
  const types = kb.findTypeURIs(subject)

  if (!types[ns.ldp('Container').uri]) return null

  // Check if container has images
  const contents = kb.each(subject, ns.ldp('contains'))
  const hasImages = contents.some(item => {
    const itemTypes = kb.findTypeURIs(item)
    return itemTypes['http://purl.org/dc/terms/Image']
  })

  if (hasImages) return 'Photo Gallery'
  return null
}
```

## Using solid-ui Widgets

solid-ui provides many reusable widgets:

```javascript
import * as UI from 'solid-ui-jss'

function render(subject, context) {
  const div = document.createElement('div')

  // Forms
  const form = UI.widgets.appendForm(div, subject, formDoc, formType, context)

  // Buttons
  UI.widgets.button(div, 'Click me', () => console.log('clicked'))

  // ACL controls
  UI.aclControl.ACLControlBox5(subject, context, div)

  // Login status
  UI.authn.loginStatusBox(div, context)

  return div
}
```

## Testing Your Pane

1. Add to a local solid-panes-jss build
2. Run `npm start` in mashlib-jss
3. Navigate to a resource matching your `label()` criteria
4. Your pane should appear in the pane selector

## Publishing Your Pane

### As npm package

```json
{
  "name": "my-solid-pane",
  "main": "dist/index.js",
  "peerDependencies": {
    "solid-ui-jss": "^3.0.0",
    "solid-logic-jss": "^1.0.0",
    "rdflib": "^2.0.0"
  }
}
```

### As standalone file

Host a single .mjs file that exports your pane:

```javascript
// https://example.com/panes/my-pane.mjs
export const pane = {
  name: 'my-pane',
  label: (s, c) => { /* ... */ },
  render: (s, c) => { /* ... */ }
}
```

## Best Practices

1. **Keep label() lightweight** - It runs for every subject, so avoid heavy computation
2. **Use lazy loading** - Dynamic imports reduce initial bundle size
3. **Handle errors gracefully** - Wrap render logic in try/catch
4. **Support async data** - Use `kb.fetcher.load()` for remote data
5. **Use semantic HTML** - Accessibility matters
6. **Follow existing patterns** - Look at built-in panes for examples
