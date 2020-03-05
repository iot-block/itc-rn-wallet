import Web3 from "web3";
import BigNumber from "bignumber.js";
import etherscan from "etherscan-api";
import lodash from "lodash";
import { DeviceEventEmitter, NativeModules } from "react-native";
import store from "../config/store/ConfigureStore";
import { erc20Abi, nodeBallotAbi, defaultTokensOfITC,defaultMethodID } from "./Constants";
import LayoutConstants from "../config/LayoutConstants";
import StorageManage from "./StorageManage";
import { StorageKey, Network, TransferGasLimit, ItcChainId } from "../config/GlobalConfig";
import { addToken, loadTokenBalance, setTotalAssets } from "../config/action/Actions";
import { I18n } from "../config/language/i18n";
import FetchUtils from "./FetchUtils";
import Analytics from "./Analytics";
import JbokManager from "./iotchain/sdkManager/manager";
import TokenContractHandle from "./iotchain/tokenContractHandle";
import NetAddr from "./NetAddr";
import {itcNetworkConfig} from './NetConfig'
import EtherscanApi from "./EtherscanApi";

// const Ether = new BigNumber(10e17);
const api = etherscan.init(LayoutConstants.ETHERSCAN_API_KEY, store.getState().Core.network, 10000);
const RNGetInfo = NativeModules.RNGetInfo;
const iotchain_network_mainnet = RNGetInfo.iotchain_network_mainnet;
let web3;
export default class NetworkManager {
  static getWeb3Instance() {
    return new Web3(this.getWeb3HTTPProvider());
  }

  static subStringNum(a, num) {

    if (a > 0 && a < 0.0001) {
      a = 0;
    }

    a = a + "";
    var aArr = a.split(".");

    if (aArr.length > 1) {
      a = aArr[0] + "." + aArr[1].substr(0, num);
    }
    return a;
  }

