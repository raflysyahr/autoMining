import inquirer from "inquirer";
import sleep from "../../utils/sleep.js";
import logUpdate from 'log-update'
import config from "../../../config.js";
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import HomeKomik from "../../lib/HomeKomik.js";
import axios from "axios";
import DetailKomik from "../../lib/DetailKomik.js";
import { duplicatesRemover } from "../../utils/duplicateRemover.js";
import DaftarKomik from "../../lib/DaftarKomik.js";
import DetailKomikPrompt from "../lib/DetailKomikPrompt.js";

let statusLoading = 'check-duplicate';
let counterLooping = 0

const log = console.log.bind(console);
const clear = console.clear.bind(console);


let counter = 0 ;
let state = 'loading';

const checkErrorOrNo = (stat,frame)=>{
    if(stat === 'success') return chalk.green("✔")
    if(stat === 'failed') return chalk.red("✖")
    return frame
}


async function ExtractorDataComic(page,isNumberPage,numberPage){

    const url = page === '/' ? 'https://komikcast.lol' : `https://komikcast.lol${
        isNumberPage && numberPage > 1 ? '/daftar-komik/page/'+numberPage : '/daftar-komik'
    }`;

    let logUpdates;
    const results = [];
    const errors = []
  
    clear();

    const HomeHtml = await axios.get(url)
    const lastUpdates = page === '/' ? HomeKomik(HomeHtml.data) : DaftarKomik(HomeHtml.data)
    const data = lastUpdates


    log('┌────────────────────────────────────────┐')
    log('│              Please wait....           │')
    log('└────────────────────────────────────────┘')
  
    
    log('┌─ Scraping Komik ')
    log(`│`)
    log('│- count: '+data.length)
    log('')
  
  
    for(let i = 0 ; i < data.length ; i++){
  
      const comic_data = data[i]
      
      try {
    
  
        logUpdates = setInterval(() => {
            const frame = config.loading.frames.default.frame[counter = ++counter % config.loading.frames.default.frame.length];
            logUpdate(`${
              state === 'success' || state === 'failed' ? '├──' : '└─'
            } ${
              state === 'failed' ?
              chalk.red(comic_data.title)
              :
              comic_data.title
            } ${checkErrorOrNo(state,frame)}`);
        }, config.loading.frames.default.interval);
  

  
        // if(tesErrorData.some((e)=> e !== comic_data.title)){

          const detailsHTML = await axios.get(comic_data._$)
          const getDetail = await DetailKomik(detailsHTML.data)
          
          
          if(getDetail.error) throw getDetail.Error
          if(!getDetail.data) throw Error('detail dari komik tidak ada')

          results.push(getDetail.data)
          
    
          state = 'success'
    
          await sleep(80);
          
          i+1 !== data.length && console.log('')
          clearInterval(logUpdates)
          state = 'loading';
          i+1 === data.length && console.log('│')
          i+1 === data.length && console.log('└─ All Done')

        // }
  
      }catch(error){
  
        state = 'failed'
        errors.push({
          message:error.message,
          partOf:comic_data.title
        })
  
  
        await sleep(80)
        i+1 !== data.length && console.log('')
        clearInterval(logUpdates)
        state = 'loading'
      }
  
    }
  
    return {
      success:results,
      failed:errors
    }
  }
  
















function getStatus(){
    switch (statusLoading) {
        case 'check-duplicate':
            return chalk.white.bold('Check duplicate data ')
            break;
    
        case 'formater':
            return chalk.white.bold('Formating data ')
            break;
        case 'saving-data':
            return chalk.white.bold('Saving data to file ')
            break;
        case 'done':
            return chalk.bold('Scraping is done')
    }
}


export default async function ScrapingPrompt (scraperTesPrompt){

  
    let logUpdates;
    const response = await inquirer.prompt([
        {
            type:'list',
            name:'page',
            choices:['/','/daftar-komik','/komik/example-manga'],
            message:'Pilih halaman ',
            prefix:'›',
            suffix:':'
        },
        {
            type:'input',
            message:'lokasi penyimpanan ',
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
    
    if(response.page){

        let number_page;
        let url_komik;

        if(response.page === '/daftar-komik'){
            number_page = await  inquirer.prompt([
                {
                    type:'input',
                    name:'num_page',
                    message:'Masukan angka halaman',
                    prefix:'›',
                    suffix:':',
                }
            ])
        }

        // muncul 
        if(response.page === '/komik/example-manga'){
            url_komik = await inquirer.prompt([
                {
                    type:'input',
                    name:'url',
                    message:'Masukan url komik',
                    prefix:'›',
                    suffix:':',
                }
            ])
        }

        switch (response.page) {
            case '/komik/example-manga':

                if(url_komik){
                    DetailKomikPrompt(url_komik.url, response.fullpath)
                }else{
                    console.log('Tidak boleh ada input yang kosong')
                }
                
                break;
            default :
    
                const lastUpdateData = await ExtractorDataComic(response.page,
                    number_page ? true : false , number_page ? Number(number_page.num_page)  : 1
                )

                log('')
                log(chalk.cyan.bold('Success:'),lastUpdateData.success.length)
                log(chalk.red.bold('Failed:'),lastUpdateData.failed.length)
                log('\n')
                await sleep(1000);

                statusLoading = 'check-duplicate'
    
                logUpdates = setInterval(()=>{
                    logUpdate(`${
                        statusLoading === 'done' ?
                        `┌── ${getStatus()}`
                        :
                        getStatus()
                    } ${statusLoading === 'done' ?
                        `${chalk.green("✔")}`
                        : 
                        config.loading.frames.default.frame[counterLooping = ++counterLooping % config.loading.frames.default.frame.length]
                        }`)
                },config.loading.frames.default.interval)
    
                await sleep(2000)
                const formaterResult = duplicatesRemover(lastUpdateData.success,'url')
                statusLoading = 'formater'
                await sleep(3000)
                statusLoading = 'saving-data'
                
                fs.writeFile(response.fullpath, JSON.stringify(lastUpdateData.success),'utf-8',async(err)=>{
                    if(err) throw err
                    
                    await sleep(1000)
                    statusLoading = 'done'

                    await sleep(80)
                    clearInterval(logUpdates);

                    let output = ''+
                        `│\n`+
                        `├── ${chalk.white.bold("Source file")} :\n`+
                        `├── ${chalk.yellow.bold("filename")} › ${response.filename}\n`+
                        `├── ${chalk.cyan.bold("path")} › ${response.fullpath}\n`+
                        `├── ${chalk.red.bold("duplicates")}: ${formaterResult.duplicates.length}\n`+
                        `└── ${chalk.red.bold('log')} › ${response.fullpath.replace(response.filename,'log-error-'+response.filename)}`

                    console.log(output);
                })

                fs.writeFile(response.fullpath.replace(response.filename,'log-error-'+response.filename), JSON.stringify({'log-error':lastUpdateData.errors}),'utf-8',async(err)=>{
                    if(err) throw err
                    
                    await sleep(1000)
                    statusLoading = 'done'

                    await sleep(80)
                    clearInterval(logUpdates);
                })

    
                
                break;
        }
    }
    

}
