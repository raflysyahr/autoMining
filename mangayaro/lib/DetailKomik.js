import inquirer from 'inquirer';
import { load } from 'cheerio';
import normalizeTitle from '../utils/normalizeTitle.js';
import sleep from '../utils/sleep.js'
import normalizeChapterLinks from '../utils/normalizeChapterLinks.js';
import moment from 'moment';

moment.suppressDeprecationWarnings = true

const log = console.log.bind(console)
const clear = console.clear.bind(console)

export default async function DetailKomik(html){
    const $ = load(html);
    const result = {}

    try {
            result.title = normalizeTitle($('.entry-title').text());
            result.author = $( ".imptdt:contains('Penulis')" ).find('i').text();
            result.type = $(".imptdt:contains('Tipe')").find('a').text();
            result.synopsis = $('.entry-content.entry-content-single').find('p').text();
            result.genre = Array.from($('.mgen > a')).map((el,i,a)=> $(el).text()) || [];
            result.chapters = Array.from($('#chapterlist').find('.chbox')).map(element=>{
                const ch_section = $(element).find('.eph-num > a')

                return {
                    _$:$(ch_section).attr('href'),
                    label:$(ch_section).find('.chapternum').text(),
                    url:normalizeChapterLinks($(ch_section).attr('href').split("/")[3])+'-bahasa-indonesia',
                    createdAt:moment($(ch_section).find('.chapterdate').text()).format()
                }
            });

            result.thumbnail = {
              base64:"",
              source:$('.thumb').find('img').attr('src'),
              alt:result.title,
            };
            result.status = $( ".imptdt:contains('Status')" ).find('i').text();
            result.url = normalizeTitle(result.title.replace(/[!@#$%^&*()_+-=`';:\|><.,/`!’]/g,'').split(' ').join('-').toLocaleLowerCase());
            result.chapter = result.chapters[0].label;
            result.views = '0';
            result.rating = $('.num').attr('itemprop') === 'ratingValue' && $('.num').text();
            result.updatedAt = moment($(".imptdt:contains('Diperbarui')").find('time').text()).format();
            result.createdAt = moment($(".imptdt:contains('Diposting')").find('time').text()).format();

            await sleep(1000);

            return {
              data:result,
              Error:null,
              error:false
            }

    }catch(error){
      return {
        data:null,
        Error:error,
        error:true
      }
    }
}