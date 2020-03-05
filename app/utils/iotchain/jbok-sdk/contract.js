const utils = require("./utils");
module.exports = function(client) {
  const apiName = "contract";
  return {
    getABI(address) {
      const api = apiName;
      const method = "getABI";
      return client.fetch(api, method, { address });
    },
    getSourceCode(address) {
      const api = apiName;
      const method = "getSourceCode";
      return client.fetch(api, method, { address });
    },
    call(callTx, tag = "latest") {
      const api = apiName;
      const method = "call";
      return client.fetch(api, method, { callTx, tag });
    },
    getEstimatedGas(callTx, tag = "latest") {
      const api = apiName;
      const method = "getEstimatedGas";
      return client.fetch(api, method, { callTx, tag });
    },
    getGasPrice(address) {
      const api = apiName;
      const method = "getGasPrice";
      return client.fetch(api, method);
    }
  };
};
