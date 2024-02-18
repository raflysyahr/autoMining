import inquirer from 'inquirer';
import { load } from 'cheerio';
import normalizeTitle from '../utils/normalizeTitle.js';
import sleep from '../utils/sleep.js'
import normalizeChapterLinks from '../utils/normalizeChapterLinks.js';
import moment from 'moment';
import axios from 'axios';
import config from '../../config.js';
import path from 'path';
import { existsSync, writeFileSync } from 'fs';
import uclear from '../utils/uclear.js';

moment.suppressDeprecationWarnings = true

const log = console.log.bind(console)
const clear = console.clear.bind(console)

export default async function DetailKomik(html){
    const $ = load(html);
    const result = {}

    try {
            result.title = normalizeTitle($('.komik_info-content-body-title').text());
            result.author = $( "b:contains('Author')" ).parent().text().replace("Author:",'').trim() || 'null';
            result.type = $(".komik_info-content-info-type > a").text();
            result.synopsis = $('.komik_info-description-sinopsis > p').text();
            result.genre = Array.from($('.komik_info-content-genre > a')).map((el,i,a)=> $(el).text()) || [];
            result.chapters = Array.from($('.komik_info-chapters-item')).map((e,i,a)=>{
              return {
                  _$:$(e).find('a.chapter-link-item').attr('href'),
                  label:$(e).find('a.chapter-link-item').text().replace(/\s+/g,' '),
                  url:normalizeChapterLinks(($(e).find('a.chapter-link-item').attr('href').split('chapter/')[1].replace('/',''))),
                  createdAt:moment(Date.now() - (31557600000 * Number($(e).find('.chapter-link-time').text().split(' ')[0]))).format()
              }
            }) || [];

            result.url = normalizeTitle($('.komik_info-content-body-title').text().trim().replace(/[!@#$%^&*()_+-=`';?:\|><.,/`!’]/g,'').split(' ').join('-').toLocaleLowerCase());


            // if(!existsSync(path.join(config.rootDir,`../Assets_Komik/thumbnail/${uclear(result.url)}${path.extname($('.attachment-post-thumbnail.size-post-thumbnail.wp-post-image').attr('src'))}`))){

            //   const bf = await axios.get($('.attachment-post-thumbnail.size-post-thumbnail.wp-post-image').attr('src'),{ responseType:'arraybuffer'})
            //   const base64 = Buffer.from(bf.data).toString('base64');
            //   const paths = path.join(config.rootDir,`../Assets_Komik/thumbnail/${uclear(result.url)}${path.extname($('.attachment-post-thumbnail.size-post-thumbnail.wp-post-image').attr('src'))}`)
            //   writeFileSync(paths, base64,'base64')

            // }

            result.thumbnail = {
              _$:$('.attachment-post-thumbnail.size-post-thumbnail.wp-post-image').attr('src'),
              base64:"",
              // source:`http://localhost:8000/upload/thumbnail/v1/${uclear(result.url)}${path.extname($('.attachment-post-thumbnail.size-post-thumbnail.wp-post-image').attr('src'))}`,
              source:$('.attachment-post-thumbnail.size-post-thumbnail.wp-post-image').attr('src'),
              alt:result.title,
            };

            result.status = $( "b:contains('Status')" ).parent().text().replace("Status:",'').trim();
            result.chapter = result.chapters[0].label;
            result.views = '0';
            result.rating = $('.data-rating').attr('data-ratingkomik');
            result.updatedAt = moment($("time").text()).format();
            result.createdAt = moment($("time").text()).format();
            
            await sleep(1000);

            return {
              data:result,
              Error:null,
              error:false
            }

    }catch(error){

      console.log(error)
      // process.exit(1)
      return {
        data:null,
        Error:error,
        error:true
      }
    }
}