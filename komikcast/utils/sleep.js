const sleep = async (ms)=> {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(true)
        },ms)
    })
}

export default sleep