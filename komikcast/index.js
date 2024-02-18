import inquirer from 'inquirer';
import ScrapingPrompt from './scripts/main/ScrapingPrompt.js';
import path from 'path'
import fs from 'fs';
import MergeDataKomik from './utils/mergeDataKomik.js';
import logUpdate from 'log-update';
import config from '../config.js';
import sleep from './utils/sleep.js';
import chalk from 'chalk';
import DownloadingPrompt from './scripts/main/DownloadingPrompt.js';
import checkNet from './utils/checkNet.js';
import LogsUpdate from './utils/LogsUpdate.js';

const log = console.log.bind(console)
const clear = console.clear.bind(console);


const menu = async(menu)=>{
    switch (menu) {
        case 'download':
                DownloadingPrompt()
            break;
        case 'scraping':
                ScrapingPrompt()
            break;
    
        case 'merge':
            const merge = await inquirer.prompt([
                {
                    type:'input',
                    message:'file 1',
                    name:'path1',
                    prefix:'›',
                    suffix:':',
                    validate(input,answers){
                        
                        if(input){
                            const path_ = input.startsWith('/') || input.startsWith('C:') ? input : path.join(config.rootDir,input)
                            if(fs.existsSync(path_) && fs.existsSync(path_.split(config.slash).slice(0,-1).join(config.slash)) && path.extname(path_) === '.json'){
                                answers.filename1 = path_.split(config.slash).slice(-1)
                                answers.fullpath1 = path_
        
                                return true
                            }else{
                                return false
                            }
                        }else{
                            return false
                        }
                    }
                },
                {
                    type:'input',
                    message:'file 2',
                    name:'path2',
                    prefix:'›',
                    suffix:':',
                    validate(input,answers){
                        
                        if(input){
                            const path_ = input.startsWith('/') || input.startsWith('C:') ? input : path.join(config.rootDir,input)
                            if(fs.existsSync(path_) && fs.existsSync(path_.split(config.slash).slice(0,-1).join(config.slash)) && path.extname(path_) === '.json'){
                                answers.filename2 = path_.split(config.slash).slice(-1)
                                answers.fullpath2 = path_
        
                                return true
                            }else{
                                return false
                            }
                        }else{
                            return false
                        }
                    }
                },
                {
                    type:'input',
                    message:'output',
                    name:'path',
                    prefix:'›',
                    suffix:':',
                    validate(input,answers){
                        
                        if(input){
                            const path_ = input.startsWith('/') || input.startsWith('C:') ? input : path.join(config.rootDir,input)
                            if(fs.existsSync(path_.split(config.slash).slice(0,-1).join(config.slash)) && path.extname(path_) === '.json'){
                                answers.filename = path_.split(config.slash).slice(-1)
                                answers.fullpath = path_
        
                                return true
                            }else{
                                return false
                            }
                        }else{
                            return false
                        }
                    }
                }
            ])


            if(merge){
                let logUpdates;
                let status = 'Sedang manggabungkan'
                let indexCounter = 0 ;
                console.log('')
                try{
                    logUpdates = setInterval(()=>{
                        logUpdate(`${status} ${
                            status === 'Penggabungan selesai'
                            ?
                                chalk.green(" ✔")
                            : ( status === 'pengabungan gagal' ? chalk.red('✖') :config.loading.frames.default.frame[indexCounter = ++indexCounter % config.loading.frames.default.frame.length])
                        }`)
                    },config.loading.frames.default.interval)
    
    
                    const result = MergeDataKomik(merge.fullpath1,merge.fullpath2)
                    status = 'Menyimpan hasil penggabungan'
                    
                    if(result){

                        fs.writeFile(merge.fullpath, JSON.stringify(result.result),'utf-8',async(err)=>{
                            if(err) throw err
        
                            await sleep(1000)
                            status = 'Penggabungan selesai'
                            await sleep(500)
                            clearInterval(logUpdates)
        
                        })
                    }

                }catch(error){
                    status = 'pengabungan gagal'
                    await sleep(80)
                    clearInterval(logUpdates)
                    console.log(error)
                }

                

            }



            break;
    }
}


const logsUpdate = new LogsUpdate()

async function main(){
    clear();
    logsUpdate.start()

    await logsUpdate.update('Checking internet connection').sleep(80)

    const networkIs = await checkNet();

    if(networkIs){
        await logsUpdate.stop('done')
        clear()

        console.log('Using:',config.os)
        console.log('platform:',config.platform)
        console.log('root',config.rootDir)
    
        log('┌────────────────────────────────────────┐');
        log('│            Web scraping tools          │');
        log('└────────────────────────────────────────┘');
    
        inquirer.prompt([
            {
                type:'list',
                name:'menu',
                choices:['scraping','merge','download'],
                message:'Apa yang akan kamu lakukan',
                prefix:'➤',
                suffix:'？'
            }
        ]).then((result)=> menu(result.menu))

    }else{
        await logsUpdate.update('No internet connection').sleep(80)
        await logsUpdate.stop('failed')
    }


}

const KomikcastMain = main

export default KomikcastMain
