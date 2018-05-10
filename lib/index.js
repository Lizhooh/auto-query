const query = require('./query');
const isEnv = require('is-env');

/**
 * @return{Boolean}
 */
function hasSelect(node) {
    if (node['data'] && typeof node['select'] === 'string') {
        return true;
    }
    return false;
}

/**
 * @param{CheerioElement} $p
 * @param{Object} schema
 * @return{Object}
 */
function autoArray($p, schema) {
    let data = {};
    if (typeof schema === 'object') {
        if (hasSelect(schema)) {
            if (schema.select === '&') {        // select: '&'
                data = query($p, schema, $p);
            }
            else {
                data = query($p.find(schema.select), schema, $p);
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
    else if (typeof schema === 'string' && schema[0] === '$') {
        const node = {
            select: schema.slice(1),
            data: '#text',
        };
        data = query($p.find(node.select), node, $p);
    }
    else {
        return schema;
    }
    return data;
}

/**
 * @param{CheerioElement} $p
 * @param{Object} schema
 * @return{Object}
 */
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
            if (hasSelect(node)) {
                data = $(node.select).toArray().map(el => query($(el), node, $));
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
                data = [];
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
            if (hasSelect(schema)) {
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
                    data = query($(schema.select), schema, $);
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
    else if (typeof schema === 'string' && schema[0] === '$') {
        const node = {
            select: schema.slice(1),
            data: '#text',
        };
        data = query($(node.select), node, $);
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
const AutoQuery = function (html, schema) {
    let cheerio;
    if (isEnv() === 'react-native') {
        cheerio = require('cheerio-without-node-native');
    }
    else {
        cheerio = require('cheerio');
    }

    const $ = cheerio.load(html + '');
    return auto($, schema);
}

AutoQuery.version = '1.1.0-beta';
AutoQuery.uuid = 'fda56bd97b95d676';

module.exports = AutoQuery;


