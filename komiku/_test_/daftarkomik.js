import fs from 'fs';
import path from 'path';
import { load } from 'cheerio';
import config from '../../config.js';

const html = fs.readFileSync(path.join(config.rootDir,'./dataset/komiku/daftarkomik.html'));


const $ = load(html);
const box = $('.daftar')
const daftar = Array.from($(box).find('.bge')).map(element=>{
  
  const link = $(element).find('.kan > a').attr('href');
  const title = $(element).find('.kan > a > h3').text();
  const thumbnail = $(element).find('.bgei > a > img').attr('src');
  const type = $(element).find('.bgei > a > .tpe1_inf').find('b').text();
  const lastChapter = $(Array.from($(element).find(".kan > .new1 > a:contains('Terbaru')").find('span'))[1]).text();

  return {
      _$:link,
      title:title.trim(),
      thumbnail,
      type,
      url:link.split('/manga/')[1].replace('/',''),
      lastChapter

  }


})

console.log(daftar)
