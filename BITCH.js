import inquirer from "inquirer";
import KomikcastMain from "./komikcast/index.js";



const websites = [
    {
        website:'Komikcast',
        action:()=> KomikcastMain()
    },{
        website:'Komiku',
        action:()=>{ console.log('Ongoing...') }
    },{
        website:'mangayaro',
        action:()=>{ console.log('Ongoing...') }
    },{
        website:'mangatelo',
        action:()=>{ console.log('Ongoing...') }
    }
]



console.log('Web Komik berbahasa indonesia')

inquirer.prompt([
    {
        type:'list',
        choices:websites.map(c=> c.website),
        name:'web',
        message:'Pilih website',
        prefix:'›',
        suffix:':',
        validate(input,answers){
            
            return true
        }
    }
]).then((respon)=>{
    const thisWeb = websites.find(p=> p.website === respon.web)

    console.clear()
    console.log(`› ${thisWeb.website}`)
    thisWeb.action()
})
