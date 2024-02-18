import { existsSync, readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { duplicatesRemover } from '../utils/duplicateRemover.js';



function merge(path1,path2){


    if(existsSync(path1) && extname(path1) === '.json' && existsSync(path2) && extname(path2) === '.json'){
        const read1 = JSON.parse(readFileSync(path1))
        const read2 = JSON.parse(readFileSync(path2))



        const result = [...read1,...read2]

        return duplicatesRemover(result,'url')

    }

}


const result = merge(
    '/run/media/majorsky/OS/Users/ASUS/Desktop/autoMining/df-2.json',
    '/run/media/majorsky/OS/Users/ASUS/Desktop/autoMining/home.json'
)
