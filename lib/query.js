const hotKey = require('./hot-key');

/**
 * @param {Object} $el - cheerio element
 * @param {Object} node - data schema
 * @return {String|Any}
 */
module.exports = function ($el, node) {
    let text = null;
    switch (typeof node.data) {
        case 'function': return node.data($el);
        case 'string': return hotKey($el, node.data);
    }
    return text;
};


