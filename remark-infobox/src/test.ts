import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkInfobox from '.'
import { infoboxHastHandlers } from 'mdast-util-infobox';

const markdown = `
# Test Page

{{ infobox
| title = Kingdom of Loathing
| image = *boldthing*yeah
| caption = The *Kingdom of Loathing* logo.
| developer = [[Asymmetric Publications]]  
| designer = Zack "Jick" Johnson
| website = [https://www.kingdomofloathing.com](https://www.kingdomofloathing.com)
| release_date = 2003-02-10
}}
`

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

console.log(html.value)