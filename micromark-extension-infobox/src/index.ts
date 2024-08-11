import type { Code, Effects, State, Extension, TokenizeContext } from "micromark-util-types";
import { asciiAlpha, markdownLineEnding, markdownSpace } from "micromark-util-character";
import { constants, types } from "micromark-util-symbol";
import { factorySpace } from "micromark-factory-space";
import { tokenTypes } from "./types.js";

function infoboxTokenizer(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    const matchKeyword = (effects: Effects, ok: State, keyword: string): State => {
        let string: string[] = []
        const match: State = (code: Code) => {
            if (string.length < keyword.length && asciiAlpha(code)) {
                string.push(String.fromCharCode(code || 0))
                effects.consume(code)
                return match
            }
            if (string.join('') !== keyword) {
                return nok(code)
            }
            return ok(code)
        }
        return match
    }

    const parseMarker = (effects: Effects, marker: number, ok: State): State => {
        const inner: State = (code: Code) => {
                effects.consume(code)
                if (code !== marker) return nok(code)
                return ok
        }
        return inner
    }

    const start: State = (code: Code) => {
        effects.enter(tokenTypes.infobox)
        effects.enter(tokenTypes.infoboxMarker)
        effects.consume(code)
        return parseMarker(effects, 123, startText)
    }

    const startText: State = (code: Code) => {
        if (markdownSpace(code)) {
            return factorySpace(effects, startText, types.linePrefix)
        }
        if (!markdownLineEnding(code)) {
            return matchKeyword(effects, startText, 'infobox')
        }
        effects.exit(tokenTypes.infoboxMarker)
        effects.enter(types.lineEnding)
        effects.consume(code)
        effects.exit(types.lineEnding)
        return inside
    }

    const beforeRowStart: State = (code: Code) => {
        if (markdownSpace(code)) {
            return factorySpace(effects, beforeRowStart, types.linePrefix)
        }
        effects.enter(tokenTypes.infoboxRow)
        effects.enter(tokenTypes.infoboxRowKey)
        effects.enter(types.chunkText, {contentType: constants.contentTypeText})
        return parseRow
    }

    let atRowDivider = false
    const parseRow: State = (code: Code) => {
        if (markdownLineEnding(code)) {
            effects.exit(types.chunkText)
            effects.exit(tokenTypes.infoboxRowValue)
            effects.exit(tokenTypes.infoboxRow)
            effects.enter(types.lineEnding)
            effects.consume(code)
            effects.exit(types.lineEnding)
            return inside
        }
        if (code === 61) {
            effects.exit(types.chunkText)
            effects.exit(tokenTypes.infoboxRowKey)
            effects.consume(code)
            atRowDivider = true
            return factorySpace(effects, parseRow, types.linePrefix)
        }
        if (atRowDivider) {
            effects.enter(tokenTypes.infoboxRowValue)
            effects.enter(types.chunkText, {contentType: constants.contentTypeText})
            atRowDivider = false
        }
        effects.consume(code)
        return parseRow
    }

    const inside: State = (code: Code) => {
        if (code === 125) {
            effects.enter(tokenTypes.infoboxMarker)
            effects.consume(code)
            effects.exit(tokenTypes.infoboxMarker)
            effects.exit(tokenTypes.infobox)
            return parseMarker(effects, 125, ok)
        }
        if (code !== 124) {
            return nok(code)
        } else {
            effects.consume(code)
            return beforeRowStart
        }
    }
    return start
}

export function infobox(): Extension {
    return {flow: {123: {name: 'infobox', tokenize: infoboxTokenizer}}}
}