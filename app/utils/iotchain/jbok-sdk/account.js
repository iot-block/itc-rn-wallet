module.exports = function(client) {
  const apiName = "account";
  return {
    getCode(address, tag = "latest") {
      const api = apiName;
      const method = "getCode";
      return client.fetch(api, method, { address, tag });
    },
    getAccount(address, tag = "latest") {
      const api = apiName;
      const method = "getAccount";

      return client.fetch(api, method, { address, tag });
    },
    getBalance(address, tag = "latest") {
      const api = apiName;
      const method = "getBalance";

      return client.fetch(api, method, { address, tag });
    },
    getStorageAt(address, position, tag = "latest") {
      const api = apiName;
      const method = "getCode";

      return client.fetch(api, method, { address, position, tag });
    },
    getTransactions(address, page = "0", size = "100") {
      const api = apiName;
      const method = "getTransactions";
      return client.fetch(api, method, { address, page, size });
    },
    getTokenTransactions(address, contract) {
      const api = apiName;
      const method = "getTokenTransactions";
      return client.fetch(api, method, { address, contract });
    },
    getPendingTxs(address) {
      const api = apiName;
      const method = "getPendingTxs";
      return client.fetch(api, method, { address });
    },
    getEstimatedNonce(address) {
      const api = apiName;
      const method = "getEstimatedNonce";
      return client.fetch(api, method, { address });
    }
  };
};
