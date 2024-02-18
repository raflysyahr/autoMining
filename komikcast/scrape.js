import inquirer from 'inquirer'
import inquirerSearch from 'inquirer-search-list';
import fs from 'fs';
import chalk from 'chalk';
import sleep from './utils/sleep.js';
import { fileURLToPath } from 'url';
import path from 'path';
import config from '../config.js';
import logUpdate from 'log-update';
import { duplicatesRemover } from './utils/duplicateRemover.js';

const log = console.log.bind(console);
const __filename = fileURLToPath(import.meta.url)
//console.log(path.resolve(__filename,'../../data.json'))
const data =JSON.parse(fs.readFileSync(path.resolve(__filename,'../../data.json')))



const tesErrorData = [
  'Tsuihou Sareta Tenshou Juu Kishi wa Game Chishiki de Musou Suru',
  'Amai-san wa Tsumetakute Amai',
  'The Novel’s Extra (Remake)'
]







let counterLooping = 0
// let state = {
//   indexing:0,
//   success:false,

// }

let state = 'loading'

// ${state.indexing === i+1 && state.success === true  ? '[✓]' :(
//   state.indexing === i+1 && state.success === false ? '[x]' : frame)}

const checkErrorOrNo = (stat,frame)=>{
  // if(stat.indexing === i+1 && stat.success === true) return '[✓]'
  // if(stat.indexing === i+1 && stat.success === false) return '[x]'
  if(stat === 'success') return '[✓]'
  if(stat === 'failed') return '[x]'
  return frame
}

