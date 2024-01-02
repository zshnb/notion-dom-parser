# Notion dom parser

English / [中文](https://github.com/zshnb/notion-dom-parser/blob/main/README.zh.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/notion-dom-parser.svg)](https://badge.fury.io/js/notion-dom-parser)

## Introduction

Notion-dom-parser is a JavaScript npm open-source project for parsing the DOM structure of Notion article pages and converting it into a tree structure. This is particularly useful for developers looking to programmatically handle Notion content.

## Installation

Install via npm:

```bash
npm install notion-dom-parser
```

## Usage

### CommonJS

```javascript
const parser = require('notion-dom-parser');
const html = '';
const result = parser.parse(html);
```

### ESM

```javascript
import parser from 'notion-dom-parser';
const html = '';
const result = parser.parse(html);
```

## Schema

Parser result is a tree-like array, each object is follow below structure

```typescript
type NotionNode = {
  type: string;
  children: NotionNode[];
  href?: string; // only when type is 'a', represent link of a
  text?: string; // only when type is 'text', represent content of text node
  olLevel?: number; // only when type is 'ol', represent list's level in nest relation
  ulLevel?: number; // only when type is 'ul', represent list's level in nest relation
};
```
Support types:
- h1
- h2
- h3
- p
- a
- bold
- italic
- ul
- ol
- image
- columnList
- quote
- callout
- code

## Example

- header block

```json
{
  "type": "h1",
  "children": [
    {
      "type": "text",
      "text": "一级标题"
    },
    {
      "type": "a",
      "children": [
        {
          "type": "text",
          "text": "链接"
        }
      ],
      "href": "/a8c83cfad753461585db3f063c24c13d?pvs=25"
    }
  ]
}
```

- paragraph block

```json
{
  "type": "p",
  "children": [
    {
      "type": "text",
      "text": "这里是正文，"
    },
    {
      "type": "a",
      "children": [
        {
          "type": "text",
          "text": "链接"
        }
      ],
      "href": "http://www.baidu.com/"
    },
    {
      "type": "text",
      "text": "会生成脚注，重点请"
    },
    {
      "type": "bold",
      "children": [
        {
          "type": "text",
          "text": "加粗，"
        }
      ]
    },
    {
      "type": "italic",
      "children": [
        {
          "type": "text",
          "text": "斜体，"
        }
      ]
    },
    {
      "type": "text",
      "text": "代码"
    },
    {
      "type": "p",
      "children": [
        {
          "type": "text",
          "text": "缩进"
        }
      ]
    }
  ]
}
```

- quote block

```json
{
  "type": "quote",
  "children": [
    {
      "type": "p",
      "children": [
        {
          "type": "text",
          "text": "这里是"
        },
        {
          "type": "bold",
          "children": [
            {
              "type": "text",
              "text": "引用"
            }
          ]
        }
      ]
    },
    {
      "type": "p",
      "children": [
        {
          "type": "text",
          "text": "拖进去的"
        }
      ]
    }
  ]
}
```

## Features and Advantages

- Fast Parsing: Efficiently converts Notion pages into tree structures.
- Easy Integration: Support CommonJS and ESM. Can be easily integrated into existing JavaScript projects.

## Contributing

Contributions via GitHub pull requests are welcome. Please ensure you follow the project's coding standards and contribution guidelines before submitting.

## License

This project is licensed under the MIT. For more information, please see the [LICENSE](https://github.com/zshnb/notion-dom-parser/blob/main/LICENSE) file.
