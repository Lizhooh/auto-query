const hotKey = require('./hot-key');
const filter = require('./filter');

/**
 * @param {Object} $el - cheerio element
 * @param {Object} node - data schema
 * @return {String|Any}
 */
module.exports = function ($el, node, $) {
    let text = null;
    switch (typeof node.data) {
        case 'function': return filter(node.data($el, $), node);
        case 'string': return filter(hotKey($el, node.data), node);
    }
    return filter(text, node);
};


