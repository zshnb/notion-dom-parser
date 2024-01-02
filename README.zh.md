# Notion dom parser

[English](https://github.com/zshnb/notion-dom-parser) / 中文

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/notion-dom-parser.svg)](https://badge.fury.io/js/notion-dom-parser)

## 介绍

Notion-dom-parser 是一个用于解析Notion文章页面DOM结构并将其转换为树形结构的JavaScript npm开源项目。这对于希望以编程方式处理Notion内容的开发者特别有用。

## 安装

通过npm安装:

```bash
npm install notion-dom-parser
```

## 使用方法

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

## 结构

解析结果是树形数组，数组中每个对象都遵循以下结构

```typescript
type NotionNode = {
  type: string;
  children: NotionNode[];
  href?: string; // 只有type为'a'时才存在，表示链接地址
  text?: string; // 只有type为'text'时才存在，表示文本节点内容
  olLevel?: number; // 只有type为'ol'时才存在，表示列表在嵌套时的层级
  ulLevel?: number; // 只有type为'ul'时才存在，表示列表在嵌套时的层级
};
```

支持类型:
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

## 示例

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

## 功能和优势

- 快速解析：可以非常快速地将Notion页面转换为树形结构。
- 易于集成：支持CommonJS和ESM，可以轻松集成到现有的JavaScript项目中。

## 如何贡献

欢迎通过GitHub提交pull请求来贡献代码。在提交前，请确保遵循项目的代码规范和提交指南。## License

## 许可证

本项目采用MIT许可证。有关详细信息，请查看[LICENSE](https://github.com/zshnb/notion-dom-parser/blob/main/LICENSE)文件。
