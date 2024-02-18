import fs from 'fs';
import path from 'path';

export const duplicatesRemoverFromFile = (files,filterby)=>{

    const result = [];
    const duplicates = [];
    const current = files.currentFile;


    if(fs.existsSync(current) ){
      if(path.extname(current) === '.json') {
        const currentData =JSON.parse(fs.readFileSync(current))

        for (let i = 0; i < currentData.length; i++) {
          const element = currentData[i];
          if(!result.some((e)=> e[filterby] === element[filterby])){
              result.push(element)
          }else{
            duplicates.push({...element, index:i+1 })
          }
        }

        return { result , duplicates }
      }else{
        console.log('ext file not support,support only .json')
      }
    }else{
        console.log('file is not found!')
    }
}
export const duplicatesRemover = (data,filterby)=>{

  const result = [];
  const duplicates = [];


  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if(!result.some((e)=> e[filterby] === element[filterby])){
        result.push(element)
    }else{
      duplicates.push({...element, index:i+1 })
    }
  }

  return { result , duplicates }
}
