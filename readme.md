

## auto-query

`auto-query` 是一个基于 `cheerio` 实现的自动查询 DOM 节点数据的工具函数。使用 `auto-query` 非常简单，只需要定义 schema 并且载入 html 即可，`auto-query` 会帮你解析出对于的数据结构。

> 目前为 0.3.0 版本，api 可能会改变。

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

- #text 等效于 $el.text();
- #html 等效于 $el.html();
- #val 等效于 $el.val();
- #data 等效于 $el.data();
- @attr 等效于 $el.attr('attr');

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
            data: [{
                name: {
                    select: 'h3',
                    data: $el => $el.text().trim(),
                },
                summary: {
                    select: 'h3 + p',
                    data: $el => $el.text().trim(),
                },
                star: {
                    select: '.text-right',
                    data: $el => $el.text().trim(),
                },
                url: {
                    select: 'h3 > a',
                    data: '@href',
                },
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

### update logs
- v0.3.0 (2018-04-27): add a short operation.
- v0.2.0 (2018-04-27): rewrite the core algorithm.
- v0.1.0 (2018-04-26): implement basic functions.

