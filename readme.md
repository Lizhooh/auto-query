

## auto-query

<img src="https://img.shields.io/badge/auto--query-build-brightgreen.svg" style="width: auto; height: auto"/> <img src="https://img.shields.io/npm/v/auto-query.svg" style="width: auto; height: auto"/>

`auto-query` 是一个基于 `cheerio` 实现的自动查询 DOM 节点数据的工具函数。使用 `auto-query` 非常简单，只需要定义 schema 并且载入 html 即可，`auto-query` 会帮你解析出对于的数据结构。

> Nodejs > 8.0，目前为 1.5.0 版本

### install

```js
yarn add auto-query
```

### api
`select` 和 `data` 为特定的属性名称，当一个对象里有 select 和 data 属性时，会被判定为此对象为解析数据的对象。

> autoQuery(html, schema);

```js
const schema = {
    title: {
        select: String,                   // CSS 选择器
        data: String | Function | Array,  // 数据项，一般为回调函数，参数为 $el
    }
};

autoQuery(html, schema);                  // 返回一个数据集
```

### convenient function
`auto-query` 提供了一些便捷函数供使用。

- `#text` 等效于 $el.text();
- `#html` 等效于 $el.html();
- `#val` 等效于 $el.val();
- `#data` 等效于 $el.data();
- `@attr` 等效于 $el.attr('attr');

例如，获取 `<a>` 的 href，可以使用 `@href`：

```js
const schema = {
    url: {
        select: '.name > a',
        data: '@href',
    },
};
```

如果字段为字符串，且 `$` 开头，将识别为选择器，并且返回元素的 text，这可以简化一些代码的编写。

例如 title1、title2、title3 是等效的。

```js
const schema = {
    title1: '$ .title',
    title2: {
        select: '.title',
        data: $el => $el.text(),
    },
    title3: {
        select: '.title',
        data: '#text',
    },
};
```

此外还提供了一些便捷的属性使用，对应的是 String/Array 的操作函数，如果函数参数为空，则对应的值为布尔值，否则为参数数组。。执行的顺序是按照，编写的属性顺序。

- String
    - `trim`
    - `number` 尝试把 string 转化 number。
    - `lower`
    - `upper`
    - `reverse`
    - `slice`
    - `substr`
    - `concat`
    - `match`
    - `replace`
    - `repeat`
    - `split`
- Array
    - `reverse`
    - `slice`
    - `concat`
    - `fill`
    - `join`
    - `splice`
    - `sort`
    - `map`
    - `filter`
    - `reduce`
    - `find`

例如，下面的一系列操作：

```js
const schema = {
    title: {
        select: 'head > title',
        data: '#text',          //  abc, ACB, bac, cab,
        trim: true,             // 去除两边的空格
        slice: [0, 100],        // 只取前 100 个字符
        lower: true,            // 转为小写
        replace: [/,/, '|'],    // 把 , 替换为 |
        split: ['|'],           // 按照 | 进行切割
        sort: [],               // 字典排序as
    },
};
const res = autoQuery(html, schema);
console.log(res.title);         // ["abc", "acb", "bac", "cab"]
```

### example

下面一个示例展示了，如何使用 `auto-query` 获取 html 对应的数据信息。

```js
const got = require('got');
const autoQuery = require('../');

+ async function () {
    const html = (await got('https://github.com/search?q=auto')).body;
    const schema = {
        title: '$ head > title',
        results: {
            select: 'ul.repo-list > div',
            data: [{                // <-- 此除表明，解析的数据为数组
                name: { select: 'h3', data: '#text', trim: true },
                summary: { select: 'h3 + p', data: '#text', trim: true },
                star: { select: '.text-right', data: '#text', trim: true },
                url: { select: 'h3 > a', data: '@href' },
            }],
        },
    };

    const data = autoQuery(html, schema);
    console.log(data);
/*
{ title: 'Search · auto · GitHub',
  results:
   [ { name: 'google/auto',
       summary: 'A collection of source code generators for Java.',
       star: '6.5k',
       url: '/google/auto' },
     { name: 'AutoMapper/AutoMapper',
       summary: 'A convention-based object-object mapper in .NET.',
       star: '5.4k',
       url: '/AutoMapper/AutoMapper' },
     { name: 'automerge/automerge',
       summary: 'A JSON-like data structure that can be modified ...',
       star: '5.4k',
       url: '/automerge/automerge' },
     { name: 'NullArray/AutoSploit',
       summary: 'Automated Mass Exploiter',
       star: '3k',
       url: '/NullArray/AutoSploit' },
     { name: 'postcss/autoprefixer',
       summary: 'Parse CSS and add vendor prefixes to rules by Can I Use',
       star: '15.2k',
       url: '/postcss/autoprefixer' },
   ]
}
*/
} ();
```

### array schema
当 schema 包含数组时，`auto-query` 会根据 css 选择器来解析列表数据。同时 `auto-query` 支持多种数组结构，具体看下面的示例。

```js
const html = `
    <ul class="list">
        <li>
            <a href="/l1">l1</a>
        </li>
        <li>
            <a href="/l2">l2</a>
        </li>
        <li>
            <a href="/l3">l3</a>
        </li>
    </ul>
`;

const schema = {
    list1: [{
        select: '.list > li > a',
        data: '@href',
    }],
    list2: {
        select: '.list > li',        // 选择出来应该是数组
        data: [{
            url: {
                select: '> a',       // 选择器的范围缩小到 li 内
                data: '@href',
            },
            link: {
                text: {
                    select: '> a',
                    data: '#text',
                },
            },
        }],
    },
    list3: {
        select: '.list > li > a',    // 全局范围
        data: [{
            select: '&',             // 选择自己
            data: '@href',
        }],
    },
    list4: {
        select: '.list > li > a',
        data: [{
            url: {
                select: '&',
                data: '@href',
            },
        }],
    },
};

console.log(autoQuery(html, schema));
/**
 {
    list1: ['/l1', '/l2', '/l3'],
    list2: [
        { url: '/l1', link: { text: 'l1' } },
        { url: '/l2', link: { text: 'l2' } },
        { url: '/l3', link: { text: 'l3' } },
    ],
    list3: ['/l1', '/l2', '/l3'],
    list4: [
        { url: '/l1' },
        { url: '/l2' },
        { url: '/l3' },
    ],
};
*/
```

### React Native 上使用
`auto-query` 也可以在 React Native，在 React Native 上使用的是 `cheerio-without-node-native` 而不是 `cheerio`，因为 `cheerio` 在 React Native 上报错。

目前，提供一个配置项 query，可以让你自己设置 cherrio。

```js
const cheerio = require('cheerio');
autoQuery(html, schema, {
    query: cheerio,
});
```

### update logs
- v1.6.0 (2018-06-01): add options.
- v1.5.0 (2018-05-11): add index.d.ts.
- v1.2.0-beta (2018-05-10): support for react native.
- v1.1.0-beta (2018-05-07): query adds one parameter.
- v1.0.0-beta (2018-05-07): add auxiliary functions.
- v0.3.0 (2018-04-27): add a short operation.
- v0.2.0 (2018-04-27): rewrite the core algorithm.
- v0.1.0 (2018-04-26): implement basic functions.
