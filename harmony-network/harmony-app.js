const {
    encode,
    decode,
    randomBytes,
    toBech32,
    fromBech32,
    HarmonyAddress,
    generatePrivateKey,
    getPubkeyFromPrivateKey,
    getAddressFromPublicKey,
    getAddressFromPrivateKey,
    encryptPhrase,
    decryptPhrase
  } = require('@harmony-js/crypto');
  const axios = require('axios');

  var model = {
    id : Number , 
    prvKey : String , 
    pubKey : String , 
    address : String , 
    oneAddress : String ,
    type : {String , default : "edsa"}
}

function createWallet (pkey) {
    data =  Object.create(model);
    data.id = 1;
    data.type = "edsa";
    //----
    var pubKey = getPubkeyFromPrivateKey(pkey);
    data.pubKey = pubKey;

   var address = getAddressFromPublicKey(pubKey);
   data.address = address;

   var ONEaddress = new HarmonyAddress(address);
   if (HarmonyAddress.isValidBech32(ONEaddress.bech32)) {
      data.oneAddress = ONEaddress.bech32;
      console.log("Wallet Created Successfully");
      return data;
   }
   else {
     console.log("One Address is Not Valid");
     return false;
   }
}

const mainPrvKey = 'c80a987899e92376670e5ea9b3b7460b684dd7245e132e649340816d1f2718af';
var returnedWallet = createWallet(mainPrvKey);
console.log('Your Wallet : ' , returnedWallet)

function transActionHistory(address) {
    axios({
        method : 'post',
        url : 'https://rpc.s0.b.hmny.io',
        data : {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "hmyv2_getTransactionsHistory",
            "params": [
                {
                    "address": address,
                    "pageIndex": 0,
                    "pageSize": 100,
                    "fullTx": true,
                    "txType": "SENT", // ALL , RECEIVED , SENT
                    "order": "ASC"
                }
            ]
        }
    }).then(((response)=>{
        console.log("TransActions History : " , response.data.result.transactions);
    }))
}
transActionHistory(returnedWallet.oneAddress);

function  getBalance(address) {
    axios({
        method : 'post',
        url : 'https://rpc.s0.b.hmny.io',
        data : {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "hmyv2_getBalance",
            "params": [
                address,
            ]
        }
    }).then(((response)=>{
        console.log("Account Balance  : " , response.data.result);
    }));
}
getBalance(returnedWallet.oneAddress);

function transfer(origin , originPrvKey , destination , value) {
    const Web3 = require('web3');
    const web3 = new Web3('https://api.s0.b.hmny.io');
    web3.eth.getTransactionCount(origin , (err,txCount) => {
        const txObject = {
            nonce : web3.utils.toHex(txCount),
            gasLimit : web3.utils.toHex(21000),
            gasPrice : web3.utils.toHex(web3.utils.toWei('10' , 'gwei')),
            value : value ,
            shardID : 0, 
            to_shard_id: 1,
            to : destination,
        }
    
        web3.eth.accounts.signTransaction(txObject , '0x' + originPrvKey.toString('hex')).then((a)=>{
            web3.eth.sendSignedTransaction(a.rawTransaction).then((z) => {
                console.log("transfer Receipt : " , z);
            });
        });
    });
}
var destiantionWallet = '0xe3F4a112BA655c78015c7B220A39e93BE8E21EDD';
transfer(returnedWallet.address , mainPrvKey , destiantionWallet , 50e18 );



