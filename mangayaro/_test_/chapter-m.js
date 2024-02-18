import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';
import config from '../../config.js';

const html = fs.readFileSync(path.join(config.rootDir,'./dataset/mangayaro/chapter.html'));


const $ = load(html);

const p = Array.from($('#readerarea').find('.ts-main-image')).map(element=>{
  return $(element).attr('src')
})


console.log(p)





