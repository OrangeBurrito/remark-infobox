import type { Parent, PhrasingContent } from 'mdast'

export interface InfoboxNode extends Parent {
    type: 'infobox',
    children: InfoboxRow[]
}

export interface InfoboxRow extends Parent {
    type: 'infoboxRow',
    children: PhrasingContent[]
}

export interface InfoboxRowKey extends Parent {
    type: 'infoboxRowKey',
    children: PhrasingContent[]
}

export interface InfoboxRowValue extends Parent {
    type: 'infoboxRowValue',
    children: PhrasingContent[]
}