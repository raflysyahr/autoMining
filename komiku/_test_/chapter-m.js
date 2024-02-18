import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';
import config from '../../config.js';

const html = fs.readFileSync(path.join(config.rootDir,'./dataset/komiku/chapter.html'));


const $ = load(html);

const p = Array.from($('#Baca_Komik').find('img')).map(element=>{
  return $(element).attr('src')
})


console.log(p)





