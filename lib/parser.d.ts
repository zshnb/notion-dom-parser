import { Element, Text } from 'html-dom-parser';
export type NotionNode = {
    type: string;
    children: NotionNode[];
    text?: string;
    href?: string;
    ulLevel?: number;
    olLevel?: number;
};
export type ParseParams = {
    ulLevel: number;
    olLevel: number;
};
declare const parser: {
    notionBlockClasses: string[];
    parse: (html: string, mergeList: boolean) => NotionNode[];
    doParse: (element: Element, params?: ParseParams) => NotionNode;
    parseHeader(element: Element, children: NotionNode[]): void;
    parseTextBlock(element: Element, children: NotionNode[]): void;
    parseLink(element: Element, children: NotionNode[]): void;
    parseBookmark(element: Element, children: NotionNode[]): void;
    parseBold(element: Element, children: NotionNode[]): void;
    parseItalic(element: Element, children: NotionNode[]): void;
    parseInlineCode(element: Element, children: NotionNode[]): void;
    parseEmoji(element: Element, children: NotionNode[]): void;
    parseQuote(element: Element, children: NotionNode[]): void;
    parseCalloutBlock(element: Element, children: NotionNode[]): void;
    parseCode(element: Element | Text, children: NotionNode[]): void;
    parseDivider(): NotionNode;
    parseList(element: Element, children: NotionNode[], ulLevel: number, olLevel: number, currentType: 'ol' | 'ul'): void;
    parseImageBlock(element: Element, children: NotionNode[]): void;
    parseTable(element: Element, children: NotionNode[]): void;
    parseTd(element: Element, tdObject: NotionNode): void;
    parseColumnList(element: Element, children: NotionNode[]): void;
    parseImage(element: Element): NotionNode;
    parseText(element: Text): NotionNode;
    mergeListItems(items: NotionNode[], type: 'ol' | 'ul'): void;
};
export default parser;
