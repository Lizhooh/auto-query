const hotKey = require('./hot-key');

module.exports = {
    query: ($, node) => {
        const $el = $(node.select);
        let text = null;
        switch (typeof node.data) {
            case 'function': return node.data($el);
            case 'string': return hotKey($el, node.data);
        }
        return text;
    },
    queryArr: ($i, node) => {
        const $el = $i.find(node.select);
        let text = null;
        switch (typeof node.data) {
            case 'function': return node.data($el);
            case 'string': return hotKey($el, node.data);
        }
        return text;
    }
}