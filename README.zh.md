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

## 功能和优势

- 快速解析：可以非常快速地将Notion页面转换为树形结构。
- 易于集成：支持CommonJS和ESM，可以轻松集成到现有的JavaScript项目中。

## 如何贡献

欢迎通过GitHub提交pull请求来贡献代码。在提交前，请确保遵循项目的代码规范和提交指南。## License

## 许可证

本项目采用MIT许可证。有关详细信息，请查看LICENSE文件。
