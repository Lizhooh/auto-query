
// convenient function
const hotKeyMap = {
    '#text': $el => $el.text(),
    '#html': $el => $el.html(),
    '#val': $el => $el.val(),
    '#data': $el => $el.data(),
    '@': ($el, key) => $el.attr(key),
};

/**
 * @param {Object} $el - cheerio element
 * @param {Object} sel - selector
 * @return {String}
 */
function hotKey($el, sel) {
    let text = null;
    const key = sel.slice(1);

    if (sel[0] === '@') {
        text = hotKeyMap['@']($el, key);
    }
    else if (sel[0] === '#' && ['text', 'html', 'val', 'data'].findIndex(i => i === key) > -1) {
        text = hotKeyMap['#' + key]($el);
    }
    return text;
}

module.exports = hotKey;