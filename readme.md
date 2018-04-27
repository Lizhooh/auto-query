

## auto-query

`auto-query` 是一个基于 `cheerio` 实现的自动查询 DOM 节点数据的工具函数。使用 `auto-query` 非常简单，只需要定义 schema 并且载入 html 即可，`auto-query` 会帮你解析出对于的数据结构。

> 目前为 0.2.0 版本，api 可能会改变。

### install

```js
yarn add auto-query
```

### api

```js
const schema = {
    title: {
        select: String,            // css 选择器
        data: String | Function,   // 数据项，一般为回调函数，参数为 $el
    }
};

autoQuery(html, schema);           // 返回一个数据集
```

### example

下面一个示例展示了，如何使用 `auto-query` 获取 html 对应的数据信息。

```js
const got = require('got');
const autoQuery = require('../');

+ async function () {
    const html = (await got('https://github.com/search?q=auto')).body;
    const schema = {
        title: {
            select: 'head > title',
            data: '#text',
        },
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
                }
            }],
        }
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
       summary: 'A JSON-like data structure that can be modified concurrently by different users, and merged again automatically.',
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

### convenient function
`auto-query` 提供了一些便捷函数供使用。

- `#text` 等效于 $el.text()
- `#html` 等效于 $el.html()
- `#val` 等效于 $el.val()
- `#data` 等效于 $el.data()
- `@attr` 等效于 $el.attr('attr')

例如，获取 `<a>` 的 href，可以使用 `@href`：

```js
const schema = {
    url: {
        select: '.name > a',
        data: '@href',
    }
};
```

### update logs

- v0.2.0 (2018-04-27): rewrite the core algorithm.
- v0.1.0 (2018-04-26): implement basic functions.

