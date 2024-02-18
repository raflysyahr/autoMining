import { load } from 'cheerio';
import normalizeTitle from '../utils/normalizeTitle.js';

export default function HomeKomik(html){
    const $ = load(html);

    try {
        const listUpdates = Array.from($('.utao')) 
        
        const result = listUpdates.map((element,i)=>{

            const title = normalizeTitle($(listUpdates[i]).find('h3').text()),
                    thumbnail = $(element).find('.attachment-thumb.size-thumb.wp-post-image').attr('src'),
                    url = $(element).find('h3').text(),
                    type = $(element).find('ul').attr('class').toLocaleLowerCase(),
                    link_comic = $(element).find('.imgu.data-tooltip > a.series').attr('href');

            return  {
                _$:link_comic,
                title,
                type,
                thumbnail:{ 
                    source:thumbnail ,
                    alt:title,
                    base64:''
                },
                url:normalizeTitle(url.trim().replace(/[!@#$%^&*()_+-=`';:\|><.,/`!’]/g,'').split(' ').join('-').toLocaleLowerCase())
            }
        })

        return result

    } catch (error) {
        console.log(error)
        return null
    }

}