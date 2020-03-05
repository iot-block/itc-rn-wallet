const contract = require('./contract/contract')
const jbokManager = require('./sdkManager/manager')

/**
 * 读取itc余额，多个itc地址
 * @param {*} contractAddress 
 * @param {*} addresses 
 */
async function readITCTokenBalance(contractAddress,addresses){

    let funcs = []

    for (const idx in addresses) {
        
        let func = new Promise((resolve,reject) => {
            
            jbokManager.readContractProperty(contractAddress,'TokenERC20',contract.itcToken.code,"balanceOf",`["${addresses[idx]}"]`,'').then(res=>{

                resolve(res)
            }).catch(err=>{

                reject(err)
            })
        })

        funcs.push(func)
    }


    return Promise.all(funcs).then(res=>{

        let result = {}

        for (const idx in res) {
            let address = addresses[idx]
            result[address] = res[idx]
        }

        return result
    }).catch(err=>{
        console.log('get contract info error -> '+err)
        return null
    })
}



async function readITCTokenContractBaseProperty(contractAddress){

    //name
    let func_0 = new Promise((resolve,reject) => {
        
        jbokManager.readContractProperty(contractAddress,'TokenERC20',contract.itcToken.code,"name",`[]`,'').then(res=>{

            resolve(res)
        }).catch(err=>{

            reject(err)
        })
    })

    let func_1 = new Promise((resolve,reject) => {
        
        jbokManager.readContractProperty(contractAddress,'TokenERC20',contract.itcToken.code,"symbol",`[]`,'').then(res=>{

            resolve(res)
        }).catch(err=>{

            reject(err)
        })
    })

    let func_2 = new Promise((resolve,reject) => {
        
        jbokManager.readContractProperty(contractAddress,'TokenERC20',contract.itcToken.code,"balanceOf",`["0x9a4cb62cb6c505767a4da6300ba5f39e761b5370"]`,'').then(res=>{

            resolve(res)
        }).catch(err=>{

            reject(err)
        })
    })

    return Promise.all([func_0,func_1,func_2]).then(res=>{

        return {
            name:res[0],
            symbol:res[1],
            balanceOf:res[2]
        }
    }).catch(err=>{
        console.log('get contract info error -> '+err)
        return null
    })
}

async function queryAllownce(contractAddress,formAddress,toAddress){

    let paramsStr =  JSON.stringify([formAddress,toAddress])
    console.log(paramsStr)

    return jbokManager.readContractProperty(contractAddress,'TokenERC20',contract.itcToken.code,"allowance",paramsStr,'')
}

async function generalApproveTxData(contractAddress,formAddress,address,amount){

    let paramsStr =  JSON.stringify([address,amount])
    console.log(paramsStr)

    let startSign = paramsStr.indexOf(',')
    let endSign = paramsStr.indexOf(']')

    let param = paramsStr.substr(0,startSign+1)+paramsStr.substr(startSign+2,endSign-startSign-3)+paramsStr.substr(endSign,1)
    console.log(param)
    
    let accountJson = await jbokManager.getAccount(formAddress)
    
    return jbokManager.generalHandleContractFunctionTxData(contractAddress,
        'TokenERC20',
        "approve",
        param,
        contract.itcToken.code,
        accountJson.result.nonce,
        )
}

async function approve(privateKey,contractAddress,address,amount,hashCall){

    console.log(amount)

    let paramsStr =  JSON.stringify([address,amount])
    console.log(paramsStr)

    let startSign = paramsStr.indexOf(',')
    let endSign = paramsStr.indexOf(']')

    let param = paramsStr.substr(0,startSign+1)+paramsStr.substr(startSign+2,endSign-startSign-3)+paramsStr.substr(endSign,1)
    console.log(param)

    return jbokManager.handleContractFunction(contractAddress,
        'TokenERC20',
        contract.itcToken.code,
        "approve",
        param,
        privateKey,
        hashCall)
}
async function transferITC(privateKey,contractAddress,address,amount,gasPrice,gasLimit,hashCall){

    console.log(amount)

    let paramsStr =  JSON.stringify([address,amount])
    console.log(paramsStr)

    let startSign = paramsStr.indexOf(',')
    let endSign = paramsStr.indexOf(']')

    let param = paramsStr.substr(0,startSign+1)+paramsStr.substr(startSign+2,endSign-startSign-3)+paramsStr.substr(endSign,1)
    console.log(param)

    return jbokManager.handleContractFunction(contractAddress,
        'TokenERC20',
        contract.itcToken.code,
        "transfer",
        param,
        privateKey,
        hashCall,
        gasPrice,
        gasLimit)
}

module.exports={
    readITCTokenBalance,
    queryAllownce,
    readITCTokenContractBaseProperty,
    transferITC,
    generalApproveTxData,
    approve
}