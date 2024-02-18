import { existsSync, readFileSync, writeFileSync } from 'fs';
import { extname } from 'path';
import { duplicatesRemover } from './duplicateRemover.js';
import sleep from './sleep.js';



export default function MergeDataKomik(path1,path2){


    if(existsSync(path1) && extname(path1) === '.json' && existsSync(path2) && extname(path2) === '.json'){
        const read1 = JSON.parse(readFileSync(path1))
        const read2 = JSON.parse(readFileSync(path2))



        const result = [...read1,...read2]
        const res = duplicatesRemover(result,'url')

        return res

    }

}