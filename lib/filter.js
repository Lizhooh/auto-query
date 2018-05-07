
const filterStringMap = {
    trim: text => text.trim(),
    number: text => parseFloat(text),
    lower: text => text.toLowerCase(),
    upper: text => text.toUpperCase(),
    reverse: text => text.split('').reverse().join(''),
    slice: (text, arg) => text.slice(...arg),
    substr: (text, arg) => text.substr(...arg),
    concat: (text, arg) => text.concat(...arg),
    match: (text, arg) => text.match(...arg),
    replace: (text, arg) => text.replace(...arg),
    repeat: (text, arg) => text.repeat(...arg),
    split: (text, arg) => text.split(...arg),
};

const filterArrayMap = {
    reverse: arr => arr.reverse(),
    slice: (arr, arg) => arr.slice(...arg),
    concat: (arr, arg) => arr.concat(...arg),
    fill: (arr, arg) => arr.fill(...arg),
    join: (arr, arg) => arr.join(...arg),
    splice: (arr, arg) => {
        arr.splice(...arg);
        return arr;
    },
    sort: (arr, arg) => {
        arr.sort(...arg);
        return arr;
    },
    map: (arr, arg) => arr.map(...arg),
    filter: (arr, arg) => arg.filter(...arg),
    reduce: (arr, arg) => arg.reduce(...arg),
    find: (arr, arg) => arg.find(...arg),
};

function stringType(key, data, node) {
    switch (key) {
        case 'trim':
        case 'number':
        case 'lower':
        case 'upper':
        case 'reverse':
            return filterStringMap[key](data);
        case 'slice':
        case 'substr':
        case 'concat':
        case 'match':
        case 'replace':
        case 'repeat':
        case 'split':
            return filterStringMap[key](data, node[key]);
    }
    return data;
}

function arrayType(key, data, node) {
    switch (key) {
        case 'reverse':
            return filterArrayMap[key](data);
        case 'slice':
        case 'concat':
        case 'fill':
        case 'join':
        case 'splice':
        case 'sort':
        case 'map':
        case 'filter':
        case 'reduce':
        case 'find':
            return filterArrayMap[key](data, node[key]);
    }
    return data;
}

/**
 * @param{String} text
 * @param{Object} node
 * @return{Any}
 */
module.exports = function (data, node) {
    const keys = Object.keys(node);
    keys.forEach((key, index) => {
        if (key !== 'data' || key !== 'select') {
            if (typeof data === 'string') {
                data = stringType(key, data, node);
            }
            else if (Array.isArray(data)) {
                data = arrayType(key, data, node);
            }
        }
    });
    // if (typeof data === 'string') {
    // }
    // else if (Array.isArray(data)) {
    //     keys.forEach((key, index) => {
    //         if (typeof data === 'string') {
    //             data = stringType(key, data, node);
    //         }
    //         else if (Array.isArray(data)) {
    //             data = (key, data, node);
    //         }
    //     });
    // }
    return data;
}

