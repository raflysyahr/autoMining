import { load } from 'cheerio';
import normalizeTitle from '../utils/normalizeTitle.js';

export default function HomeKomik(html){
    const $ = load(html);

    try {
        const box = Array.from($('.bixbox'))

        
        const boxListUpdate = box.filter((e)=> $(e).find("h2:contains('Pembaruan Terbaru')").text())

        const result = Array.from($(boxListUpdate).find('.listupd > .utao > .uta')).map((e)=> {
            const title = $(e).find(".luf > .series > h4").text();
            const link_comic = $(e).find(".luf > .series").attr('href');
            const type = $(e).find('.luf > ul').attr('class')
            const thumbnail = $(e).find('.imgu > .series').find('img').attr('src')

            return {
                _$:link_comic,
                title,
                type,
                thumbnail:{
                    source:thumbnail,
                    alt:title,
                    base64:''
                },
                url:normalizeTitle(title.trim().replace(/[!@#$%^&*()_+-=`';:\|><.,/`!’]/g,'').split(' ').join('-').toLocaleLowerCase())
            }

        })

        return result

    } catch (error) {
        console.log(error)
        return null
    }

}