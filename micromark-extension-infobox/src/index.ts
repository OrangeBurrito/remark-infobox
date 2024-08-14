import type { Code, Effects, State, Extension, TokenizeContext } from "micromark-util-types";
import { asciiAlpha, markdownLineEnding, markdownSpace } from "micromark-util-character";
import { constants, types } from "micromark-util-symbol";
import { factorySpace } from "micromark-factory-space";
import { tokenTypes } from "./types.js";

export const enum InfoboxKeys {
    'title',
    'image',
    'caption'
}

function infoboxTokenizer(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    const parseMarker = (effects: Effects, marker: number, ok: State, exit = false): State => {
        const inner: State = (code: Code) => {
            if (code !== marker) return nok(code)
            effects.consume(code)
            effects.exit(tokenTypes.infoboxMarker)
            if (exit) effects.exit(tokenTypes.infobox)
            return ok
        }
        return inner
    }

    const matchKeyword = (effects: Effects, ok: State, keyword: string): State => {
        let text: string[] = []

        const start: State = (code: Code) => {
            effects.enter(types.chunkString)
            return match(code)
        }
        const match: State = (code: Code) => {
            if (text.length < keyword.length && asciiAlpha(code)) {
                text.push(String.fromCharCode(code || 0))
                effects.consume(code)
                return match
            }
            effects.exit(types.chunkString)
            if (text.join('') !== keyword)  return nok(code)
            return ok(code)
        }

        return start
    }

    const start = (code: Code) => {
        effects.enter(tokenTypes.infobox)
        effects.enter(tokenTypes.infoboxMarker)
        effects.consume(code)
        return parseMarker(effects, 123, textStart)
    }

    const textStart = (code: Code) => {
        if (markdownSpace(code)) {
            return factorySpace(effects, textStart, types.whitespace)(code)
        }
        if (!markdownLineEnding(code)) {
            return matchKeyword(effects, textStart, 'infobox')(code)
        }
        effects.enter(types.lineEnding)
        effects.consume(code)
        effects.exit(types.lineEnding)
        effects.enter(tokenTypes.infoboxRow)
        return inside
    }

    
    let key = ''
    const rowStart: State = (code: Code) => {
        effects.enter(tokenTypes.infoboxRowKey)
        effects.enter(types.chunkText, {contentType: constants.contentTypeText})
        effects.consume(code)
        key += String.fromCharCode(code)
        return rowKey
    }
    
    const rowKey = (code: Code) => {
        if (code === 61) {
            effects.exit(types.chunkText)
            effects.exit(tokenTypes.infoboxRowKey)
            effects.enter(tokenTypes.infoboxRowValue)
            effects.consume(code)
            return factorySpace(effects, rowValueStart, types.whitespace)
        }
        if (!markdownSpace(code)) {
            key += String.fromCharCode(code)
        }
        effects.consume(code)
        return rowKey
    }

    const rowValueStart = (code: Code) => {
        if (key in InfoboxKeys) {
            effects.enter(types.chunkString, {contentType: constants.contentTypeString})
        } else {
            effects.enter(types.chunkText, {contentType: constants.contentTypeText})
        }
        return rowValue(code)
    }

    const rowValue = (code: Code) => {
        if (!markdownLineEnding(code)) {
            effects.consume(code)
            return rowValue
        }
        if (key in InfoboxKeys) {
            effects.exit(types.chunkString)
        } else {
            effects.exit(types.chunkText)
        }
        key = ''
        effects.exit(tokenTypes.infoboxRowValue)
        effects.exit(tokenTypes.infoboxRow)
        effects.enter(types.lineEnding)
        effects.consume(code)
        effects.exit(types.lineEnding)
        effects.enter(tokenTypes.infoboxRow)
        return inside
    }

    const inside = (code: Code) => {
        if (code === 125) {
            effects.consume(code)
            effects.exit(tokenTypes.infoboxRow)
            effects.enter(tokenTypes.infoboxMarker)
            return parseMarker(effects, 125, ok, true)
        }
        if (code === 124) {
            effects.consume(code)
            return factorySpace(effects, rowStart, types.whitespace)
        } 
        effects.consume(code)
        return inside
    }

    return start
}

function infobox(): Extension {
    return {flow: {123: {name: 'infobox', tokenize: infoboxTokenizer}}}
}

export default infobox