  static getWeb3HTTPProvider() {
    switch (store.getState().Core.network) {
      case Network.ropsten:
        return new Web3.providers.HttpProvider(
          `https://ropsten.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
      case Network.kovan:
        return new Web3.providers.HttpProvider(
          `https://kovan.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
      case Network.rinkeby:
        return new Web3.providers.HttpProvider(
          `https://rinkeby.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
      default:
        return new Web3.providers.HttpProvider(
          `https://mainnet.infura.io/v3/${LayoutConstants.INFURA_API_KEY}`
        );
    }
  }

  /**
   * Get the user's wallet balance of a token
   *
   * @param {Object} token
   */
  static getBalance({ address, symbol, decimal }) {
    // token数据结构
    const { wallet } = store.getState().Core;
    if (wallet.type === "itc") {
      return this.iotcGetBalance(wallet, { address, symbol, decimal });
    }

    return this.getBalanceOfETH(wallet, { address, symbol, decimal });
  }

  static getBalanceOfETH(wallet, { address, symbol, decimal }) {
    if (symbol === "ETH") {
      return this.getEthBalance(wallet.address);
    }
    return this.getEthERC20Balance(wallet.address, address, decimal);
  }

  static iotcGetBalance(wallet, { address, symbol, decimal }) {

    if (symbol.toLocaleUpperCase() == "ITG") {

      return this.getItgBalance(wallet);
    }

    return this.getIotITCBalance(wallet.address, address, decimal);
  }

  static async getIotITCBalance(walletAddress, address, decimal) {

    try {

      let balanceMap = await TokenContractHandle.readITCTokenBalance(address, [walletAddress]);
      let balanceArr = JSON.parse(balanceMap[walletAddress]);

      let txValue = new BigNumber(new BigNumber(balanceArr[0]).div(new BigNumber(Math.pow(10, decimal))));
      txValue = this.subStringNum(txValue, 4);

      return txValue;
    } catch (err) {
      return 0;
    }
  }

  static async getItgBalance(wallet) {
    try {

      // const { wallet } = store.getState().Core;

      let balance = await JbokManager.getBalance(wallet.address);
      let itg = balance.result;

      let txValue = new BigNumber(new BigNumber(itg).div(new BigNumber(Math.pow(10, 18))));
      txValue = this.subStringNum(txValue, 4);

      return txValue;

    } catch (err) {

      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getItgBalanceCatchErr", err);
      return 0.0;
    }
  }

  /**
   * Get the user's wallet ETH balance
   */
  static async getEthBalance(walletAddress) {
    try {
      web3 = this.getWeb3Instance();
      const balance = await web3.eth.getBalance(walletAddress);
      let vAmount = parseFloat(balance / Math.pow(10, 18));
      return this.subStringNum(vAmount, 4);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthBalanceErr", err);
      return 0.0;
    }
  }

  /**
   * Get the user's wallet balance of a specific ERC20 token
   *
   * @param {String} address
   * @param {Number} decimal
   */
  static async getEthERC20Balance(walletAddress, address, decimal) {
    try {
      web3 = this.getWeb3Instance();
      const ether = new BigNumber(Math.pow(10, decimal));
      const contract = new web3.eth.Contract(erc20Abi, address);
      const bigBalance = new BigNumber(await contract.methods.balanceOf(walletAddress).call());
      let vAmount = parseFloat(bigBalance.dividedBy(ether));
      return this.subStringNum(vAmount, 4);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthERC20BalanceErr", err);
      return 0.0;
    }
  }

  /**
   * Get the  ERC20 token allowance of a address to another address
   *
   * @param {String} contractAddress
   * @param {String} ownerAddress
   * @param {String} approveAddress
   */
  static async getAllowance(contractAddress, ownerAddress, approveAddress) {
    try {
      web3 = this.getWeb3Instance();
      const contract = new web3.eth.Contract(erc20Abi, contractAddress);
      let amount = await contract.methods.allowance(ownerAddress, approveAddress).call();
      const bigBalance = new BigNumber(amount);
      const ether = new BigNumber(Math.pow(10, 18));
      let allowance = parseFloat(bigBalance.dividedBy(ether));
      let allStr = this.subStringNum(allowance, 4);
      return Promise.resolve(parseFloat(allStr));
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getAllowance", err);
      return 0.0;
    }
  }

  /**
   * Get a list of trancsactions for the user's wallet concerning the given token
   *
   * @param {object} token
   * @param {number} startBlock
   * @param {number/string} endBlock   default 'latest'
   */
  static getTransations({ address, symbol, decimal }, page, offset) {
    const { wallet } = store.getState().Core;
    if (wallet.type === "itc") {
      return this.iotcGetTransaction({ address, symbol, decimal }, page, offset);
    }
    return this.getTransactionsOfETH({ address, symbol, decimal }, page, offset);
  }

  static getTransactionsOfETH({ address, symbol, decimal }, page, offset) {

    if (symbol === "ETH") {
      return this.getEthTransations(page, offset);
    }
    return this.getERC20Transations(address, decimal, page, offset);
  }

  static iotcGetTransaction({ address, symbol, decimal }, page, offset) {

    if (symbol.toLocaleUpperCase() == "ITG") {

      return this.getItgTransations(page, offset);
    }

    return this.getItcTransations(page, offset);
  }

  static async getItcTransations(page, offset) {

    const { wallet } = store.getState().Core;
    web3 = this.getWeb3Instance();
    try {
      const params = {
        address: wallet.address,
        size: offset,
        page: page
      };
      const rsp = await this.getTransactionForItc(params);
      console.log(rsp);
      if (rsp.code === 200) {
        return rsp.data.trx.map(t => ({
          from: t.senderAddress,
          to: t.receivingAddress,
          timeStamp: t.unixTimestamp,
          hash: t.hash,
          value: web3.utils.fromWei(t.value, "ether"),
          txFee:
            t.gasPrice
              ? web3.utils.fromWei(((t.gasUsed || t.gasLimit) * t.gasPrice).toString(), "gwei")
              : 0,
          blockNumber: t.blockNumber,
          isError: 0
        }));
      }
      Analytics.recordErr("getItcTransationsRspErr", rsp);

      return [];
    } catch (err) {
      Analytics.recordErr("getItcTransationsCatchErr", err);
      return [];
    }
  }

  /**
   * get itg transaction list
   */
  static async getItgTransations(page, offset) {

    const { wallet } = store.getState().Core;
    web3 = this.getWeb3Instance();
    try {
      const params = {
        address: wallet.address,
        size: offset,
        page: page
      };
      const rsp = await this.getTransactionForItg(params);
      console.log(rsp);
      if (rsp.code === 200) {
        try {
          return rsp.data.trx.map((t, index) => {

            console.log(index);
            const isGasTransaction = ( (t.receivingAddress.indexOf('ITC')>-1)?t.receivingAddress.replace('ITC','0x').toLowerCase():t.receivingAddress )=== itcNetworkConfig.itcContractAddress
            return ({
              from: t.senderAddress,
              to: t.receivingAddress,
              timeStamp: t.unixTimestamp,
              hash: t.hash,
              value: web3.utils.fromWei(t.value, "ether"),
              txFee:
                t.gasUsed
                  ? web3.utils.fromWei((parseInt((t.gasUsed || t.gasLimit) * t.gasPrice)).toString(), "gwei")
                  : 0,
              blockNumber: t.blockNumber,
              isError: !t.status,
              isGasTransaction:isGasTransaction
            });
          });
        } catch (e) {
          console.log(e);
        }


      }
      Analytics.recordErr("getItgTransationsRspErr", rsp);

      return [];
    } catch (err) {
      Analytics.recordErr("getItgTransationsCatchErr", err);
      return [];
    }
  }

  /**
   * Get a list of ETH transactions for the user's wallet
   */
  static async getEthTransations(page, offset) {
    try {
      const { wallet } = store.getState().Core;
      console.log("请求数据" + JSON.stringify(wallet));

      const data = await FetchUtils.requestGet(NetAddr.queryETHTxList, {
        address: wallet.address,
        page,
        offset
      });

      // const data = await EtherscanApi.getTxList(wallet.address,page,offset)

      // const data = await api.account.txlist(wallet.address, 1, 'latest',0,2,'desc');
      if (data.code != 200 || data.data.message !== "OK") {
        return [];
      }

      const dataArr = [];

      for (let i = 0; i < data.data.result.length; i++) {
        const transaction = data.data.result[i];
        transaction.isGasTransaction = transaction.input !== "0x";
        dataArr.push(transaction);
      }
      web3 = this.getWeb3Instance();
      return dataArr.map(t => ({
        from: t.from,
        to: t.to,
        timeStamp: t.timeStamp,
        isGasTransaction: t.isGasTransaction,
        hash: t.hash,
        value: web3.utils.fromWei(t.value, "ether"),
        isError: t.isError,
        txFee: web3.utils.fromWei(
          (parseInt(t.gasUsed, 10) * parseInt(t.gasPrice, 10)).toString(),
          "ether"
        ),
        blockNumber: t.blockNumber
      }));
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthTransationsErr", err);
      return [];
    }
  }

  /**
   * Get a list of ERC20Token transactions for the user's wallet
   *
   * @param {String} address
   * @param {Number} decimal
   */
  static async getERC20Transations(address, decimal, page, offset) {
    try {
      const { wallet } = store.getState().Core;

      const data = await FetchUtils.requestGet(NetAddr.queryEthTokenTxlist, {
        contractaddress: address,
        address: wallet.address,
        page,
        offset
      });

      // const data = await api.account.tokentx(wallet.address, address, 1, 'latest',page,offset,'desc');
      console.log("获取长度为token数据长度:" + data.data.result.length);
      if (data.code != 200 || data.data.message !== "OK") {
        return [];
      }
      web3 = this.getWeb3Instance();

      let newArr = [];

      data.data.result.map(t => {

        let txValue = new BigNumber(new BigNumber(t.value).div(new BigNumber(Math.pow(10, decimal))));
        txValue = this.subStringNum(txValue, 4);

        newArr.push({
          from: t.from,
          to: t.to,
          timeStamp: t.timeStamp,
          hash: t.hash,
          value: txValue,
          txFee: web3.utils.fromWei(
            (parseInt(t.gasUsed, 10) * parseInt(t.gasPrice, 10)).toString(),
            "ether"
          ),
          blockNumber: t.blockNumber,
          isError: "0"
        });
      });

      return newArr;

    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getERC20TransationsErr", err);
      return [];
    }
  }

  /**
   * Send a transaction from the user's wallet
   *
   * @param {Object} token
   * @param {String} toAddress
   * @param {String} amout
   * @param {Number} gasPrice
   */
  static sendTransaction(
    { address, symbol, decimal },
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash,
    isExchange,
    fromAddress
  ) {
    const { wallet } = store.getState().Core;
    if (wallet.type === "itc" && !isExchange) {

      web3 = this.getWeb3Instance();
      gasPrice = web3.utils.toWei("" + gasPrice, "szabo");

      if (symbol.toLocaleUpperCase() == "ITG") {

        return this.sendItgTransaction(toAddress, amout, gasPrice, privateKey, callBackHash);
      }

      return this.sendItcTransaction(
        address,
        decimal,
        toAddress,
        amout,
        gasPrice,
        privateKey,
        callBackHash,
        fromAddress
      );
    }
    if (symbol === "ETH") {
      return this.sendETHTransaction(
        toAddress,
        amout,
        gasPrice,
        privateKey,
        callBackHash,
        fromAddress
      );
    }
    return this.sendERC20Transaction(
      address,
      decimal,
      toAddress,
      amout,
      gasPrice,
      privateKey,
      callBackHash,
      fromAddress
    );
  }

  static async getItcNonce() {
    try {

      const { wallet } = store.getState().Core;

      let account = await JbokManager.getAccount(wallet.address);
      return account.result.nonce;

    } catch (err) {
      Analytics.recordErr("getItcAccountCatErr", err);
      return -1;
    }
  }

  static async sendItcTransaction(
    address,
    decimal,
    toAddress,
    amount,
    gasPrice,
    privateKey,
    callBackHash,
    fromAddress
  ) {
    try {
      web3 = this.getWeb3Instance();

      let amountWei = web3.utils.toWei(amount + "", "ether");
      let response = await TokenContractHandle.transferITC(privateKey, address, toAddress, amountWei, gasPrice + "", TransferGasLimit.tokenGasLimit + "", callBackHash);
      return response;
    } catch (err) {
      Analytics.recordErr("sendItcTransactionCatErr", err);
      callBackHash(null);
      return null;
    }
  }

  static async sendItgTransaction(toAddress, amout, gasPrice, privateKey, callBackHash) {
    try {
      web3 = this.getWeb3Instance();
      // const wallet = store.getState().Core.wallet;
      const nonce = await this.getItcNonce();
      if (nonce === -1) {
        callBackHash(null);
        return null;
      }
      const tx = {
        nonce,
        gasPrice: gasPrice + "",
        gasLimit: TransferGasLimit.itcGasLimit + "",
        receivingAddress: toAddress,
        value: web3.utils.toWei(amout.toString(), "ether").toString(),
        payload: ""
      };

      let response = await JbokManager.sendTransaction(tx, privateKey, null, callBackHash);
      return response;

    } catch (err) {
      Analytics.recordErr("sendItgTransactionCatErr", err);
      callBackHash(null);
      return null;
    }
  }

  /**
   * Send an Eth transaction to the given address with the given amout
   *
   * @param {String} toAddress
   * @param {String} amout
   * @param {Number} gasPrice
   */
  static async sendETHTransaction(
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash,
    fromAddress
  ) {
    try {
      web3 = this.getWeb3Instance();
      web3.eth.accounts.wallet.add(privateKey);
      const price = web3.utils.toWei(gasPrice.toString(), "gwei");
      const value = web3.utils.toWei(amout.toString(), "ether");
      const gasLimit = web3.utils.toHex(TransferGasLimit.ethGasLimit);
      const transactionGasPrice = web3.utils.toHex(price);
      const transactionConfig = {
        from: fromAddress || store.getState().Core.wallet.address,
        to: toAddress,
        value,
        gas: gasLimit,
        gasPrice: transactionGasPrice
      };
      const cb = await web3.eth.sendTransaction(transactionConfig).on("transactionHash", hash => {
        callBackHash(hash);
      });
      return cb;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("sendETHTransactionErr", err);
      callBackHash(null);
      return null;
    }
  }

  /**
   * Send an ERC20Token transaction to the given address with the given amout
   *
   * @param {Streing} address
   * @param {Number} decimal
   * @param {String} toAddress
   * @param {String} amout
   */
  static async sendERC20Transaction(
    address,
    decimal,
    toAddress,
    amout,
    gasPrice,
    privateKey,
    callBackHash,
    fromAddress
  ) {
    try {
      web3 = this.getWeb3Instance();
      web3.eth.accounts.wallet.add(privateKey);
      const price = web3.utils.toWei(gasPrice.toString(), "gwei");
      const contract = new web3.eth.Contract(erc20Abi, address);
      const BNAmout = new BigNumber(amout * Math.pow(10, decimal));
      const data = contract.methods.transfer(toAddress, BNAmout).encodeABI();
      const tx = {
        from: fromAddress || store.getState().Core.wallet.address,
        to: address,
        value: "0x0",
        data,
        gasLimit: web3.utils.toHex(TransferGasLimit.tokenGasLimit),
        gasPrice: web3.utils.toHex(price)
      };
      // tx['gasLimit'] = await web3.eth.estimateGas(tx)
      const cb = await web3.eth.sendTransaction(tx).on("transactionHash", hash => {
        callBackHash(hash);
      });
      return cb;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("sendERC20TransactionErr", err);
      return null;
    }
  }


  static async getCurrentBlockNumber() {
    try {
      const { wallet } = store.getState().Core;
      if (wallet.type === "itc") {

        let blockNumber = await JbokManager.getBestBlockNumber();

        return blockNumber.result;
      }
      web3 = this.getWeb3Instance();
      return await web3.eth.getBlockNumber();
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getCurrentBlockNumberCatErr", err);
      return 0;
    }
  }

  static isValidAddress(address) {
    try {
      web3 = this.getWeb3Instance();
      return web3.utils.isAddress(address);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("isValidAddressErr", err);
      return false;
    }
  }

  static getContractAddressInfo(address) {
    try {
      const contract = new web3.eth.Contract(erc20Abi, address);
      return Promise.all([contract.methods.symbol().call(), contract.methods.decimal().call()]);
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getContractAddressInfoErr", err);
      return Promise.reject(err);
    }
  }

  /**
   * Get ETH price (abandoned)
   */
  static async getEthPrice() {
    try {
      const { wallet } = store.getState().Core;
      if (wallet.type === "itc") {
        return await this.getPrice("itc");
      }
      const data = await api.stats.ethprice();
      const { ethusd } = data.result;
      return ethusd;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getEthPriceErr", err);
      return 0;
    }
  }

  /**
   * Query token price
   * @param {string} symbol
   */
  static async getPrice(symbol) {
    try {
      const result = await FetchUtils.timeoutFetch(
        fetch(`https://api.iotchain.io/tokenPrice?symbol=${symbol}`)
      );
      const resJson = await result.json();
      if (resJson.code === 200) {
        // 优先判断货币 如果货币本地没有再使用语言
        // const currentLocale = I18n.currentLocale()
        // var monetaryUnit = await StorageManage.load(StorageKey.MonetaryUnit)
        const { monetaryUnit } = store.getState().Core;
        if (monetaryUnit) {
          const { monetaryUnitType } = monetaryUnit;
          if (monetaryUnitType === "CNY") {
            return resJson.data.cny;
          }
          if (monetaryUnitType === "KRW") {
            return resJson.data.krw;
          }
          if (monetaryUnitType === "EUR") {
            return resJson.data.eur;
          }
          if (monetaryUnitType === "RUB") {
            return resJson.data.rub;
          }
          if (monetaryUnitType === "UAH") {
            return resJson.data.uah;
          }
          return resJson.data.usd;
        }
        const currentLocale = I18n.locale;
        if (currentLocale.includes("zh")) {
          return resJson.data.cny;
        }
        if (currentLocale.includes("ko")) {
          return resJson.data.krw;
        }
        if (currentLocale.includes("ru")) {
          return resJson.data.rub;
        }
        if (currentLocale.includes("uk")) {
          return resJson.data.uah;
        }
        if (
          currentLocale.includes("de") ||
          currentLocale.includes("es") ||
          currentLocale.includes("nl") ||
          currentLocale.includes("fr")
        ) {
          return resJson.data.eur;
        }
        // 默认美元
        return resJson.data.usd;
      }
      return 0.0;
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getPriceErr", err);
      return 0.0;
    }
  }

  /**
   * Load the tokens the user owns
   */
  static async loadTokenList() {
    try {
      // 如果是itc钱包，暂不支持erc20
      const { wallet } = store.getState().Core;
      if (wallet.type === "itc") {
        const { tokens } = store.getState().Core;
        const completeTokens = lodash.cloneDeep(tokens);
        let totalAssets = 0.0;
        await Promise.all(
          completeTokens.map(async token => {
            const balance = await this.iotcGetBalance(wallet, {
              address: token.address,
              symbol: token.symbol,
              decimal: token.decimal
            });
            token.balance = balance;
            const price = await this.getPrice(token.symbol.toLowerCase());
            token.price = price;
            token.itcPrice = price; // 暂时使用eth erc20代币的价格
            totalAssets = balance * price;
          })
        );
        store.dispatch(setTotalAssets(totalAssets));
        store.dispatch(loadTokenBalance(completeTokens));
      } else {
        await this.loadTokensFromStorage();
        await this.getTokensBalance();
      }
    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("loadTokenListErr", err);
    }
  }

  static async loadTokensFromStorage() {
    const { tokens, wallet } = store.getState().Core;
    const tokensAddresses = tokens
      .filter(token => token.symbol !== "ETH")
      .map(token => token.address);
    const localTokens = await StorageManage.load(StorageKey.Tokens + wallet.address);
    if (localTokens) {
      localTokens
        .filter(token => !tokensAddresses.includes(token.address))
        .forEach(token => {
          store.dispatch(addToken(token));
        });
    }
  }

  static async getTokensBalance() {
    const { tokens } = store.getState().Core;
    const completeTokens = lodash.cloneDeep(tokens);
    let totalAssets = 0.0;
    await Promise.all(
      completeTokens.map(async token => {
        const balance = await this.getBalance({
          address: token.address,
          symbol: token.symbol,
          decimal: token.decimal
        });
        token.balance = balance;
        token.price = 0;
        const ethPrice = await this.getPrice("eth");
        token.ethPrice = ethPrice;

        if (token.symbol === "ETH") {
          const ethTotal = balance * ethPrice;
          token.price = ethPrice;
          totalAssets += ethTotal;
        } else {
          const price = await this.getPrice(token.symbol.toLowerCase());
          const total = balance * price;
          token.price = price;
          totalAssets += total;
        }
        /* if (token.symbol === 'ITC') {
                const itcPrice = await this.getPrice('itc')
                const itcTotal = balance * itcPrice
                token["price"] = itcPrice
                totalAssets = totalAssets + itcTotal
            } */
      })
    );
    store.dispatch(setTotalAssets(totalAssets));
    store.dispatch(loadTokenBalance(completeTokens));
  }

  static async getSuggestGasPrice(wallet) {
    try {
      web3 = this.getWeb3Instance();
      if (wallet.type === "itc") {

        const gpResult = await JbokManager.getSuggestGasPrice();
        let price = gpResult.result;
        price = price == 0 ? "1" : price;

        if (parseFloat(web3.utils.fromWei(price, "szabo")) < 1) {
          return "1";
        } else if (parseFloat(web3.utils.fromWei(price, "szabo")) > 100) {
          return "100";
        }

        return web3.utils.fromWei(price, "szabo");
      }

      const price =
        store.getState().Core.network === Network.main
          ? await web3.eth.getGasPrice()
          : "10000000000";
      return web3.utils.fromWei(price, "gwei");

    } catch (err) {
      DeviceEventEmitter.emit("netRequestErr", err);
      Analytics.recordErr("getSuggestGasPriceCatErr", err);
      return 0;
    }
  }


  /**
   * 发送ETH网络交易
   * @param {*} privateKey
   * @param {*} trxData
   * @param {*} callBackHash
   */
  static async sendETHTrx(privateKey, trxData, callBackHash) {

    web3.eth.accounts.wallet.add(privateKey);
    const cb = await web3.eth.sendTransaction(trxData).on("transactionHash", hash => {
      callBackHash(hash);
    });
    return cb;
  }

  /**
   * generalContractApproveTrxData
   * @param {*} contractAddress
   * @param {*} toAddress
   * @param {*} amout
   */
  static generalApproveTrxData(contractAddress, toAddress, amout) {

    const contract = new web3.eth.Contract(erc20Abi, contractAddress);
    const BNAmout = new BigNumber(amout * Math.pow(10, 18));
    const data = contract.methods.approve(toAddress, BNAmout).encodeABI();
    return {
      to: contractAddress,
      value: "0x00",
      data: data
    };
  }

  static async iotcQueryHashTx(hash) {

    return JbokManager.getTxReceipt(hash);
  }

  static async iotcSendTransaction(txJson, privateKey) {

    return JbokManager.sendTransaction(txJson, privateKey, null);
  }

  static async iotcQueryITCAllownce(fromAddress, toAddress) {

    try {

      let { decimal, address } = defaultTokensOfITC[1];

      let result = await TokenContractHandle.queryAllownce(address, fromAddress, toAddress);
      let values = JSON.parse(result);
      let value = values[0];

      value = new BigNumber(new BigNumber(value).div(new BigNumber(Math.pow(10, decimal))));

      console.log("授权额度为：" + value);

      return value;
    } catch (err) {

      console.log("查询主网ITC授权额度出错：" + err);
      return 0;
    }
  }

  static async iotcGetITCApproveEstimateGas(fromAddress, toAddress, amount) {

    try {

      web3 = this.getWeb3Instance();
      amount = web3.utils.toWei("" + amount, "ether");

      let tx = await TokenContractHandle.generalApproveTxData(defaultTokensOfITC[1].address, fromAddress, toAddress, amount);

      tx.to = tx.receivingAddress;
      tx.from = "";
      tx.data = tx.payload;

      console.log(" need estimate tx:" + JSON.stringify(tx));

      let gas = await JbokManager.getEstimatedGas(tx);


      let szaboGas = web3.utils.toWei(gas.result, "szabo");
      let etherGas = web3.utils.fromWei(szaboGas, "ether");

      return {
        trx: tx,
        gasUsed: etherGas
      };

    } catch (err) {
      console.log("预估ITC授权交易错误：" + err);
      return err;
    }
  }

  /**
   * generalVoteTrxData
   * @param {*} contractAddress
   * @param {*} toAddress
   * @param {*} amout
   */
  static generalSuperNodeLockTrxData(contractAddress, amout) {

    const contract = new web3.eth.Contract(nodeBallotAbi, contractAddress);
    const BNAmout = new BigNumber(amout * Math.pow(10, 18));
    const data = contract.methods.generalSuperNode(BNAmout).encodeABI();
    return {
      to: contractAddress,
      value: "0x00",
      data: data
    };
  }

  /**
   * generalVoteTrxData
   * @param {*} contractAddress
   * @param {*} toAddress
   * @param {*} amout
   */
  static generalVoteTrxData(contractAddress, toAddress, amout) {

    const contract = new web3.eth.Contract(nodeBallotAbi, contractAddress);
    const BNAmout = new BigNumber(amout * Math.pow(10, 18));
    const data = contract.methods.ballot(toAddress, BNAmout).encodeABI();
    return {
      to: contractAddress,
      value: "0x00",
      data: data
    };
  }

  /**
   * generalSendERC20TokenTrxData
   * @param {*} contractAddress
   * @param {*} toAddress
   * @param {*} amout
   */
  static generalSendERC20TokenTrxData(contractAddress, toAddress, amout) {

    const contract = new web3.eth.Contract(erc20Abi, contractAddress);
    const BNAmout = new BigNumber(amout * Math.pow(10, 18));
    const data = contract.methods.transfer(toAddress, BNAmout).encodeABI();

    return {
      to: contractAddress,
      value: "0x00",
      data: data
    };
  }

  /**
   * getContractOrNormalTransactionEstimateGas
   * @param {*} fromAddress
   * @param {*} t
   t = {
        to: airContractAddress,
        value: '0x00',
        data: airdropContract.methods.airDrop(erc20TokenContractAddress).encodeABI()
    };
   */
  static async getTransactionEstimateGas(fromAddress, t) {

    web3 = this.getWeb3Instance();

    //get nonce value
    let nonce = await web3.eth.getTransactionCount(fromAddress);
    t.nonce = web3.utils.toHex(nonce);
    t.from = fromAddress;
    try {
      var estimateGas = await web3.eth.estimateGas(t);
    } catch (err) {
      console.log("gas errors" + err);
      estimateGas = "600000";
    }

    t.gas = web3.utils.toHex(estimateGas);

    //get current gasPrice, you can use default gasPrice or custom gasPrice!
    let price = await web3.eth.getGasPrice();
    //花费平常的5倍gas
    price = parseInt(price * 5);
    t.gasPrice = web3.utils.toHex(price);

    console.log("TransactionEstimateGas" + JSON.stringify(t, null, 2));

    let estimateGasUsed = estimateGas * price / Math.pow(10, 18);
    return Promise.resolve({
      trx: t,
      gasUsed: estimateGasUsed,
      gasPrice: price,
      gas: estimateGas
    });
  }

  /**
   * get transaction detail with hashid
   */
  static async getTransaction(hashId) {
    web3 = this.getWeb3Instance();
    let tran = null;
    try {
      tran = await web3.eth.getTransaction(hashId);
    } catch (e) {
      console.log("getTransaction error:", e);
    }
    return tran;
  }

  /**
   * getAllTokens
   */

  static getAllTokens(params) {
    return FetchUtils.requestGet(NetAddr.getAllTokens, params);
  }

  /**
   * getAllTokens
   */

  static getTokensVersion(params) {
    return FetchUtils.requestGet(NetAddr.getTokensVersion, params);
  }

  /**
   * getMessage消息中心列表
   */

  static getMessageList(params) {
    return FetchUtils.requestGet(NetAddr.getMessageList, params);
  }

  /**
   * readMessage 更新消息已读未读状态
   */

  static readMessage(params) {
    return FetchUtils.requestPost(NetAddr.readMessage, params);
  }

  /**
   *  获取未读消息个数
   */

  static getUnReadMessageCount(params) {
    return FetchUtils.requestGet(NetAddr.getUnReadMessageCount, params);
  }

  /**
   *  将所有的消息标记为已读
   */
  static readAllMessage(params) {
    return FetchUtils.requestPost(NetAddr.readAllMessage, params);
  }

  /**
   * feedback
   */

  static uploadFeedback(params, images) {
    return FetchUtils.requestPost(NetAddr.feedback, params, images.length > 0 ? images : null);
  }

  /**
   * register
   */

  static deviceRegister(params) {
    return FetchUtils.requestPost(NetAddr.registerDevice, params);
  }

  /**
   * version update info
   */

  static getVersionUpdateInfo(params) {
    if (iotchain_network_mainnet === 0) {
      return FetchUtils.requestGet(NetAddr.getVersionUpdateInfo, params);
    } else {
      return null;
    }
  }

  /**
   *
   *   getTransactionForItg from scan
   */
  static getTransactionForItg(params) {
    return FetchUtils.requestGet(NetAddr.getITGTransactionByAddress, params);
  }

  /**
   *
   *   getTransactionForItc from scan
   */
  static getTransactionForItc(params) {
    return FetchUtils.requestGet(NetAddr.getITCTransactionByAddress, params);
  }

  /**
   * user info update
   */

  static async userInfoUpdate(params) {
    const userToken = await StorageManage.load(StorageKey.UserToken);
    if (!userToken || userToken === null) {
      return new Promise.reject("userToken not found");
    }
    params.userToken = userToken.userToken;
    return FetchUtils.requestPost(NetAddr.userInfoUpdate, params);
  }

  // token swap Interface

  static async bindConvertAddress(params) {
    const userToken = await StorageManage.load(StorageKey.UserToken);
    if (!userToken || userToken === null) {
      return new Promise.reject("userToken not found");
    }
    params.userToken = userToken.userToken;
    return FetchUtils.requestPost(NetAddr.bindConvertAddress, params);
  }

  static async queryConvertAddress(params) {
    const userToken = await StorageManage.load(StorageKey.UserToken);
    if (!userToken || userToken === null) {
      return new Promise.reject("userToken not found");
    }
    params.userToken = userToken.userToken;
    return FetchUtils.requestGet(NetAddr.queryConvertAddress, params);
  }

  static async queryConvertTxList(params) {
    return FetchUtils.requestGet(NetAddr.queryConvertTxList, params);
  }

  static createBlackHoleAddress(ethAddress, itcAddress) {
    web3 = this.getWeb3Instance();
    return web3.utils.toChecksumAddress(
      `0x00000000000000000000${web3.utils
        .keccak256(ethAddress + itcAddress)
        .toString("hex")
        .slice(-20)}`
    );
  }

  /**
   * 获取私钥对应地址
   * @param {*} privateKey
   */
  static getAccountFromPrivateKey(privateKey) {

    if (privateKey.indexOf("0x") != 0) {
      privateKey = "0x" + privateKey;
    }

    if (privateKey.length != 66) {
      return null;
    }

    let web3 = this.getWeb3Instance();
    try {
      let account = web3.eth.accounts.privateKeyToAccount(privateKey);
      return account;
    } catch (err) {
      return null;
    }
  }

  /**
   * 根据私钥生成keystore
   * @param {*} privateKey
   */
  static getKeystoreFromPrivate(privateKey, password) {

    if (privateKey.indexOf("0x") != 0) {
      privateKey = "0x" + privateKey;
    }

    try {
      let web3 = this.getWeb3Instance();

      let keystore = web3.eth.accounts.encrypt(privateKey, password);
      // console.log('私钥生成的keystore为：'+keystore)
      return keystore;
    } catch (err) {
      return null;
    }
  }

  /**
   * 根据keystore生成私钥
   * @param {*} keystore
   * @param {*} password
   */
  static generalAccountFromKeystore(keystore, password) {

    try {
      let web3 = this.getWeb3Instance();

      let account = web3.eth.accounts.decrypt(keystore, password);
      // console.log('由keystore生成出来的账号信息为：'+JSON.stringify(account,null,2))
      return account;
    } catch (err) {
      return null;
    }
  }

  /**
   * 监听eth交易
   * @param {*} hash
   * @param {*} call
   */
  static async listenETHTransaction(hash, date, call) {

    web3 = this.getWeb3Instance();
    let tx = await web3.eth.getTransactionReceipt(hash);

    if (tx) {
      console.log("已查询到->" + tx);
      let blockDetail = await web3.eth.getBlock(tx.blockNumber);
      call({
        ...tx,
        timestamp: blockDetail.timestamp
      });
    } else {
      console.log("未查找到该交易凭证->" + hash);

      //去掉超时验证
      // let nowTime = new Date().valueOf()

      // if(nowTime - date > 10 * 60 * 1000 ){
      //   call()
      // }else{
      setTimeout(() => {
        this.listenETHTransaction(hash, date, call);
      }, 5 * 1000);
      // }
    }
  }

  // SWFT Interface
  static async queryCoinList() {
    return FetchUtils.requestSWFTPost(
      NetAddr.queryCoinList,
      { supportType: "advanced" },
      "application/x-www-form-urlencoded"
    );
  }

  static async getBaseInfo(params) {
    return FetchUtils.requestSWFTPost(NetAddr.getBaseInfo, params);
  }

  static async accountExchange(params) {
    return FetchUtils.requestSWFTPost(NetAddr.accountExchange, params);
  }

  static async queryOrderState(params) {
    return FetchUtils.requestSWFTPost(NetAddr.queryOrderState, params);
  }

  static async queryAllTrade(params) {
    return FetchUtils.requestSWFTPost(NetAddr.queryAllTrade, params);
  }

  static async queryActivityInfo() {

    return FetchUtils.requestGet(NetAddr.queryActivityInfo, {});
  }

  static async queryActivityAddressInfo(params) {

    return FetchUtils.requestGet(NetAddr.queryActivityAddressInfo, params);
  }

  static async updateActivityBindAddress(params) {

    return FetchUtils.requestPost(NetAddr.updateActivityBindAddress, params);
  }

  static async querySuperNodeList(params) {

    return FetchUtils.requestGet(NetAddr.querySuperNodeList, params);
  }

  static async queryNodeInfo(params) {

    return FetchUtils.requestGet(NetAddr.queryNodeInfo, params);
  }

  static async queryRewardList(params) {

    return FetchUtils.requestGet(NetAddr.queryRewardList, params);
  }

  static async queryTaskInfo(params) {

    return FetchUtils.requestGet(NetAddr.queryTaskInfo, params);
  }

  static async bindActivityInviteAddress(params) {

    return FetchUtils.requestPost(NetAddr.bindActivityInviteAddress, params);
  }

  static async queryKeyAddressInfo(params) {

    return FetchUtils.requestGet(NetAddr.queryKeyAddressInfo, params);
  }

  static async queryAddressBindAddress(params) {

    return FetchUtils.requestGet(NetAddr.queryAddressBindAddress, params);
  }

  static async completeMappingTask(params) {

    return FetchUtils.requestPost(NetAddr.completeMappingTask, params);
  }

  static async queryTransactionDetail(params) {

    return FetchUtils.requestGet(NetAddr.queryTransactionDetail, params);
  }

  static async querylastWinner() {

    return FetchUtils.requestGet(NetAddr.querylastWinner);
  }

  static async querystatistics(params) {
    return FetchUtils.requestGet(NetAddr.querystatistics, params);
  }

  static async currentTime() {
    return FetchUtils.requestGet(NetAddr.currentTime);
  }

  static async detailBenfit(params) {
    return FetchUtils.requestGet(NetAddr.detailBenfit, params);
  }

  static async totalBenfit(params) {
    return FetchUtils.requestGet(NetAddr.totalBenfit, params);
  }

  static async queryNodeTasks(params) {
    return FetchUtils.requestGet(NetAddr.queryNodeTasks, params);
  }


  static async sendcode(params) {
    return FetchUtils.requestSWFTPost(NetAddr.sendcode, params);
  }

  static async verifycode(params) {
    return FetchUtils.requestSWFTPost(NetAddr.verifycode, params);
  }

  static async identifySave(params) {
    return FetchUtils.requestSWFTPost(NetAddr.identifySave, params);
  }

  static async initidentifyquery(params) {
    return FetchUtils.requestGet(NetAddr.initidentifyquery, params);
  }

  static async querSuperInfo(params) {
    return FetchUtils.requestGet(NetAddr.querSuperInfo, params);
  }
}
