const jbok = require("./lib");
const haser = jbok.Hasher;
const jsonCodec = jbok.JsonCodec;
const signer = jbok.Signer;
const binaryCodec = jbok.BinaryCodec;
const contractParser = jbok.ContractParser;

module.exports = function() {
  return {
    signTx(tx, prikey, chainId) {
      const transactionObject = jsonCodec.decodeTransaction(JSON.stringify(tx));
      const signedTx = signer.signTx(transactionObject, prikey, chainId);
      const signedTxStr = jsonCodec.encodeSignedTransaction(signedTx);
      return JSON.parse(signedTxStr)
    },
    haser,
    jsonCodec,
    signer,
    binaryCodec,
    contractParser
  };
};
