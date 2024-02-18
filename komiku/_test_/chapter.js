import axios from 'axios';
import chalk from 'chalk';
import { load } from 'cheerio';
import fs from 'fs';
import path from 'path';
import LogsUpdate from '../utils/LogsUpdate.js';
import inquirer from 'inquirer';
import search from 'inquirer-search-list';
import config from '../../config.js';

inquirer.registerPrompt('search-list', search);

const logUpdate = new LogsUpdate(true);
const log = console.log.bind(console);
const clear = console.clear.bind(console)

const checkWord = /[a-zA-Z]+/g

const to_number = (str)=> checkWord.test(str.split('chapter-')[1].replace(/-bahasa-.+/g,'').replace('-','.')) ?
        Number(str.split('chapter-')[1].replace(/-bahasa-.+/g,'').replace('-','.').replace(/[a-zA-Z]+/g,'25'))
    : Number(str.split('chapter-')[1].replace(/-bahasa-.+/g,'').replace('-','.'))


const getLinkImages = (html)=>{
    const $  = load(html);

    const data = Array.from($('.main-reading-area > img')).map((el)=> $(el).attr('src') )
    return data
}


function checkImageFromDir(outdir,images){

    const dirs = fs.readdirSync(outdir);
    const availabelDownload = [];
    let missingFile ;

    images = images.map((e,i)=>  {
            return {
                url:e,
                filename:`${i}${path.extname(e.split('/')[e.split('/').length - 1 ])}`
            }
        })

    for(let i = 0 ; i < images.length;i++){
        const x = images[i];

        if(!dirs.some(y => y === x.filename)){
            missingFile = x.filename
            break;
        }
    }

    const x = images.map((e)=>{ return e.filename }).indexOf(missingFile)

    

    return images.slice(x)

}




async function DownloadImageasync(dataKomik,outputDir){

    const output = outputDir

    const komik = dataKomik //jsonp.find((e)=> e.url === 'decide-to-be-a-villain')

    if(!fs.existsSync(`${output}/${komik.url}`)){
        fs.mkdirSync(`${output}/${komik.url}`)
    }

    logUpdate.start();
    log('┌────────────────────────────────────────┐')
    log('│              Please wait....           │')
    log('└────────────────────────────────────────┘')

    
    log('┌─ Download image chapter')
    log('│')
    
    
    
    
    
    const chapters = komik.chapters.sort((a,b)=> to_number(a.url) - to_number(b.url))
    let errorDownloader = 0;
    
    log('│- count: '+chapters.length)  


    for(let index = 0 ; index < chapters.length ; index++){

        const chapter = chapters[index];
        let data ;

        try {

    
            await logUpdate.update(`get links ${chapter.label}`).sleep(500);
        
            const gets = await axios.get(chapter._$)
        
            data = getLinkImages(gets.data)
            let startIn = 0
        
            if(!fs.existsSync(`${output}/${komik.url}/${chapter.url}`)){
                fs.mkdirSync(`${output}/${komik.url}/${chapter.url}`)
            }else{
                startIn = data.length - checkImageFromDir(`${output}/${komik.url}/${chapter.url}`,data).length;
            }



        
        
            

            if(startIn !== data.length){

                for(let i = startIn; i < data.length;i++){
    
                    const url = data[i];
                    const filename = url.split('/')[url.split('/').length -1]
        
                    try {
            
                
                        await logUpdate.update(`${chalk.gray(`[${index+1}]`)} lagi download ${filename} ${chalk.gray(`error: [${errorDownloader}/${data.length - 1}]`)}`).sleep(1000);
                
                        if(!fs.existsSync(`${output}/${komik.url}/${chapter.url}/${i}${path.extname(filename)}`)){
                            const buff = await axios.get(url,{ responseType:'arraybuffer' })
                            const base64 = Buffer.from(buff.data,'buffer').toString('base64');
                    
                            fs.writeFileSync(
                                `${output}/${komik.url}/${chapter.url}/`+
                                `${i}${path.extname(filename)}`,
                                base64,
                                'base64'
                            )
                        }
                
                        if((i+1) === data.length){
                            await logUpdate.update(`${chapter.label} berhasil di download ${chalk.gray(`error: [${errorDownloader}/${data.length - 1}]`)}`).sleep(80);
                            errorDownloader = 0
                            await logUpdate.nextTick('done');
                        }
    
                    }catch(error){
                        if((i+1) === data.length){
                            await logUpdate.update(`${chapter.label} berhasil di download ${chalk.gray(`error: [${errorDownloader}/${data.length - 1}]`)}`).sleep(80);
                            errorDownloader = 0
                            await logUpdate.nextTick('done');
                            
                        }else{
                            errorDownloader++
                            await logUpdate.update(`${filename} ${chalk.red(
                                error.response ? error.response.status : error.message
                            )} ${chalk.gray(`error: [${errorDownloader}/${data.length - 1}]`)}`).sleep(4000)
                        }
                    }
            
                }
            }else{
                await logUpdate.update(`${chapter.label} berhasil di download ${chalk.gray(`error: [${errorDownloader}/${data.length - 1}]`)}`).sleep(80);
                errorDownloader = 0
                await logUpdate.nextTick('done');
            }
        }catch(error){
            await logUpdate.update(`${chapter.label} ${chalk.red(
                error.response ? error.response.status : error.message
            )} ${chalk.gray(`error: [${errorDownloader}/${data.length - 1}]`)}`).sleep(4000)
        }

    }
    
}






async function LaunchPrompt(){
    const Prompt = await inquirer.prompt([
        {
            type:'input',
            name:'pathKomik',
            message:'Masukan file komik json',
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
        },
        {
            type:'input',
            name:'output',
            message:'masukan folder untuk image',
            prefix:'›',
            suffix:':',
            validate(input,answers){
                        
                if(input){
                    const path_ = input.startsWith('/') || input.startsWith('C:') ? input : path.join(config.rootDir,input)
                    if(fs.existsSync(path_.split(config.slash).slice(0,-1).join(config.slash))){
                        answers.outputDir = path_

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


    
    
    if(Prompt){

        const fileJSON =Prompt.fullpath
        const outputDir = Prompt.outputDir

        const dataArray = JSON.parse(fs.readFileSync(fileJSON))

        const data = await inquirer.prompt([
            {
                type:'search-list',
                name:'value',
                message:'Pilih komik',
                prefix:'›',
                suffix:':',
                pageSize:20,
                choices:dataArray.map((e)=>({ name:e.title,value:e.title })),
                validate:function(input,answers){
                    answers.komik = dataArray.find((e)=> e.title === input)
    
                    return  true
                    
                }
            }
        ])


        if(data){
            DownloadImageasync(data.komik,outputDir)
        }
    }

}

LaunchPrompt()



// axios.get('https://komikcast.vip/chapter/decide-to-be-a-villain-chapter-10-bahasa-indonesia/')
// .then((result)=>{
//     const c = getLinkImages(result.data);
//     const x = checkImageFromDir(
//         '/run/media/majorsky/OS/Users/ASUS/Desktop/Assets_Komik/decide-to-be-a-villain/decide-to-be-a-villain-chapter-10-bahasa-indonesia',
//         c
//     )

//     console.log(x,c.length - x.length);
// })