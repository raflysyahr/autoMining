import { spawn } from 'child_process'
import sleep from './sleep.js';

//export default 
export default async function checkNet(){
    let result ;     
    const proc = spawn('ping',['8.8.8.8'])


    proc.stdout.on('data',(respon)=>{

        result = String(respon).trim()

    })

    await sleep(3000)

    proc.kill()
    return result ? result.includes('64 bytes from 8.8.8.8') : false

}

