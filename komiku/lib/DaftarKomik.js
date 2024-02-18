import { load } from 'cheerio';
export default function DaftarKomik (html){

    
    const $ = load(html)

    const lastupdate = Array.from($('.list-update_item')) 

    try {
        const result = lastupdate.map((updateProduct) => {
    
            const _$ = $(updateProduct).find('.data-tooltip').attr('href')
            const title = $(updateProduct).find('.list-update_item-info > h3.title').text()
            const thumbnail = $(updateProduct).find('img.ts-post-image.wp-post-image').attr('src')
            const url = $(updateProduct).find('.data-tooltip').attr('href')
            const type = $(updateProduct).find('span.type').text()
            const lastChapter = $(updateProduct).find('.list-update_item-info > .other > .chapter').attr('href')
    
            return { _$, title, type , thumbnail , url , lastChapter}
        })

        return result
    } catch (error) {
        console.log(error)
        return null
        
    }
}