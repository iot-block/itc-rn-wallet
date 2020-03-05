module.exports = function(client) {
  const apiName = 'transaction'
  return {
    getTx(hash) {
      const api = apiName;
      const method = "getTx";
      return client.fetch(api, method, { hash });
    },
    getPendingTx(hash) {
      const api = apiName;
      const method = "getPendingTx";
      return client.fetch(api, method, { hash });
    },
    getReceipt(hash) {
      const api = apiName;
      const method = "getReceipt";
      return client.fetch(api, method, { hash });
    },
    getTxByBlockHashAndIndex(hash, index) {
      const api = apiName;
      const method = "getTxByBlockHashAndIndex";
      return client.fetch(api, method, { hash, index });
    },
    getTxByBlockTagAndIndex(tag, index) {
      const api = apiName;
      const method = "getTxByBlockTagAndIndex";
      return client.fetch(api, method, { tag, index });
    },
    sendTx(stx) {
      const api = apiName;
      const method = "sendTx";
      return client.fetch(api, method, { stx });
    },
    sendRawTx(data) {
      const api = apiName;
      const method = "sendRawTx";
      return client.fetch(api, method, { data });
    }
  };
};
