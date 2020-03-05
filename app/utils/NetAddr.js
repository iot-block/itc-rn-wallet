import {itcNetworkConfig} from './NetConfig'
import { I18n } from '../config/language/i18n';
import DeviceInfo from "react-native-device-info";

const chinaApiHost = 'https://wallet.iotchain.io/';
const sgWalletApiHost = "https://sg.api.iotchain.io/"

const swftHost = 'https://transfer.swft.pro/';
// const swftHost = 'https://test.swftcoin.com/';

const itcHost = itcNetworkConfig.txServerUrl

function chooseWalletHost(){

  console.log(I18n.locale)
  const localestr =  DeviceInfo.getDeviceLocale().toLowerCase()
  if(localestr.indexOf("zh") != -1){
    return chinaApiHost
  }else {
    return sgWalletApiHost
  }
}

const NetAddr = {
  feedback: ``,
  registerDevice: ``,
  getVersionUpdateInfo: ``,
  getAllTokens: ``,
  getTokensVersion: ``,
  getMessageList: ``,
  readMessage: ``,
  readAllMessage: ``,
  getUnReadMessageCount: ``,
  userInfoUpdate: ``,
  getITGTransactionByAddress: `${itcHost}v0/transaction/holder`,
  getITCTransactionByAddress: `${itcHost}v0/transaction/itc/holder`,
  queryCoinList: `${swftHost}api/v1/queryCoinList`,
  getBaseInfo: `${swftHost}api/v1/getBaseInfo`,
  accountExchange: `${swftHost}api/v2/accountExchange`,
  queryOrderState: `${swftHost}api/v2/queryOrderState`,
  queryAllTrade: `${swftHost}api/v2/queryAllTrade`,
  bindConvertAddress: ``,
  queryConvertAddress: ``,
  queryConvertTxList: ``,
  queryTransactionDetail:``,
  sendcode:``,
  verifycode:``,
  identifySave:``,
  initidentifyquery:``,
  queryETHTxList:`${sgWalletApiHost}wallet/v1/ethTxlist`,
  queryEthTokenTxlist:`${sgWalletApiHost}wallet/v1/ethTokenTxlist`,
  
};

export default NetAddr;
