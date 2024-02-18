import chalk from 'chalk';
import logUpdate from 'log-update';
import config from '../../config.js';
import sleep from './sleep.js';


const statusCode = (status,frame)=>{
    if(status === 'done' || status === 'finally' || status === 'finally_done' ) return chalk.green("✔")
    if(status === 'failed') return chalk.red("✖")

    return frame
}



class LogsUpdate {
    counter;
    status;
    frames;
    logInterval;
    interval;
    text;
    prefix;

    constructor(prefix){
        this.prefix = prefix
        this.counter = 0 ;
        this.text ='Mohon tunggu'
        this.status = 'loading';
        this.frames = config.loading.frames.default.frame;
        this.interval = config.loading.frames.default.interval
    }



    start(){
        this.status = 'loading'
        this.logInterval = setInterval(() => {
            const frame = config.loading.frames.default.frame[this.counter = ++this.counter % config.loading.frames.default.frame.length];

            logUpdate(`${
                this.prefix ? (
                    this.status === 'loading' ? '└─' : ( this.status === 'finally' ? '\n›' : ( this.status === 'finally_done' ? '└──' :'├──'))
                ) :'›'
            } ${this.text} ${ statusCode(this.status,frame)}`)

        }, this.interval);
    }



    update(message){
        this.text = message

        return {
            async sleep(ms){
                await sleep(ms)
            }
        }
    }


    async nextTick(status){
        this.status = status
        await sleep(80)
        console.log('')
        this.status = 'loading'

    }

    async stop(status){
        this.status = status
        await sleep(500)
        clearInterval(this.logInterval)
    }
}

export default LogsUpdate


