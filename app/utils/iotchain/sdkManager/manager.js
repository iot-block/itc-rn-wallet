import {itcNetworkConfig} from '../../../utils/NetConfig'

const jbokSdk = require("../jbok-sdk/init");
const jbokApi = jbokSdk(itcNetworkConfig.nodeUrl);
const listen = require('./trxListen')
const ethjsaccount = require('ethjs-account');

/**
 * 生成合约调用方法的交易数据
 * @param {*} contractAddress 
 * @param {*} contractName 
 * @param {*} funcName 
 * @param {*} funcParam 
 * @param {*} contractCode 
 * @param {*} nonce 
 */
const generalHandleContractFunctionTxData = async function(
    contractAddress,
    contractName,
    funcName,
    funcParam,
    contractCode,
    nonce,
    from,
    gasPrice,
    gasLimit
    ) {
    
    console.log('function params->'+funcParam)

    try{
        // 调用合约
        const contractStr = jbokApi.utils.contractParser.parse(contractCode);
        const contractJsonObj = JSON.parse(contractStr);

        if (contractJsonObj && contractJsonObj.error === "") {
            
            const contractObj = jbokApi.utils.jsonCodec.decodeContracts(
                JSON.stringify(contractJsonObj.contracts)
            );
            /**
             * contractObj.encode(contractName:String,method:String,params:String)
             */
            const payload = contractObj.encode(contractName, funcName, funcParam);
            console.log("payload:", payload);

            const contractTx = {
                from:from || '',
                nonce: nonce,
                gasPrice: gasPrice || "1",
                gasLimit: gasLimit || "6000000",
                receivingAddress: contractAddress,
                value: "0",
                payload: payload
            };

            return contractTx
        }
        else{
            return null
        }
    }
    catch(err){

        console.log("parseContractCode err", err);
        return null
    }
    
}

/**
 * 获取最新区块号
 */
