import { infoboxHastHandlers } from "mdast-util-infobox"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import remarkInfobox from "remark-infobox"

const defaultContent = "Put content here\n{{ infobox \n| title = New Article \n| image = someimage.png \n| caption = a little caption \n| value1 = some value \n| value2 = [strangelink](https://orangeburrito.com) \n}}\n\nThe below header is for the Table of Contents\n## Contents\n\n## First Header\nSome content\n\n## Second Header"


const data =  await unified()
    .use(remarkParse)
    .use(remarkInfobox)
    .use(remarkRehype, {
        handlers: {
            ...infoboxHastHandlers
        }
    })
    .use(rehypeStringify)
    .process(defaultContent)

console.log(data)