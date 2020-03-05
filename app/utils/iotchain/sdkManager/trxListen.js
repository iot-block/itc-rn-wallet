import {itcNetworkConfig} from '../../../utils/NetConfig'

const jbokSdk = require("../jbok-sdk/init");
const jbokApi = jbokSdk(itcNetworkConfig.nodeUrl);
console.log("----+++++"+itcNetworkConfig.nodeUrl)

async function listenItcChainTrx(hash,receipt,failed){

    try{

        let receiptRspJson = await jbokApi.transaction.getReceipt(hash)
        console.log("\ngetTransactionReceipt:", receiptRspJson);
    
        if(receiptRspJson.indexOf(hash) != -1){
            console.log('已确认交易->'+hash)

            let currentBlock = await jbokApi.block.getBestBlockNumber()
            console.log(currentBlock)
            
            let rsp = JSON.parse(receiptRspJson)
            receipt(rsp)
        }
        else{
            console.log('3秒后继续查询交易 0x'+hash)
            setTimeout(() => {
                listenItcChainTrx(hash,receipt,failed)
            }, 3 * 1000); //2秒后执行
        }
    }
    catch(err){
        failed(err)
    }
}

async function listenTrx(hash){

    console.log('开始监听Hash'+hash)

    return new Promise((resolve,reject)=>{

        listenItcChainTrx(hash,receipt=>{
            resolve(receipt)
        },err=>{
            reject(err)
        })
    })
}

module.exports = {
    listenTrx
}