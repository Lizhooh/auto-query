
// convenient function
const hotKeyMap = {
    '#text': $el => $el.text(),
    '#html': $el => $el.html(),
    '#val': $el => $el.val(),
    '#data': $el => $el.data(),
    '@': ($el, key) => $el.attr(key),
};

/**
 * @return {String}
 */
function hotKey($el, str) {
    let text = null;
    const key = str.slice(1);

    if (str[0] === '@') {
        text = hotKeyMap['@']($el, key);
    }
    else if (str[0] === '#' && key === 'text') {
        text = hotKeyMap['#text']($el);
    }
    else if (str[0] === '#' && key === 'html') {
        text = hotKeyMap['#html']($el);
    }
    else if (str[0] === '#' && key === 'val') {
        text = hotKeyMap['#val']($el);
    }
    return text;
}

module.exports = hotKey;