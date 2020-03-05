import * as types from './ActionType';
import StorageManage from '../../utils/StorageManage';
import { StorageKey } from '../GlobalConfig';

function generateMnemonic(mnemonic) {
  return {
    type: types.GENERATE_MNEMONIC,
    mnemonic,
  };
}

function setWalletTransferParams(walletTran) {
  return {
    type: types.WALLET_TRANSFER,
    walletTransfer: walletTran,
  };
}

function setTransactionDetailParams(transactionDetail) {
  return {
    type: types.TRANSACTION_DETAIL,
    transactionDetail,
  };
}
function addToken(token) {
  return {
    type: types.ADD_TOKEN,
    token: {
      iconLarge: token.iconLarge,
      symbol: token.symbol,
      name: token.name,
      decimal: parseInt(token.decimal, 10),
      address: token.address,
    },
  };
}

function removeToken(address) {
  return {
    type: types.REMOVE_TOKEN,
    address,
  };
}

function loadTokenBalance(tokens) {
  return {
    type: types.LOAD_TOKEN_BALANCE,
    tokens,
  };
}

function setTotalAssets(value) {
  return {
    type: types.SET_TOTAL_ASSETS,
    value: value.toFixed(2),
  };
}

function setTransactionRecoders(value) {
  return {
    type: types.SET_TRANSACTION_RECODER,
    recoders: value,
  };
}

function setCoinBalance(value) {
  return {
    type: types.SET_COIN_BALANCE,
    balance: value,
  };
}

function setNetWork(value) {
  StorageManage.save(StorageKey.Network, value);
  return {
    type: types.SET_NETWORK,
    network: value,
  };
}

function setLanguage(value) {
  return {
    type: types.SET_LANGUAGE,
    myLanguage: value,
  };
}
function setUserInfo(value) {
  return{
    type:types.SET_USERINFO,
    userinfo:value
  }
}
function setMonetaryUnit(value) {
  return {
    type: types.SET_MONETARY_UNIT,
    monetaryUnit: value,
  };
}

function setNewTransaction(value) {
  return {
    type: types.SET_NEW_TRANSACTION,
    newTransaction: value,
  };
}

function setFirstQR() {
  return {
    type: types.SET_FIRST_QR,
  };
}

function setPinInfo(value) {
  return {
    type: types.SET_PIN_INFO,
    pinInfo: value,
  };
}

function setIsNewWallet(value) {
  return {
    type: types.IS_NEW_WALLET,
    isNewWallet: value,
  };
}

function setContactList(value) {
  return {
    type: types.SET_CONTACT_LIST,
    contactList: value,
  };
}

function setAllTokens(allTokens) {
  return {
    type: types.SET_ALL_TOKENS,
    allTokens,
  };
}

function setTransactionRecordList(transferRecordList) {
  return {
    type: types.SET_TRANSFER_RECORD_LIST,
    transferRecordList,
  };
}

function setItcWalletList(itcWalletList) {
  return {
    type: types.SET_ITC_WALLET_LIST,
    itcWalletList,
  };
}

function setEthWalletList(ethWalletList) {
  return {
    type: types.SET_ETH_WALLET_LIST,
    ethWalletList,
  };
}

function setCurrentWallet(wallet) {
  return {
    type: types.SET_CURRENT_WALLET,
    wallet,
  };
}

function setCreateWalletParams(createWalletParams) {
  return {
    type: types.CREATE_WALLET_PARAM,
    createWalletParams,
  };
}

function setExchangeDepositStatus(orderId) {
  return {
    type: types.EXCHANGE_DEPOSITED,
    orderId,
  };
}

function setActivityEthAddress(address){
  return {
    type: types.ACTIVITY_ADDRESS,
    address,
  };
}

function setSelectActivityContainerKey(key){
  return {
    type : types.SELECT_AVTIVITY_CONTAINER_KEY,
    key
  }
}

function setKeyContractAddress(addressInfoDic){
  return {
    type : types.KEY_CONTRACT_ADDRESS,
    addressInfoDic
  }
}

function setActivityItcAddress(address){
  return {
    type: types.ACTIVITY_ITC_ADDRESS,
    address,
  };
}

function setActivityStatus(status){
  return {
    type: types.ACTIVITY_RUNING_STATUS,
    status,
  };
}


function setActivityRuleReadStatus(status){
  return {
    type:types.ACTIVITY_RULE_READ,
    status
  }
}




export {
  generateMnemonic,
  setWalletTransferParams,
  setTransactionDetailParams,
  addToken,
  loadTokenBalance,
  setTotalAssets,
  setTransactionRecoders,
  setCoinBalance,
  setNetWork,
  removeToken,
  setLanguage,
  setMonetaryUnit,
  setNewTransaction,
  setFirstQR,
  setPinInfo,
  setIsNewWallet,
  setContactList,
  setAllTokens,
  setTransactionRecordList,
  setItcWalletList,
  setEthWalletList,
  setCurrentWallet,
  setCreateWalletParams,
  setExchangeDepositStatus,
  setActivityEthAddress,
  setSelectActivityContainerKey,
  setKeyContractAddress,
  setActivityItcAddress,
  setActivityStatus,
  setActivityRuleReadStatus,
  setUserInfo
};