async function scraperTesPrompt(){
  let logUpdates;
  const results = [];
  const errors = []

  console.clear()
  
  log('┌────────────────────────────────────────┐')
  log('│              Please wait....           │')
  log('└────────────────────────────────────────┘')

  
  log('┌─ Scraping Komik')
  log('│')
  log('│- count: '+data.length)    


  for(let i = 0 ; i < data.length ; i++){

    const child_data = data[i]
    try {
  

      logUpdates = setInterval(() => {
          const frame = config.loading.frames.default[counterLooping = ++counterLooping % config.loading.frames.default.length];
          logUpdate(`${
            state === 'success' || state === 'failed' ? '├──' : '└─'
          } ${child_data.title} ${checkErrorOrNo(state,frame)}`);
      }, config.loading.frames.default.interval);

      
      await sleep(3000)

      if(tesErrorData.some((e)=> e === child_data.title)) throw Error('Komik ini tidak mendukung scraping!')

      if(tesErrorData.some((e)=> e !== child_data.title)){
        results.push(child_data)
  
        state = 'success'
  
        await sleep(80);
        
        i+1 !== data.length && console.log('')
        clearInterval(logUpdates)
        state = 'loading';
        i+1 === data.length && console.log('│')
        i+1 === data.length && console.log('└─ All Done')
      }

    }catch(error){

      state = 'failed'
      errors.push({
        message:error.message,
        partOf:child_data.title
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





const MenuAction = async(menu) => {
  menu = menu.toLocaleLowerCase();


  switch (menu) {
    case 'replacer':

      const result = await inquirer.prompt([
        {
          type:'input',
          name:'currentFile',
          message:'Current file',
          prefix:'➤',
          suffix:'？'
        },
        {
          type:'input',
          name:'newFile',
          message:'New file',
          prefix:'➤',
          suffix:'？'
        }
      ])

      
      break;
    case 'filter':

        const filesFilter = await inquirer.prompt([
          {
            type:'input',
            name:'currentFile',
            message:'Current file',
            prefix:'›',
            suffix:'？'
          }
        ])
  
        if(fs.existsSync(filesFilter.currentFile) && path.extname(filesFilter.currentFile) === '.json'){
          const datas = JSON.parse(fs.readFileSync(filesFilter.currentFile))
          const key_datas = Object.keys(datas[0])
          const keys = await inquirer.prompt([
            {
              type:'list',
              choices:key_datas,
              name:'key',
              message:'pilih key untuk filer data',
              prefix:'›',
              suffix:'？'
            }
          ])

          if(keys.key){
            const resultsFiltering = duplicatesRemover(filesFilter,keys.key)
            console.log(chalk.cyan.bold('Result:'),resultsFiltering.result.length)
            console.log(chalk.red.bold('Duplicates'),resultsFiltering.duplicates.length)
            console.log(chalk.red.bold(' ↓↓↓↓↓ '))

            console.log('───────┬─────────────────────────────────────────────────────────────')
            console.log(` index │ File: ${filesFilter.currentFile.split('/')[filesFilter.currentFile.split('/').length -1 ]}`)
            console.log('───────┼─────────────────────────────────────────────────────────────')
            
            let isMore = false
            resultsFiltering.duplicates.map((e,ind)=>{

              if(e.index < 99 ){
                console.log(`  ${
                  e.index < 9 ? chalk.cyan('0'+e.index) : chalk.cyan(e.index)
                }   │ ${e.title.length > 60 ? e.title.slice(0,57)+'...' : e.title}`)

                ind + 1 === resultsFiltering.duplicates.length && console.log('───────┼─────────────────────────────────────────────────────────────')
              }else{
                !isMore && console.log('───────┼─────────────────────────────────────────────────────────────')
                !isMore && console.log('  '+chalk.red('99+')+'  │ '+chalk.gray('more data...  '))
                isMore = true
              }
            })
            
            const confirmPrompt = await inquirer.prompt([{
              type:'confirm',
              message:'Apakah mau di simpan?',
              name:'confirmSave',
              prefix:'›',
              suffix:'？'
            }])
            
            if(confirmPrompt.confirmSave){
              try {
                const newFilePrompt =  await inquirer.prompt([{
                  type:'input',
                  name:'newFile',
                  message:'New file',
                  prefix:'➤',
                  suffix:'？'
                }])

                if(newFilePrompt.newFile && path.extname(newFilePrompt.newFile) === '.json'){
                  fs.writeFile(newFilePrompt.newFile, JSON.stringify(resultsFiltering.result),'utf-8',(err)=>{
                      try{
                        if(err) throw err
                        console.log('File berhasil di simpan '+chalk.green('✔'))
                      }catch(error){
                        console.log(chalk.bgRed.white(error.message))
                        
                      }
                  })
                }else{

                  !newFilePrompt.newFile && console.log(chalk.red('path new file tidak boleh kosong!'))
                  path.extname(newFilePrompt.newFile) !== '.json' && console.log(chalk.bgRed.white('file harus berekstensi .json'))
                  
                }

              }catch(error){
                console.log(chalk.bgRed.white(error.message))
                
              }
            }else{
              console.log(chalk.cyan('Bye bye!!'))
            }

          }
        }else{
          console.log(`file ${chalk.bgRed.white(filesFilter.currentFile.split('/')[filesFilter.currentFile.split('/').length -1 ])} tidak di temukan!`)
        }

        
        break;
    case 'scraper':

      const scraperInput = await inquirer.prompt([
        {
          type:'list',
          choices:['home','daftar komik','detail','chapter'],
          name:'destination',
          message:'Bagian mana yang mau kamu ekstrak',
          prefix:'➤',
          suffix:'？'
        }
      ])

      if(scraperInput.destination){
        const results = await scraperTesPrompt()

        console.log(chalk.cyan.bold('Success:'),results.success.length)
        console.log(chalk.red.bold('Failed:'),results.failed.length)
      }
    
      break;
    case 'formater':
    
    break;
  }
}
// ✗
const main = () => {
  log('┌────────────────────────────────────────┐');
  log('│                 SC-T                   │')
  log('└────────────────────────────────────────┘');
  log('by github/Raflysyahr\n')

  inquirer.prompt([
    {
      choices:['Replacer ⟲','Scraper ☠','Formater ⌗','Filter ▼'],
      type:'list',
      name:'menu',
      message:'Choose menu',
      prefix:'⬢',
      suffix:'↓'
    }
  ]).then((menu)=>{
    MenuAction(menu.menu.split(' ')[0])
  })



}

main()
