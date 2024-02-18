import { load } from 'cheerio';
import fs, { readFileSync } from 'fs';
import config from '../../config.js';
import normalizeTitle from '../utils/normalizeTitle.js';



const html = readFileSync(config.rootDir+'/dataset/komiku/home.html').toString()




const $ = load(html);
const wrapper = Array.from($('#Terbaru > .ls4w'))


const list = Array.from($(wrapper[1]).find('.ls4'))

const lastUpdate = list.map((e)=>{
  const title = normalizeTitle($(e).find('.ls4j > h4 > a').text()),
        link = 'https://komiku.id'+$(e).find('.ls4j > h4 > a').attr('href'),
        thumbnail = $(e).find('.ls4v > a > img').attr('src'),
        type = 'unknown',
        url = normalizeTitle(title.trim().replace(/[!@#$%^&*()_+=`';:\|><.,/`!’]/g,'').split(' ').join('-').toLocaleLowerCase())

  return { _$:link, title , type , thumbnail :{ source:thumbnail,alt:title,base64:""},url}

})

console.log(lastUpdate)

