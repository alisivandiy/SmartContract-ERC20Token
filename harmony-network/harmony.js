// Harmony Create Wallet With pub and private key;
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

  // create harmony wallet;
const prv = 'c80a987899e92376670e5ea9b3b7460b684dd7245e132e649340816d1f2718af';
const publickey = '0x035e8c71a4b9838b25d59301d1c68b2249196cb9c405a1ac6bb69dc6facbdf25e7';
const addprv = getAddressFromPrivateKey(prv);
const address = getAddressFromPublicKey(publickey);
const addr = new HarmonyAddress(addprv);

console.log(addr.bech32);
console.log(addr.checksum);

// Valid bech32
console.log(HarmonyAddress.isValidBech32(addr.bech32));

// // transfer with Harmony Js
// const { Harmony } = require('@harmony-js/core');
// const {
//     ChainID,
//     ChainType,
//     hexToNumber,
//     numberToHex,
//     fromWei,
//     Units,
//     Unit,
//   } = require('@harmony-js/utils');

// const hmy = new Harmony(
//     'https://api.s0.b.hmny.io/',
//     {
//         chainType: ChainType.Harmony,
//         chainId: ChainID.HmyTestnet,
//     },
// );

// hmy.wallet.addByPrivateKey('c80a987899e92376670e5ea9b3b7460b684dd7245e132e649340816d1f2718af');
// const txn = hmy.transactions.newTx({
//     to: 'one13mrfzc9uwlvhft3n62c8rsl6ya7cgdcvnf8fen',
//     value: new Unit(1).asOne().toWei(),
//     // gas limit, you can use string
//     gasLimit: '21000',
//     // send token from shardID
//     shardID: 0,
//     // send token to toShardID
//     toShardID: 0,
//     // gas Price, you can use Unit class, and use Gwei, then remember to use toWei(), which will be transformed to BN
//     gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
//   });

  // sign the transaction use wallet;
//   const signedTxn =  hmy.wallet.signTransaction(txn);
//   const txnHash =  hmy.blockchain.sendTransaction(signedTxn);
//   console.log(txnHash.result);


  // transfer MainToken(ONE) Harmony Network with WEB3
 const Web3 = require('web3');
 const web3 = new Web3('https://api.s1.b.hmny.io');

web3.eth.getTransactionCount(addr.checksum , (err,txCount) => {
    const txObject = {
        nonce : web3.utils.toHex(txCount),
        gasLimit : web3.utils.toHex(21000),
        gasPrice : web3.utils.toHex(web3.utils.toWei('10' , 'gwei')),
        value : 50e18 ,
        shardID : 0, 
        to_shard_id: 1,
        to : '0x8Ec69160BC77D974ae33d2b071C3FA277D84370C',
    }

    web3.eth.accounts.signTransaction(txObject , '0x' + prv.toString('hex')).then((a)=>{
        web3.eth.sendSignedTransaction(a.rawTransaction).then((z) => {
            console.log(z);
        });
    });
});

// web3.currentProvider.send( {
//   "jsonrpc": "2.0",
//   "id": 1,
//   "method": "hmyv2_getTransactionsHistory",
//   "params": [
//       {
//           "address": "one15vlc8yqstm9algcf6e94dxqx6y04jcsqjuc3gt",
//           "pageIndex": 0,
//           "pageSize": 1,
//           "fullTx": true,
//           "txType": "ALL",
//           "order": "ASC"
//       }
//   ]
// },(result) => {
//   console.log(result);
// })




