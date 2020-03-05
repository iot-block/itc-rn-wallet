module.exports = function(client) {
  const apiName = 'block'
  return {
    getBestBlockNumber() {
      const api = apiName;
      const method = "getBestBlockNumber";
      return client.fetch(api, method);
    },
    getBlockHeaderByNumber(number) {
      const api = apiName;
      const method = "getBlockHeaderByNumber";
      return client.fetch(api, method, { number });
    },
    getBlockHeadersByNumber(start, limit) {
      const api = apiName;
      const method = "getBlockHeadersByNumber";
      return client.fetch(api, method, { start, limit });
    },
    getBlockHeaderByHash(hash) {
      const api = apiName;
      const method = "getBlockHeaderByHash";
      return client.fetch(api, method, { hash });
    },
    getBlockBodyByHash(hash) {
      const api = apiName;
      const method = "getBlockBodyByHash";
      return client.fetch(api, method, { hash });
    },
    getBlockBodies(hashes) {
      const api = apiName;
      const method = "getBlockHeaderByNumber";
      return client.fetch(api, method, { hashes });
    },
    getBlockByNumber(number) {
      const api = apiName;
      const method = "getBlockByNumber";
      return client.fetch(api, method, { number });
    },
    getBlockByHash(hash) {
      const api = apiName;
      const method = "getBlockByHash";
      return client.fetch(api, method, { hash });
    },
    getTransactionCountByHash(hash) {
      const api = apiName;
      const method = "getTransactionCountByHash";
      return client.fetch(api, method, { hash });
    },
    getTotalDifficultyByNumber(number) {
      const api = apiName;
      const method = "getTotalDifficultyByNumber";
      return client.fetch(api, method, { number });
    },
    getTotalDifficultyByHash(hash) {
      const api = apiName;
      const method = "getTotalDifficultyByHash";
      return client.fetch(api, method, { hash });
    }
  };
};
