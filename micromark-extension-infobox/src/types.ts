export const tokenTypes = {
    infobox: 'infobox' as const,
    infoboxMarker: 'infoboxMarker' as const,
    infoboxRow: 'infoboxRow' as const,
    infoboxRowKey: 'infoboxRowKey' as const,
    infoboxRowValue: 'infoboxRowValue' as const
}

declare module 'micromark-util-types' {
    interface TokenTypeMap {
        infobox: 'infobox',
        infoboxMarker: 'infoboxMarker',
        infoboxRow: 'infoboxRow',
        infoboxRowKey: 'infoboxRowKey',
        infoboxRowValue: 'infoboxRowValue'
    }
}