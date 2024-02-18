import axios from "axios";
import { load } from 'cheerio';
axios.get('https://komikcast.vip/daftar-komik/').then((result)=>{

    const $ = load(result.data)

    const lastupdate = Array.from($('.list-update_item')) 

    const res =  lastupdate.map((updateProduct) => {

        const _$ = $(updateProduct).find('.data-tooltip').attr('href')
        const title = $(updateProduct).find('.list-update_item-info > h3.title').text()
        const thumbnail = $(updateProduct).find('img.ts-post-image.wp-post-image').attr('src')
        const url = $(updateProduct).find('.data-tooltip').attr('href')
        const type = $(updateProduct).find('span.type').text()
        const lastChapter = $(updateProduct).find('.list-update_item-info > .other > .chapter').attr('href')

        return { _$,title, type , thumbnail , url , lastChapter}
    })

    console.log(res)

})






