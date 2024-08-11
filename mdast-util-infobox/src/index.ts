import type { CompileContext, Token } from 'mdast-util-from-markdown'
import { InfoboxNode, InfoboxRow, InfoboxRowKey, InfoboxRowValue } from './types.js'

declare module 'mdast' {
    interface RootContentMap {
        infoboxNode: InfoboxNode,
        infoboxRowNode: InfoboxRow,
        infoboxRowKey: InfoboxRowKey,
        infoboxRowValue: InfoboxRowValue
    }

    interface PhrasingContentMap {
        infoboxRowNode: InfoboxRow,
        infoboxRowKey: InfoboxRowKey,
        infoboxRowValue: InfoboxRowValue
    }
}

declare module 'mdast-util-from-markdown' {
    interface ConstructNameMap {
        infobox: 'infobox',
        infoboxRow: 'infoboxRow',
        infoboxRowKey: 'infoboxRowKey',
        infoboxRowValue: 'infoboxRowValue'
    }
}

export function infoboxFromMarkdown() {
    return {
        enter: {
            infobox: enterInfobox,
            infoboxRow: enterInfoboxRow,
            infoboxRowKey: enterInfoboxRowKey,
            infoboxRowValue: enterInfoboxRowValue
        },
        exit: {
            infobox: exitToken,
            infoboxRow: exitToken,
            infoboxRowKey: exitToken,
            infoboxRowValue: exitToken
        },
    }
}

export * from './hast.js'

function enterInfobox(this: CompileContext, token: Token) {
    this.enter({type: 'infobox', children: []}, token)
}

function enterInfoboxRow(this: CompileContext, token: Token) {
    this.enter({type: 'infoboxRow', children: []}, token)
}

function enterInfoboxRowKey(this: CompileContext, token: Token) {
    this.enter({type: 'infoboxRowKey', children: []}, token)
}

function enterInfoboxRowValue(this: CompileContext, token: Token) {
    this.enter({type: 'infoboxRowValue', children: []}, token)
}

function exitToken(this: CompileContext, token: Token) {
    this.exit(token)
}