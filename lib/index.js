const cheerio = require('cheerio');
const { query, queryArr } = require('./query');

// 数组形式
function autoArr($p, schema) {
    const data = {};
    for (const key in schema) {
        const node = schema[key];
        if (typeof node === 'object') {
            if ('select' in node && 'data' in node) {
                if (Array.isArray(node.data)) {
                    data[key] = $p.find(node.select).toArray()
                        .map((item, index) => autoArr($(item), node.data[0]));
                }
                else {
                    data[key] = queryArr($p, node);
                }
            }
            else {
                data[key] = autoArr($p, node);
            }
        }
        else {
            data[key] = node;
        }
    }
    return data;
}

// 对象形式
function auto($, schema) {
    const data = {};

    for (const key in schema) {
        const node = schema[key];
        if (typeof node === 'object') {
            if ('select' in node && 'data' in node) {
                if (Array.isArray(node.data)) {
                    data[key] = $(node.select).toArray()
                        .map((item, index) => autoArr($(item), node.data[0]));
                }
                else {
                    data[key] = query($, node);
                }
            }
            else {
                data[key] = auto($, node);
            }
        }
        else {
            data[key] = node;
        }
    }
    return data;
}

module.exports = function (html, schema) {
    const $ = cheerio.load(html + '');
    return auto($, schema);
}

