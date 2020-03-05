import FetchUtils from "./FetchUtils";

const token = '9PT9SQC3YIZ6PYC2HTZ23GDUAG7XPEH74G'

export default class EtherscanApi{

    static getTxList = async (address,page,offset)=>{

        return FetchUtils.requestGet(
            `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=${offset}&sort=desc&apikey=${token}`
          );
    }

    static getTokenTxList = async (contractaddress,address,page,offset)=>{
    
        return FetchUtils.requestGet(
            `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractaddress}&address=${address}&page=${page}&offset=${offset}&sort=desc&apikey=${token}`
          );
    }
}