let cheerio = require('cheerio');
let query = require('./query');

function autoArray($p, schema) {
    let data = {};
    if (typeof schema === 'object') {
        if (schema['select'] && schema['data']) {
            if (schema.select === '&') {        // select: '&'
                data = query($p, schema);
            }
            else {
                data = query($p.find(schema.select), schema);
            }
        }
        else {
            const keys = Object.keys(schema);
            let i = keys.length;
            while (i--) {
                data[keys[i]] = autoArray($p, schema[keys[i]])
            }
        }
    }
    else {
        return schema;
    }
    return data;
}

function auto($, schema) {
    let data = {};
    if (typeof schema === 'object') {
        if (Array.isArray(schema)) {
            /**
                list: [{
                    select: 'div.list > img',
                    data: '@src',
                }],
            */
            const node = schema[0];
            if (node['select'] && node['data']) {
                data = $(node.select).toArray().map(el => query($(el), node));
            }
            /**
                list: [{
                    img: [{
                        select: 'div.list > a',
                        data: '@href',
                    }]
                }]
            */
            else {
                const keys = Object.keys(node);
                let i = keys.length;
                while (i--) {
                    data[keys[i]] = auto($, node[keys[i]]);
                }
            }
        }
        else {
            /**
                name: {
                    select: '',
                    data: '',
                }
            */
            if (schema['select'] && schema['data']) {
                /**
                    list: {
                        select: '',
                        data: [{
                            select: '',
                            data: '',
                        }],`
                    }
                */
                if (Array.isArray(schema.data)) {
                    const list = $(schema.select).toArray();
                    let i = list.length;
                    data = [];
                    while (i--) {
                        data[i] = autoArray($(list[i]), schema.data[0]);
                    }
                }
                else {
                    data = query($(schema.select), schema);
                }
            }
            /**
                user: {
                    name: {
                        select: 'span.name',
                        data: '#text',
                    },
                    avatar: {
                        select: 'img.avatar',
                        data: '@src',
                    }
                }
            */
            else {
                const keys = Object.keys(schema);
                let i = keys.length;
                while (i--) {
                    data[keys[i]] = auto($, schema[keys[i]]);
                }
            }
        }
    }
    else {
        return schema;
    }
    return data;
}

/**
 * @param {String} html
 * @param {Object|Array} schema
 * @return {Object}
 */
module.exports = function (html, schema) {
    let $ = cheerio.load(html + '');
    return auto($, schema);
}


