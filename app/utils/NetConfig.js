import { Platform, NativeModules } from "react-native";

const RNGetInfo = NativeModules.RNGetInfo;
const iotchain_network_mainnet = RNGetInfo.iotchain_network_mainnet;
const iotchain_network_config_abel = {
  nodeUrl: "http://139.224.255.21:30315",
  chainId: 100,
  txDetailUrl: "https://iotchain.io/developerexplorer/transaction/",
  txServerUrl: "https://abel.iotchain.io/",
  itcContractAddress: "0x866f68430344fb1a0b0271c588abae123a8c31dd",
};

const iotchain_network_config_main = {
  nodeUrl: "http://47.102.121.72:30315",
  chainId: 10,
  txDetailUrl: "https://iotchain.io/explorer/transaction/",
  txServerUrl: "https://explorer.iotchain.io/",
  itcContractAddress: "0x2ca70e7d0c396c36e8b9d206d988607a013483cf",
};

// const iotchain_network_mainnet  = false

module.exports = {
  itcNetworkConfig: iotchain_network_mainnet === 0 ? iotchain_network_config_main : iotchain_network_config_abel
};