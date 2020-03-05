const RandomColor = () => `#${`00000${(Math.random() * 0x1000000 < 0).toString(16)}`.slice(-6)}`;

const Colors = {
  RandomColor,
  // 字体颜色
  fontBlackColor: "#424242",
  fontBlackColor_43: "#434343",
  fontDarkColor: "#000",
  fontBlackColor_0a: "#0a1e3b",
  fontGrayColor: "#ECECEC",
  fontDarkGrayColor: "#959595",
  fontWhiteColor: "#FFFFFF",
  fontBlueColor: "#01a1e6",
  fontBlueColor1: "#00C6FF",
  fontGreenColor: "#1bc94b",
  fontRedColor: "#e62624",
  fontGrayColor_a: "#aaaaaa",
  fontGrayColor_a0: "#a0a0a0",
  fontGrayColor_a1: "#a1a1a1",
  fontBlackColor_31: "#313131",
  fontGreenColor_46: "#709E46",

  // 警告框颜色
  RedColor: "#ff3636",
  // 主题颜色
  themeColor: "#00a0e9",
  // 控制器视图背景色
  backgroundColor: "#f8f8f8",
  // 黑色半透明色
  blackOpacityColor: "rgba(149,149,149,0.7)",
  // 透明色
  clearColor: "rgba(255,255,255,0.0)",
  // 灰色背景
  bgGrayColor: "#F8F8F8",
  bgGrayColor_ed: "#ededed",
  bgGrayColor_e5: "#e5e5e5",
  // 白底
  whiteBackgroundColor: "#FFFFFF",
  bgColor_e: "#eee",
  bgBlue_9a: "#9ACEF2",
  bgBlue_drawer_top: "rgb(241,250,254)",
  // 按钮颜色
  btn_bg_blue: "rgb(1,176,245)",
  bg_blue: "#EBF8FF",
  borderColor_e: "#eee",
  bg_blue_e9: "#E9F7FE",
  bg_blue_77: "#77BFFD",
  bg_blue_55: "#5596DE",

  // Home
  homeAssetsTestColor: "#535353",

  // 添加资产
  addTokenBorderColor: "#eeeeee",
  addTokenCheckTextColor: "#a0a0a0",
  addTokenLeftTitleColor: "#000000",
  addTokenAddBtnBgColor: "#bfbfbf"
};

const TransferType = {
  ETH: "ETH",
  ITC: "ITC"
};

const TransferGasLimit = {
  ethGasLimit: 25200,
  tokenGasLimit: 110000,
  itcGasLimit: 42000
};

const ItcChainId = {
  default: 1
};

const FontSize = {
  HeaderSize: 18,
  ContentSize: 14,
  TitleSize: 16,
  DetailTitleSize: 14,
  alertTitleSize: 13,
  BtnFontSize: 18
};

const StorageKey = {
  User: "user", // 当前钱包
  HiddenAssets: "hiddenAssets",
  Tokens: "tokens",
  Network: "network",
  Language: "language",
  Contact: "contact", // 保存联系人的key
  RecentTransferAddress: "recentTransferAddress", // 最近转账地址 id为地址
  MonetaryUnit: "monetaryUnit", // 货币单位
  PinInfo: "pinInfo", // 存储pin密码
  UserToken: "userToken", // 存储userToken
  NotRemindAgainTestITC: "notRemindAgainTestITC", // 不再提示
  TransactionRecoderInfo: "TransactionRecoderInfo", // 存储交易记录 id为symbol,
  ItcWalletList: "ItcWalletList", // 存储itc钱包列表
  EthWalletList: "EthWalletList", // 存储eth钱包列表
  ItcWalletNonce: "itcWalletNonce", // 存储itc钱包上次交易的nonce
  MappingServiceAgreement: "mappingServiceAgreement", // 是否查看过映射服务条款
  readAvtivityRules: "readAvtivityRules",  //是否阅读过活动完整规则
  Wallet: "wallet",//钱包
  IdentifyVerify: "identifyVerify",//是否实名认证
  IsSuperNode:"isSuperNode",//是否已成为超级节点
};

const Network = {
  ropsten: "ropsten",
  kovan: "kovan",
  rinkeby: "rinkeby",
  main: "main"
};

const Common = {
  touchIDVertifing: false // touchId是否正在验证中,
};

module.exports = {
  Colors,
  FontSize,
  TransferType,
  TransferGasLimit,
  StorageKey,
  Network,
  Common,
  ItcChainId
};
