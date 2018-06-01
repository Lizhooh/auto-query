import * as Cheerio from 'cheerio';

export interface DataCallBack {
    ($el: Cheerio, $: CheerioSelector): any
}

export interface ArrayCallBack<T> {
    (item: T, index: number, list: T[]): T
}

export interface ReduceCallBack<T> {
    (previousValue: T, currentValue: T, currentIndex: number, array: T[]): T
}

export interface FindCallBack<T> {
    (value: T, index: number, obj: T[]): boolean
}

export interface Schema {
    select?: string,
    data?: string | DataCallBack | Schema[] | Schema,
    trim?: boolean,
    number?: boolean,
    lower?: boolean,
    upper?: boolean,
    reverse?: boolean,
    slice?: [number] | [number, number],
    substr?: [number] | [number, number],
    concat?: any[][],
    match?: [string | RegExp],
    replace?: [string | RegExp, string],
    repeat?: [number],
    split?: [string | RegExp] | [string | RegExp, number],

    fill?: [string],
    join?: boolean | [string],
    splice?: any[],
    sort?: boolean | [(a: any, b: any) => number],
    map?: ArrayCallBack<any>,
    filter?: ArrayCallBack<any>,
    reduce?: ReduceCallBack<any> | [ReduceCallBack<any>, any],
    find?: FindCallBack<any>,

    [rest: string]: string | Schema | Schema[] | any,
}

export interface Options {
    query: Cheerio,
}

export default function (html: string, schema: Schema, options: Options): any;
