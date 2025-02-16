// Type definitions for Quill 2.0
// Project: https://github.com/quilljs/quill/, http://quilljs.com
// Definitions by: Sumit <https://github.com/sumitkm>
//                 Guillaume <https://github.com/guillaume-ro-fr>
//                 James Garbutt <https://github.com/43081j>
//                 Aniello Falcone <https://github.com/AnielloFalcone>
//                 Mohammad Hossein Amri <https://github.com/mhamri>
//                 Marco Mantovani <https://github.com/TheLand>
//                 Ameer Hamoodi <https://github.com/AmeerHamoodi>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.9

import { Blot } from "parchment/dist/typings/blot/abstract/blot";
import Delta from 'quill-delta';

/**
 * A stricter type definition would be:
 *
 *   type DeltaOperation ({ insert: any } | { delete: number } | { retain: number }) & OptionalAttributes;
 *
 *  But this would break a lot of existing code as it would require manual discrimination of the union types.
 */
export type DeltaOperation = { insert?: any; delete?: number | undefined; retain?: number | undefined } & OptionalAttributes;
interface SourceMap {
    API: "api";
    SILENT: "silent";
    USER: "user";
}
export type Sources = "api" | "user" | "silent";

export interface Key {
    key: string | number;
    shortKey?: boolean | null | undefined;
    shiftKey?: boolean | null | undefined;
    altKey?: boolean | null | undefined;
    metaKey?: boolean | null | undefined;
    ctrlKey?: boolean | null | undefined;
}

export interface StringMap {
    [key: string]: any;
}

export interface OptionalAttributes {
    attributes?: StringMap | undefined;
}

export type TextChangeHandler = (delta: Delta, oldContents: Delta, source: Sources) => any;
export type SelectionChangeHandler = (range: RangeStatic, oldRange: RangeStatic, source: Sources) => any;
export type EditorChangeHandler =
    | ((name: "text-change", delta: Delta, oldContents: Delta, source: Sources) => any)
    | ((name: "selection-change", range: RangeStatic, oldRange: RangeStatic, source: Sources) => any);

export interface KeyboardStatic {
    addBinding(key: Key, callback: (range: RangeStatic, context: any) => void): void;
    addBinding(key: Key, context: any, callback: (range: RangeStatic, context: any) => void): void;
}

export type ClipboardMatcherCallback = (node: any, delta: Delta) => Delta;
export type ClipboardMatcherNode = string | number;

export interface ClipboardStatic {
    matchers: Array<[ClipboardMatcherNode, ClipboardMatcherCallback]>;
    convert(content?: { html?: string | undefined; text?: string | undefined }, formats?: StringMap): Delta;
    addMatcher(selectorOrNodeType: ClipboardMatcherNode, callback: ClipboardMatcherCallback): void;
    dangerouslyPasteHTML(html: string, source?: Sources): void;
    dangerouslyPasteHTML(index: number, html: string, source?: Sources): void;
}

export interface QuillOptionsStatic {
    debug?: string | boolean | undefined;
    modules?: StringMap | undefined;
    placeholder?: string | undefined;
    readOnly?: boolean | undefined;
    theme?: string | undefined;
    formats?: string[] | undefined;
    bounds?: HTMLElement | string | undefined;
    scrollingContainer?: HTMLElement | string | undefined;
    strict?: boolean | undefined;
}

export interface BoundsStatic {
    bottom: number;
    left: number;
    right: number;
    top: number;
    height: number;
    width: number;
}

export interface RangeStatic {
    index: number;
    length: number;
}

export class RangeStatic implements RangeStatic {
    constructor();
    index: number;
    length: number;
}

export interface EventEmitter {
    on(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    on(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    on(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    once(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    once(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    once(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    off(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    off(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    off(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
}

export class Quill implements EventEmitter {
    /**
     * Internal API
     */
    root: HTMLDivElement;
    clipboard: ClipboardStatic;
    scroll: Blot;
    keyboard: KeyboardStatic;
    constructor(container: string | Element, options?: QuillOptionsStatic);
    deleteText(index: number, length: number, source?: Sources): Delta;
    disable(): void;
    enable(enabled?: boolean): void;
    isEnabled(): boolean;
    getContents(index?: number, length?: number): Delta;
    getLength(): number;
    getText(index?: number, length?: number): string;
    insertEmbed(index: number, type: string, value: any, source?: Sources): Delta;
    insertText(index: number, text: string, source?: Sources): Delta;
    insertText(index: number, text: string, format: string, value: any, source?: Sources): Delta;
    insertText(index: number, text: string, formats: StringMap, source?: Sources): Delta;
    /**
     * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(index: number, html: string, source: Sources)
     */
    pasteHTML(index: number, html: string, source?: Sources): string;
    /**
     * @deprecated Remove in 2.0. Use clipboard.dangerouslyPasteHTML(html: string, source: Sources): void;
     */
    pasteHTML(html: string, source?: Sources): string;
    setContents(delta: Delta, source?: Sources): Delta;
    setText(text: string, source?: Sources): Delta;
    update(source?: Sources): void;
    updateContents(delta: Delta, source?: Sources): Delta;

    static readonly sources: SourceMap;

    format(name: string, value: any, source?: Sources): Delta;
    formatLine(index: number, length: number, source?: Sources): Delta;
    formatLine(index: number, length: number, format: string, value: any, source?: Sources): Delta;
    formatLine(index: number, length: number, formats: StringMap, source?: Sources): Delta;
    formatText(index: number, length: number, source?: Sources): Delta;
    formatText(index: number, length: number, format: string, value: any, source?: Sources): Delta;
    formatText(index: number, length: number, formats: StringMap, source?: Sources): Delta;
    formatText(range: RangeStatic, format: string, value: any, source?: Sources): Delta;
    formatText(range: RangeStatic, formats: StringMap, source?: Sources): Delta;
    getFormat(range?: RangeStatic): StringMap;
    getFormat(index: number, length?: number): StringMap;
    removeFormat(index: number, length: number, source?: Sources): Delta;

    blur(): void;
    focus(): void;
    getBounds(index: number, length?: number): BoundsStatic;
    getSelection(focus: true): RangeStatic;
    getSelection(focus?: false): RangeStatic | null;
    hasFocus(): boolean;
    setSelection(index: number, length: number, source?: Sources): void;
    setSelection(range: RangeStatic, source?: Sources): void;

    // static methods: debug, import, register, find
    static debug(level: string | boolean): void;
    static import(path: string): any;
    static register(path: string, def: any, suppressWarning?: boolean): void;
    static register(defs: StringMap, suppressWarning?: boolean): void;
    static find(domNode: Node, bubble?: boolean): Quill | any;

    addContainer(classNameOrDomNode: string | Node, refNode?: Node): any;
    getModule(name: string): any;

    // Blot interface is not exported on Parchment
    getIndex(blot: any): number;
    getLeaf(index: number): any;
    getLine(index: number): [any, number];
    getLines(index?: number, length?: number): any[];
    getLines(range: RangeStatic): any[];

    // EventEmitter methods
    on(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    on(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    on(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    once(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    once(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    once(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
    off(eventName: "text-change", handler: TextChangeHandler): EventEmitter;
    off(eventName: "selection-change", handler: SelectionChangeHandler): EventEmitter;
    off(eventName: "editor-change", handler: EditorChangeHandler): EventEmitter;
}

export default Quill;