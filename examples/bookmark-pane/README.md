# Bookmark Pane Example

A complete example of a custom Solid pane that displays and manages bookmarks.

## Features

- Displays bookmarks with title, URL, and description
- Add new bookmarks
- Delete bookmarks
- Lazy-loaded for optimal bundle size

## File Structure

```
bookmark-pane/
├── README.md           # This file
├── lazy.js             # Lightweight wrapper (always loaded)
├── render.js           # Full implementation (lazy loaded)
└── styles.css          # Pane styles
```

## RDF Schema

Uses schema.org Bookmark type:

```turtle
@prefix schema: <http://schema.org/> .

<#bookmark1> a schema:Bookmark ;
    schema:name "Example Site" ;
    schema:url <https://example.com> ;
    schema:description "A great website" ;
    schema:dateCreated "2024-01-15" .
```

## Usage

### Register the pane

```javascript
import { register } from 'solid-panes-jss'
import { bookmarkPane } from './bookmark-pane/lazy.js'

register(bookmarkPane)
```

### Or use standalone

```html
<script type="module">
  import { bookmarkPane } from 'https://example.com/bookmark-pane/lazy.js'
  import { register } from 'solid-panes-jss'
  register(bookmarkPane)
</script>
```

## Matching Criteria

The pane activates when viewing:
- Resources with type `schema:Bookmark`
- Containers with `schema:Bookmark` items

## Development

1. Copy this folder to `solid-panes-jss/src/`
2. Add to `registerPanes.js`:
   ```javascript
   import { bookmarkPane } from './bookmark-pane/lazy.js'
   register(bookmarkPane)
   ```
3. Run `npm start` in mashlib-jss
4. Navigate to a bookmark resource
