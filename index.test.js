const autoQuery = require('./');

describe('autoQuery', () => {
    test('test 1', () => {
        // HTML
        const html = `
            <div>
                <div>
                    <p id="text">AAA</p>
                </div>
                <ul class="list">
                    <li>
                        <a href="111">111</a>
                        <img src="111.png"/>
                    </li>
                    <li>
                        <a href="222">222</a>
                        <img src="222.png"/>
                    </li>
                    <li>
                        <a href="333">333</a>
                        <img src="333.png"/>
                    </li>
                    <li>
                        <a href="444">444</a>
                        <img src="444.png"/>
                    </li>
                </ul>
            </div>
        `;

        // 模型
        const schema = {
            text: {
                select: '#text',
                data: $el => $el.text(),
            },
            list: {
                select: '.list li',
                data: [{
                    url: {
                        select: '> a',
                        data: $el => $el.attr('href'),
                    },
                    img: {
                        select: '> img',
                        data: $el => $el.attr('src'),
                    },
                }],
            },
        };

        // 得到的数据
        const data = {
            text: 'AAA',
            list: [{
                url: '111',
                img: '111.png',
            }, {
                url: '222',
                img: '222.png',
            }, {
                url: '333',
                img: '333.png',
            }, {
                url: '444',
                img: '444.png',
            }],
        };

        expect(autoQuery(html, schema)).toEqual(data);
    });

    test('test 2', () => {
        // HTML
        const html = `
            <div>
                <div>
                    <p id="text">AAA</p>
                </div>
                <ul class="list">
                    <li>
                        <a href="111">
                            <div>
                                <span class="name">xiao ming1</span>
                                <span class="summary">xiao ming1 summary</span>
                            </div>
                        </a>
                        <img src="111.png"/>
                    </li>
                    <li>
                        <a href="222">
                            <div>
                                <span class="name">xiao ming2</span>
                                <span class="summary">xiao ming2 summary</span>
                            </div>
                        </a>
                        <img src="222.png"/>
                    </li>
                    <li>
                        <a href="333">
                            <div>
                                <span class="name">xiao ming3</span>
                                <span class="summary">xiao ming3 summary</span>
                            </div>
                        </a>
                        <img src="333.png"/>
                    </li>
                    <li>
                        <a href="444">
                            <div>
                                <span class="name">xiao ming4</span>
                                <span class="summary">xiao ming4 summary</span>
                            </div>
                        </a>
                        <img src="444.png"/>
                    </li>
                </ul>
            </div>
        `;

        // 模型
        const schema = {
            text: {
                select: '#text',
                data: '#text',
            },
            list: {
                select: '.list li', // array
                data: [{
                    user: {
                        name: {
                            select: '.name',
                            data: '#text',
                        },
                        summary: {
                            select: '.summary',
                            data: '#text',
                        }
                    },
                    img: {
                        select: '> img',
                        data: '@src',
                    },
                }],
            },
        };

        // 得到的数据
        const data = {
            text: 'AAA',
            list: [{
                user: {
                    name: 'xiao ming1',
                    summary: 'xiao ming1 summary',
                },
                img: '111.png',
            }, {
                user: {
                    name: 'xiao ming2',
                    summary: 'xiao ming2 summary',
                },
                img: '222.png',
            }, {
                user: {
                    name: 'xiao ming3',
                    summary: 'xiao ming3 summary',
                },
                img: '333.png',
            }, {
                user: {
                    name: 'xiao ming4',
                    summary: 'xiao ming4 summary',
                },
                img: '444.png',
            }],
        };

        expect(autoQuery(html, schema)).toEqual(data);
    });

});