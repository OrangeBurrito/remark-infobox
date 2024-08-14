import type { Processor } from 'unified';
import { infobox } from 'micromark-extension-infobox';
import { infoboxFromMarkdown} from 'mdast-util-infobox';

export default function remarkInfobox(this: Processor) {
    const data: any = this.data()

    const micromarkExtensions = data.micromarkExtensions ?? (data.micromarkExtensions = [])
    const fromMarkdownExtensions = data.fromMarkdownExtensions ?? (data.fromMarkdownExtensions = [])
  
    micromarkExtensions.push(infobox())
    fromMarkdownExtensions.push(infoboxFromMarkdown())
}