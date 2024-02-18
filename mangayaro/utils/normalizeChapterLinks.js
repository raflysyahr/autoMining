export default function normalizeChapterLinks(str){
  
    if(str.includes('chapter-0')){
      return str
    }else if(str.match(/chapter-0-[1-9]/g)){
       return str
    }else {
       return str.replace('chapter-0','chapter-')
    }
}
