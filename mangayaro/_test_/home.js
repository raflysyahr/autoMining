import { load } from 'cheerio';
import fs, { readFileSync } from 'fs';
import config from '../../config.js';
import normalizeTitle from '../utils/normalizeTitle.js';
import HomeKomik from '../lib/HomeKomik.js';



const html = readFileSync(config.rootDir+'/dataset/mangayaro/home.html').toString()


const x = HomeKomik(html)
console.log(x)


// const $ = load(html);
// const box = Array.from($('.bixbox')) //Array.from($('.wrapper > .postbody > .bixbox > .listup'))

// // const list = $(box).find('.utao')
// const boxListUpdate = box.filter((e)=> $(e).find("h2:contains('Pembaruan Terbaru')").text())

// const ListUpdate = Array.from($(boxListUpdate).find('.listupd > .utao > .uta')).map((e)=> {
//     const title = $(e).find(".luf > .series > h4").text();
//     const link_comic = $(e).find(".luf > .series").attr('href');
//     const type = $(e).find('.luf > ul').attr('class')
//     const thumbnail = $(e).find('.imgu > .series').find('img').attr('src')

//     return {
//         _$:link_comic,
//         title,
//         type,
//         thumbnail:{
//             source:thumbnail,
//             alt:title,
//             base64:''
//         },
//         url:normalizeTitle(title.trim().replace(/[!@#$%^&*()_+-=`';:\|><.,/`!’]/g,'').split(' ').join('-').toLocaleLowerCase())
//     }

// })


// console.log(ListUpdate)              nb  


