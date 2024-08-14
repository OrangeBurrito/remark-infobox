import type { Element, ElementContent } from 'hast'
import type { Handler } from 'mdast-util-to-hast';
import { u } from 'unist-builder';
import type { InfoboxNode, InfoboxRow, InfoboxRowKey, InfoboxRowValue } from './types.js';

enum InfoboxKeys {
    'title',
    'image',
    'caption'
}

const mdastInfoboxToHast: Handler = (state, node: InfoboxNode) => {
    const rows = state.all(node)
    const children: ElementContent[] = []
    for (let i = 0; i < rows.length; i++) {
        children.push(u('text', '\n\t'))
        children.push(rows[i] ?? u('text', ''))
    }
    children.push(u('text', '\n'))
    const result: Element = { type: 'element', tagName: 'table', children, properties: { id: 'infobox' } }
    return result
}

let accumulatedKeys: string[] = []
let currentParam: string = ''

const mdastInfoboxRowToHast: Handler = (state, node: InfoboxRow) => {
    const nodes = state.all(node)
    const children: ElementContent[] = []
    for (let i = 0; i < nodes.length; i++) {
        children.push(u('text', '\n\t\t'))
        children.push(nodes[i] ?? u('text', ''))
    }
    children.push(u('text', '\n\t'))
    return { type: 'element', tagName: 'tr', children, properties: { className: 'infobox-row'} } as Element
}

const mdastInfoboxRowKeyToHast: Handler = (state, node: InfoboxRowKey): Element | Element[] | undefined => {
    const nodes = state.all(node)
    const key = (nodes[0] as any).value

    if (accumulatedKeys.includes(key)) {
        throw new Error('Duplicate key in infobox')
    }
    if (key in InfoboxKeys) {
        if (key === InfoboxKeys[InfoboxKeys.caption]) {
            if (currentParam !== InfoboxKeys[InfoboxKeys.image]) {
                throw new Error('Caption must come directly after an image')
            }
        }
        accumulatedKeys.push(key)
        currentParam = key
        return undefined
    }
    currentParam = ''

    let spaced = key.split('_').join(' ')
    // @ts-ignore
    nodes[0].value = spaced.charAt(0).toUpperCase() + spaced.slice(1)

    return { type: 'element', tagName: 'th', children: nodes, properties: { className: 'key' } }
}

const mdastInfoboxRowValueToHast: Handler = (state, node: InfoboxRowValue) => {
    if (currentParam.length > 0) {
        const nodes = state.all(node)
        // @ts-ignore
        if (currentParam === InfoboxKeys[InfoboxKeys.image] && nodes[0].tagName !== 'img') {
            nodes[0] = {
                type: 'element',
                tagName: 'img',
                children: [],
                // @ts-ignore
                properties: { src: nodes[0].value, alt: nodes[0].value }
            }
        }
        return { type: 'element', tagName: 'th', children: nodes, properties: { id: currentParam, colspan: 2 } }
    }
    return { type: 'element', tagName: 'td', children: state.all(node), properties: {} }
}

export const infoboxHastHandlers = {
    ['infobox']: mdastInfoboxToHast,
    ['infoboxRow']: mdastInfoboxRowToHast,
    ['infoboxRowKey']: mdastInfoboxRowKeyToHast,
    ['infoboxRowValue']: mdastInfoboxRowValueToHast
}