const getBestBlockNumber = async ()=>{

    try{
        let receipt = await jbokApi.block.getBestBlockNumber()
        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}



/**
 * 获取区块事件
 * @param {*} blockNumber 区块号
 */
const getBlockByNumber = async (blockNumber)=>{

    try{
        let receipt = await jbokApi.block.getBlockByNumber(blockNumber+'')

        let blockData = JSON.parse(receipt)
        let result = blockData.result
        let {header} = result

        let blockJson = JSON.stringify(result)
        let block = jbokApi.utils.jsonCodec.decodeBlock(blockJson) //decode json into 'Block'
        let bytes = jbokApi.utils.binaryCodec.encodeBlockHeader(block.header)    // encode block header into bytes(rlp)
        header.hash = '0x'+jbokApi.utils.haser.kec256(bytes)//calculate keccak256 hash

        let {transactionList} = result.body
        let contractList = []

        //获取header交易数量
        header.txAmount = transactionList.length
    
        //解析出交易中senderAddress和hash和gasUsed
        for (const idx in transactionList) {
    
            let transaction = transactionList[idx]
    
            let txJson = JSON.stringify(transaction)
    
            //senderAddress
            let sigTx = jbokApi.utils.jsonCodec.decodeSignedTransaction(txJson)
            transaction.senderAddress = jbokApi.utils.signer.getSender(sigTx)
            transaction.receivingAddress = transaction.receivingAddress
    
            // hash
            let bytesTx = jbokApi.utils.binaryCodec.encodeTx(sigTx)
            transaction.hash = '0x'+jbokApi.utils.haser.kec256(bytesTx)
    
            let receipt = await getTxReceipt(transaction.hash)
            if(receipt){
                transaction.gasUsed = receipt.result.gasUsed,
                transaction.logsBloomFilter = receipt.result.logsBloomFilter
                transaction.logs = receipt.result.logs
                transaction.status = receipt.result.status
            }

            if(receipt.result.contractAddress){

                //获取合约信息
                let contract = await getContract(receipt.result.contractAddress)
                if(contract){
                    contractList.push(contract)
                }
            }
    
            // console.log('receipt->'+JSON.stringify(txJson))
        }

        let parseBlockData  = {
            header:header,
            body:{
                transactionList,
                contractList,
            }
        }


        return Promise.resolve(parseBlockData)
    }
    catch(err){
        return Promise.reject(err)
    }
}

/**
 * 获取最新区块下的账号信息
 * @param {*} address 地址
 */
const getAccount = async (address)=>{

    try{
        let receipt = await jbokApi.account.getAccount(address)
        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}

/**
 * 获取最新区块下的地址余额信息
 * @param {*} address 地址
 */
const getBalance = async (address)=>{

    try{
        let receipt = await jbokApi.account.getBalance(address)
        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}
    
/**
 * 获取交易凭据
 * @param {*} hash 交易HASH
 */
const getTxReceipt = async (hash)=>{

    try{
        let receipt = await jbokApi.transaction.getReceipt(hash)
        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}

/**
 * 获取交易
 * @param {*} hash 交易HASH
 */
const getTxDetail = async (hash)=>{

    try{
        let receipt = await jbokApi.transaction.getTx(hash)
        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}

const getSuggestGasPrice = async ()=>{

    try{
        let receipt = await jbokApi.contract.getGasPrice()
        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}

const getEstimatedGas = async (txJson)=>{

    try{
        let receipt = await jbokApi.contract.getEstimatedGas(txJson)
        console.log('getEstimatedGas result:'+receipt)

        return Promise.resolve(JSON.parse(receipt))
    }
    catch(err){
        return Promise.reject(err)
    }
}

/**
 * 发送交易
 * @param {object} txJson
 * @param {string} priKey
 * @param {int} chainId
 */
const sendSignedTransaction = async function(txJson,hashCallBack) {

    return new Promise(async (resolve,reject)=>{

        try{
            var sendRspJson = await jbokApi.transaction.sendTx(txJson);
            let sendRsp = JSON.parse(sendRspJson)

            if(sendRsp && sendRsp.result){

                if(hashCallBack){
                    hashCallBack(sendRsp.result)
                }

                //监听交易
                // await listen.listenTrx(sendRsp.result).then(async receipt=>{
                //     resolve(receipt)
                // }).catch(err=>{
                //     reject(err)
                // })  

                resolve(sendRsp.result)
            }
            else{
                reject('sendSignedTransaction failed')
            }
           
            
        }
        catch(err){

            console.log('发送签名交易失败，'+err)
            reject(err)
        }
    })
}

/**
 * 发送交易
 * @param {*} txJson 交易信息
 * @param {*} priKey 私钥
 * @param {*} chainId 链ID
 */
const sendTransaction = async (txJson, priKey, chainId, hashCallBack) =>{

    //默认chainId 10
    chainId = chainId ? chainId : itcNetworkConfig.chainId
    
    const trx = jbokApi.utils.signTx(txJson,priKey,chainId)
    return sendSignedTransaction(trx,hashCallBack)
}

const getContract = async(address)=>{

    let contractSourceCode = (contractAddress)=>{

        return new Promise((resolve,reject)=>{

            jbokApi.contract.getSourceCode(contractAddress).then(response=>{
                
                let responseJson = JSON.parse(response)

                if(responseJson.data){
                    resolve(responseJson.data)
                }
                else{
                    reject()
                }
                
            }).catch(err=>{
                reject()
            })
        })
    }

    let contractAbi = (contractAddress)=>{

        return new Promise((resolve,reject)=>{

            jbokApi.contract.getABI(contractAddress).then(response=>{

                let responseJson = JSON.parse(response)

                if(responseJson.data){
                    resolve(responseJson.data)
                }
                else{
                    reject()
                }

            }).catch(err=>{
                reject()
            })
        })
    }

    return Promise.all([contractSourceCode(address),contractAbi(address)]).then(res=>{

        return {
            address,
            sourceCode:res[0],
            abi:res[1]
        }
    }).catch(err=>{

        return null
    })
}

/**
 * 部署合约
 * @param {*} privateKey 
 * @param {*} codebyte 
 * @param {*} params 
 * @param {*} chainId 
 * @param {*} hashCallBack 交易hash的反馈
 */
 const deployContrct = async (privateKey, codebyte, params, chainId, hashCallBack) =>{

    //默认chainId 10
    chainId = chainId ? chainId : itcNetworkConfig.chainId

    let address = privateKeyToAddress(privateKey)
    let accountJson = await getAccount(address)

    //每个参数都会被编码成32字节的倍数，拼接再codebyte后面
    if(params && params.length > 0){

        for (const idx in params) {
            
            let param = params[idx]
            
            let newParam = param + ''
            
            for(let i=0;i<64 - param.length%64;i++){
                newParam = '0'+newParam
            }

            codebyte = codebyte + newParam
        }
    }

    const txJson = {
        nonce:accountJson.result.nonce,
        gasPrice:"1",
        gasLimit:"1500000",
        receivingAddress:"",
        value:"0",
        payload:codebyte
    }
    

    return sendTransaction(txJson,privateKey,null,hashCallBack)
 }

/**
 * 执行合约方法
 * @param {*} contractAddress 合约地址
 * @param {*} contractName 合约名称
 * @param {*} contractCode 合约代码
 * @param {*} funcName 方法名称
 * @param {*} funcParam 方法参数
 * @param {*} privateKey 私钥
 * @param {*} hashCall 交易hash回调
 */
 const handleContractFunction = async (contractAddress,contractName,contractCode,funcName,funcParam,privateKey,hashCall,gasPrice,gasLimit)=>{

    // 调用合约
    const contractStr = jbokApi.utils.contractParser.parse(contractCode);
    const contractJsonObj = JSON.parse(contractStr);

    if (contractJsonObj && contractJsonObj.error === "") {
        
      const contractObj = jbokApi.utils.jsonCodec.decodeContracts(
        JSON.stringify(contractJsonObj.contracts)
      );
      /**
       * contractObj.encode(contractName:String,method:String,params:String)
       */
      const payload = contractObj.encode(contractName, funcName, funcParam);
      console.log("payload:", payload);

      let address = privateKeyToAddress(privateKey)
      let accountJson = await getAccount(address)

      const contractTx = {
        nonce: accountJson.result.nonce,
        gasPrice: gasPrice || "1",
        gasLimit: gasLimit || "1500000",
        receivingAddress: contractAddress,
        value: "0",
        payload: payload
      };

      console.log('调用合约方法的参数'+contractAddress + ' ' + funcName+ ' ' +funcParam + ' ' + privateKey+ ' ' +accountJson.result.nonce)

      return sendTransaction(contractTx,privateKey,null,hashCall)
    }
    
    return Promise.reject('handleContractFunction result , contract parse error')
 }


 /**
  * 读取合约属性
  * @param {*} contractAddress 合约地址
  * @param {*} contractName 合约名称
  * @param {*} contractCode 合约完整代码
  * @param {*} funcName 合约方法
  * @param {*} funcParam 合约参数
  * @param {*} fromAddress 查询发起地址
  */
const readContractProperty = async (contractAddress,contractName,contractCode,funcName,funcParam,fromAddress)=>{

     //查询合约
     const contractStr = jbokApi.utils.contractParser.parse(contractCode);
     const contractJsonObj = JSON.parse(contractStr);
     if (contractJsonObj && contractJsonObj.error === "") {
       const contractObj = jbokApi.utils.jsonCodec.decodeContracts(
         JSON.stringify(contractJsonObj.contracts)
       );
       const data = contractObj.encode(
        contractName,
        funcName,
        funcParam
       );
       // call合约
       const callTx = {
         from: fromAddress == null ? "" : fromAddress,
         to: contractAddress,
         // gas: Option[BigInt],
         gasPrice: "0",
         value: "0",
         data: data
       };
       const resp = await jbokApi.contract.call(callTx);

       try{
            // console.log("resultby:", JSON.parse(resp).result);
            /**
             * contractObj.decode(contractName:String,method:String,params:String)
             * params 传call返回的值
             */
            const result = contractObj.decode(
                contractName,
                funcName,
                JSON.parse(resp).result
            );
            // console.log("result:", JSON.parse(result)[0]);

            return Promise.resolve(result)
       }
       catch(err){

            return Promise.reject(err)
       }
     }
}

/**
 * 发送ITG
 * @param {*} privateKey 
 * @param {*} receiveAddress 
 * @param {*} amount 
 * @param {*} hashCallBack 
 */
const transferITG = async (privateKey,receiveAddress,nonce,amount,gasPrice,gasLimit,hashCallBack)=>{

    if(!nonce){
        let address = privateKeyToAddress(privateKey)
        var accountJson = await getAccount(address)
    }

    const txJson = {
        nonce:nonce?nonce:accountJson.result.nonce,
        gasPrice:gasPrice?gasPrice:"1",
        gasLimit:gasLimit?gasLimit:"42000",
        receivingAddress:receiveAddress,
        value:amount,
        payload:""
    }

    return sendTransaction(txJson,privateKey,null,hashCallBack)
}


function privateKeyToAddress(privateKey) {

    return ethjsaccount.privateToAccount(privateKey).address;
}

async function kec256(data){
    // let buffer = new Buffer("Transfer(address,address,uint256)")
    let buffer = new Buffer(data)
    return jbokApi.utils.haser.kec256(buffer)
}


module.exports = {    
    // ------ transaction ------
    getTxReceipt,
    getTxDetail,
    sendTransaction,
    sendSignedTransaction,
    generalHandleContractFunctionTxData,
    transferITG,
    getSuggestGasPrice,
    getEstimatedGas,

    // ------ block ------

    getBestBlockNumber,
    getBlockByNumber,

    // ------ account ------
    getAccount,
    getBalance,

    // ------ contract ------
    deployContrct,
    getContract,
    handleContractFunction,
    readContractProperty,

    //utils
    kec256
}