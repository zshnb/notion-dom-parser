"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var html_dom_parser_1 = __importDefault(require("html-dom-parser"));
var parser = {
    notionBlockClasses: [
        'notion-header-block',
        'notion-link-token',
        'notion-sub_header-block',
        'notion-sub_sub_header-block',
        'notion-text-block',
        'notion-enable-hover',
        'notion-quote-block',
        'notion-callout-block',
        'notion-code-block',
        'notion-divider-block',
        'notion-bulleted_list-block',
        'notion-numbered_list-block',
        'notion-image-block',
        'notion-table-block',
        'notion-column_list-block',
        'notion-bookmark-block',
    ],
    parse: function (html, mergeList) {
        var dom = (0, html_dom_parser_1.default)(html);
        var result = [];
        for (var _i = 0, dom_1 = dom; _i < dom_1.length; _i++) {
            var element = dom_1[_i];
            try {
                result.push(this.doParse(element, { ulLevel: 0, olLevel: 0 }));
            }
            catch (e) {
                console.trace(e);
            }
        }
        if (mergeList) {
            this.mergeListItems(result, 'ol');
            this.mergeListItems(result, 'ul');
        }
        return result;
    },
    doParse: function (element, params) {
        var _a, _b;
        if (element.attribs.role === 'img') {
            return this.parseText(element.children[0]);
        }
        var classes = element.attribs.class;
        if (classes.indexOf('notion-header-block') !== -1) {
            var children = [];
            this.parseHeader(element, children);
            return {
                type: 'h1',
                children: children,
            };
        }
        if (classes.indexOf('notion-sub_header-block') !== -1) {
            var children = [];
            this.parseHeader(element, children);
            return {
                type: 'h2',
                children: children,
            };
        }
        if (classes.indexOf('notion-sub_sub_header-block') !== -1) {
            var children = [];
            this.parseHeader(element, children);
            return {
                type: 'h3',
                children: children,
            };
        }
        if (classes.indexOf('notion-text-block') !== -1) {
            var children = [];
            this.parseTextBlock(element, children);
            return {
                type: 'p',
                children: children,
            };
        }
        if (classes.indexOf('notion-link-token') !== -1) {
            var children = [];
            this.parseLink(element, children);
            var href = element.attribs.href;
            return {
                type: 'a',
                children: children,
                href: href,
            };
        }
        if (classes.indexOf('notion-bookmark-block') !== -1) {
            var children = [];
            this.parseBookmark(element, children);
            return {
                type: 'bookmark',
                children: children,
            };
        }
        if (classes.indexOf('notion-enable-hover') !== -1) {
            var style = element.attribs.style;
            var children = [];
            if (style.indexOf('font-weight') !== -1) {
                this.parseBold(element, children);
                return {
                    type: 'bold',
                    children: children,
                };
            }
            else if (style === 'font-style:italic') {
                this.parseItalic(element, children);
                return {
                    type: 'italic',
                    children: children,
                };
            }
            else {
                if (((_b = (_a = element.children[0]) === null || _a === void 0 ? void 0 : _a.attribs) === null || _b === void 0 ? void 0 : _b.role) === 'img') {
                    this.parseEmoji(element, children);
                    return {
                        type: 'text',
                        text: children[0].text,
                        children: [],
                    };
                }
                else if (style.indexOf('background-color') !== -1) {
                    this.parseInlineCode(element, children);
                    return {
                        type: 'inlineCode',
                        children: children,
                    };
                }
                else {
                    return this.parseText(element.children[0]);
                }
            }
        }
        if (classes.indexOf('notion-quote-block') !== -1) {
            var children = [];
            this.parseQuote(element, children);
            return {
                type: 'quote',
                children: children,
            };
        }
        if (classes.indexOf('notion-callout-block') !== -1) {
            var children = [];
            this.parseCalloutBlock(element, children);
            return {
                type: 'callout',
                children: children,
            };
        }
        if (classes.indexOf('notion-code-block') !== -1) {
            var children = [];
            this.parseCode(element, children);
            return {
                type: 'code',
                children: children,
            };
        }
        if (classes.indexOf('notion-divider-block') !== -1) {
            return this.parseDivider();
        }
        if (classes.indexOf('notion-bulleted_list-block') !== -1) {
            var children = [];
            var ulLevel = (params === null || params === void 0 ? void 0 : params.ulLevel) === undefined ? 0 : params.ulLevel;
            var olLevel = (params === null || params === void 0 ? void 0 : params.olLevel) === undefined ? 0 : params.olLevel;
            this.parseList(element, children, ulLevel, olLevel, 'ul');
            return {
                type: 'ul',
                children: children,
                ulLevel: ulLevel,
            };
        }
        if (classes.indexOf('notion-numbered_list-block') !== -1) {
            var children = [];
            var ulLevel = (params === null || params === void 0 ? void 0 : params.ulLevel) === undefined ? 0 : params.ulLevel;
            var olLevel = (params === null || params === void 0 ? void 0 : params.olLevel) === undefined ? 0 : params.olLevel;
            this.parseList(element, children, ulLevel, olLevel, 'ol');
            return {
                type: 'ol',
                children: children,
                olLevel: olLevel,
            };
        }
        if (classes.indexOf('notion-image-block') !== -1) {
            var children = [];
            this.parseImageBlock(element, children);
            return {
                type: 'image',
                children: children,
            };
        }
        if (classes.indexOf('notion-table-block') !== -1) {
            var children = [];
            this.parseTable(element, children);
            return {
                type: 'table',
                children: children,
            };
        }
        if (classes.indexOf('notion-column_list-block') !== -1) {
            var children = [];
            this.parseColumnList(element, children);
            return {
                type: 'columnList',
                children: children,
            };
        }
        throw new Error('unsupported notion block');
    },
    parseHeader: function (element, children) {
        var _this = this;
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                if (c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        children.push(this.doParse(c));
                    }
                    else {
                        this.parseHeader(c, children);
                    }
                }
                else {
                    this.parseHeader(c, children);
                }
            }
        }
    },
    parseTextBlock: function (element, children) {
        var _this = this;
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                if (c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        var intendElement = this.doParse(c);
                        if (intendElement) {
                            children.push(intendElement);
                        }
                    }
                    else {
                        this.parseTextBlock(c, children);
                    }
                }
                else {
                    this.parseTextBlock(c, children);
                }
            }
        }
    },
    parseLink: function (element, children) {
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                this.parseLink(c, children);
            }
        }
    },
    parseBookmark: function (element, children) {
        if (element.name === 'a') {
            children.push({
                type: 'a',
                children: [],
                href: element.attribs.href,
            });
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                this.parseBookmark(c, children);
            }
        }
    },
    parseBold: function (element, children) {
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.type === 'text') {
                children.push(this.parseText(node));
            }
            else {
                this.parseBold(node, children);
            }
        }
    },
    parseItalic: function (element, children) {
        children.push(this.parseText(element.children[0]));
    },
    parseInlineCode: function (element, children) {
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var node = _a[_i];
            if (node.type === 'text') {
                children.push(this.parseText(node));
            }
            else {
                children.push(this.doParse(node));
            }
        }
    },
    parseEmoji: function (element, children) {
        children.push(this.parseText(element.children[0].children[0]));
    },
    parseQuote: function (element, children) {
        var _this = this;
        // 使得同一个文本块下的文本在一个p块里，不会让加粗，链接等块出现换行
        if (element.attribs.class === 'notranslate') {
            var p = {
                type: 'p',
                children: [],
            };
            children.push(p);
            children = p.children;
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                if (c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        appendNonEmptyChildren(children, this.doParse.bind(this, c));
                    }
                    else {
                        this.parseQuote(c, children);
                    }
                }
                else {
                    this.parseQuote(c, children);
                }
            }
        }
    },
    parseCalloutBlock: function (element, children) {
        var _this = this;
        // 使得同一个文本块下的文本在一个p块里，不会让加粗，链接等块出现换行
        if (element.attribs.class === 'notranslate') {
            var p = {
                type: 'p',
                children: [],
            };
            children.push(p);
            children = p.children;
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else if (c.attribs.class === 'notion-emoji') {
                children.push({
                    type: 'text',
                    children: [],
                    text: c.attribs.alt,
                });
            }
            else {
                if (c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        appendNonEmptyChildren(children, this.doParse.bind(this, c));
                    }
                    else {
                        this.parseCalloutBlock(c, children);
                    }
                }
                else {
                    this.parseCalloutBlock(c, children);
                }
            }
        }
    },
    parseCode: function (element, children) {
        if (element.type === 'text') {
            return;
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.hasOwnProperty('attribs') &&
                c.attribs.hasOwnProperty('class')) {
                var classes = c.attribs.class;
                if (classes.split(' ').some(function (it) { return it === 'line-numbers'; })) {
                    var node = c.children[0];
                    for (var _b = 0, _c = node.children; _b < _c.length; _b++) {
                        var n = _c[_b];
                        // code block 在不同语言时的结构不一样，plain text时没有span包裹，直接解析文本即可
                        if (n.type === 'text') {
                            children.push(this.parseText(n));
                        }
                        else {
                            children.push(this.parseText(n.children[0]));
                        }
                    }
                }
                else {
                    this.parseCode(c, children);
                }
            }
            else {
                this.parseCode(c, children);
            }
        }
    },
    parseDivider: function () {
        return {
            type: 'divider',
            children: [],
        };
    },
    parseList: function (element, children, ulLevel, olLevel, currentType) {
        var _this = this;
        // 如果遇到列表的文本，需要用li包裹所有文本，确保在render的时候不会被识别成2个block，从而导致换行
        if (element.attribs.class === 'notranslate') {
            // 使得同一个文本块下的文本在一个p块里，不会让加粗，链接等块出现换行
            if (!children.some(function (it) { return it.type === 'li'; })) {
                var li = {
                    type: 'li',
                    children: [],
                };
                children.push(li);
                children = li.children;
            }
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                if (c.hasOwnProperty('attribs') &&
                    c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        var _olLevel = olLevel, _ulLevel = ulLevel;
                        /*
                         * 当currentType和嵌套列表类型一致时，对应的列表level才需要增加
                         * */
                        if (classes.indexOf('notion-bulleted_list-block') !== -1) {
                            if (currentType === 'ul') {
                                _ulLevel += 1;
                            }
                        }
                        else if (classes.indexOf('notion-numbered_list-block')) {
                            if (currentType === 'ol') {
                                _olLevel += 1;
                            }
                        }
                        appendNonEmptyChildren(children, this.doParse.bind(this, c, {
                            ulLevel: _ulLevel,
                            olLevel: _olLevel,
                        }));
                    }
                    else {
                        this.parseList(c, children, ulLevel, olLevel, currentType);
                    }
                }
                else {
                    this.parseList(c, children, ulLevel, olLevel, currentType);
                }
            }
        }
    },
    parseImageBlock: function (element, children) {
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.name === 'img') {
                children.push(this.parseImage(c));
            }
            else if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                this.parseImageBlock(c, children);
            }
        }
    },
    parseTable: function (element, children) {
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.name === 'tbody') {
                for (var _b = 0, _c = c.children; _b < _c.length; _b++) {
                    var tr = _c[_b];
                    var trChildren = [];
                    for (var _d = 0, _e = tr.children; _d < _e.length; _d++) {
                        var td = _e[_d];
                        var tdObject = {
                            type: 'td',
                            children: [],
                        };
                        this.parseTd(td, tdObject);
                        trChildren.push(tdObject);
                    }
                    children.push({
                        type: 'tr',
                        children: trChildren,
                    });
                }
            }
            else {
                this.parseTable(c, children);
            }
        }
    },
    parseTd: function (element, tdObject) {
        var _this = this;
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                tdObject.children.push(this.parseText(c));
            }
            else {
                if (c.hasOwnProperty('attribs') &&
                    c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        appendNonEmptyChildren(tdObject.children, this.doParse.bind(this, c));
                    }
                    else {
                        this.parseTd(c, tdObject);
                    }
                }
                else {
                    this.parseTd(c, tdObject);
                }
            }
        }
    },
    parseColumnList: function (element, children) {
        var _this = this;
        if (element.hasOwnProperty('attribs') &&
            (element.attribs.class || '').indexOf('notion-column-block') !== -1) {
            var columnBlock = {
                type: 'columnBlock',
                children: [],
            };
            children.push(columnBlock);
            children = columnBlock.children;
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.type === 'text') {
                children.push(this.parseText(c));
            }
            else {
                if (c.hasOwnProperty('attribs') &&
                    c.attribs.hasOwnProperty('class')) {
                    var classes = c.attribs.class;
                    if (classes
                        .split(' ')
                        .some(function (it) { return _this.notionBlockClasses.indexOf(it) !== -1; })) {
                        appendNonEmptyChildren(children, this.doParse.bind(this, c));
                    }
                    else {
                        this.parseColumnList(c, children);
                    }
                }
                else {
                    this.parseColumnList(c, children);
                }
            }
        }
    },
    parseImage: function (element) {
        return {
            type: 'image',
            children: [],
            href: element.attribs.src,
        };
    },
    parseText: function (element) {
        return {
            type: 'text',
            children: [],
            text: element.data,
        };
    },
    /*
     * 由于notion的列表没有维持嵌套结构，每个列表项都是单独的block，所以需要把单独的列表项转换成
     * 嵌套的结构，相邻的同一级的ol|ul，需要把除了第一个，其他所有的children放进第一个ol的children，然后
     * 对第一个ol的children递归执行相同逻辑
     * */
    mergeListItems: function (items, type) {
        var _a;
        var firstOlIndex = -1;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.type === type) {
                // 第一个ol
                if (firstOlIndex === -1) {
                    firstOlIndex = i;
                }
                else {
                    (_a = items[firstOlIndex].children).push.apply(_a, item.children);
                    items.splice(i, 1);
                    i--; // Adjust the index after removal
                }
            }
            else {
                // 不是连续的了，递归处理当前连续的，然后继续处理不连续的
                if (firstOlIndex !== -1 &&
                    items[firstOlIndex].children &&
                    items[firstOlIndex].children.length > 0) {
                    this.mergeListItems(items[firstOlIndex].children, 'ul');
                    this.mergeListItems(items[firstOlIndex].children, 'ol');
                }
                firstOlIndex = -1;
            }
        }
        // 如果只有一个列表项，处理它的嵌套列表
        if (firstOlIndex !== -1 &&
            items[firstOlIndex].children &&
            items[firstOlIndex].children.length > 0) {
            this.mergeListItems(items[firstOlIndex].children, 'ul');
            this.mergeListItems(items[firstOlIndex].children, 'ol');
        }
    },
};
function appendNonEmptyChildren(array, fn) {
    var result = fn();
    // 防止加入空的节点，像divider没有children的可以加入
    if (!result.hasOwnProperty('children') || result.children.length > 0) {
        array.push(result);
    }
}
exports.default = parser;
