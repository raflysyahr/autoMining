import axios from 'axios';
import sleep from '../../utils/sleep.js';
import DetailKomik from '../../lib/DetailKomik.js';
import chalk from 'chalk';
import fs from 'fs';
import LogsUpdate from '../../utils/LogsUpdate.js';



export default async function DetailKomikPrompt(url,path){
    let logUpdate = new LogsUpdate();

    console.log(' ')
    logUpdate.start()

    logUpdate.update('mengakses url')

    axios.get(url).then(async(result)=>{
        
        await logUpdate.update('mengambil data').sleep(1000)

        const detail = await DetailKomik(result.data)

        await logUpdate.update('data berhasil diambil').sleep(1000)
        
        if(detail.error) throw detail.Error

        fs.writeFileSync(path,JSON.stringify(detail.data),'utf-8')

        logUpdate.stop('done')

    }).catch(async(error)=>{
        await logUpdate.update('data gagal di ambil').sleep(80)
        logUpdate.stop('failed')

        await sleep(100);
        console.log(chalk.red(error.message))    
        
    })
}