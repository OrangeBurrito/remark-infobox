# remark-infobox

A remark plugin to support [Mediawiki-style infoboxes](https://en.wikipedia.org/wiki/Infobox#Wikipedia). Uses `micromark-extension-infobox` and `mdast-util-infobox` to tokenize then convert the markdown into an AST for remark to parse.

## Syntax
Infobox syntax consists of rows of key/value pairs prepended by a `|` symbol, and wrapped between curly bracket containers. The container top must contain the word `infobox`.

Keys must be lowercased and use underscores (not dashes) for spaces.
Keys can be of reserved keywords that will render differently, those of which include: `title, image, caption`

Nested markdown is supported inside row values, e.g. italics, bold, images and links. It also works with plugins like [remark-wiki-link](https://github.com/landakram/remark-wiki-link).

```md
# Test Page

{{ infobox
| title = Kingdom of Loathing
| image = kingdom_of_loathing_logo.png
| caption = The *Kingdom of Loathing* logo.
| developer = [[Asymmetric Publications]]
| designer = Zack "Jick" Johnson
| website = [https://www.kingdomofloathing.com](https://www.kingdomofloathing.com)
| release_date = 2003-02-10
}}

## Subheader
Other, unrelated markdown below
```

## Install
Install `remark-infobox` on `npm`.
```sh
npm install remark-infobox
```

## Usage
```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import infobox from 'remark-infobox';
import { infoboxHastHandlers } from 'mdast-util-infobox';

const markdown = 'Markdown that contains an infobox'
const html = await unified()
    .use(remarkParse)
    .use(remarkInfobox)
    .use(remarkRehype, {
        handlers: {
            ...infoboxHastHandlers
        }
    })
    .use(rehypeStringify)
    .process(markdown)
```