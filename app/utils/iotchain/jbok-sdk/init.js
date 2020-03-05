const jbok = require("./lib");
const block = require("./block");
const account = require("./account");
const transaction = require("./transaction");
const contract = require("./contract");
const utils = require("./utils");

/**
 * @module jbokSdk/api
 */

/**
 * @param {string} uri -(option) Your Node uri default http://localhost:30315
 */

module.exports = function(uri) {
  if (!uri) {
    // uri = "http://139.196.160.72:30315"; //节点3
    // uri = "http://139.196.160.93:30315";  //节点2
    // uri = "http://47.102.121.72:30315";  //miner节点1

    uri = "http://139.224.255.21:30315";  //abel节点
  }
  const client = jbok.SdkClient.http(uri);

  return {
    block: block(client),
    transaction: transaction(client),
    account: account(client),
    contract: contract(client),
    utils:utils(),
    client:client
  };
};
