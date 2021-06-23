var DappToken = artifacts.require("./DappToken");
var DappTokenSale = artifacts.require("./DappTokenSale");

contract('DappTokenSale' , function(accounts) {
    var tokenSaleInstance;
    var tokenInstance;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 1000000000000000; // in wei
    var tokensAvailable = 750000;
    var numberOfTokens;

    it('initializes the contract with the correct values', function() {
        return DappTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address) {
            assert.notEqual(address , 0x0 , 'has contract address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address , 0x0 , 'has token contract address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price , tokenPrice , 'token price is Correct');
        });
    });

    it('facilitates token buying' , function() {
        return DappToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return DappTokenSale.deployed();
        }).then(function(instance) {
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address , tokensAvailable , { from : admin });
        }).then(function(receipt) { 
            numberOfTokens = 20;
            return tokenSaleInstance.buyTokens(numberOfTokens , {from : buyer , value : numberOfTokens * tokenPrice});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'logs the account the tokens are transferred to');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber() , numberOfTokens , 'increments the number of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            console.log(balance.toNumber());
            assert.equal(balance.toNumber() , numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);  
        }).then(function(blnce){
            assert.equal(blnce.toNumber() , tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens ,  {from : buyer , value : 1});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0 , 'msg.value must equal number of tokens in wei');
            return tokenSaleInstance.buyTokens(800000 ,  {from : buyer , value : numberOfTokens * tokenPrice});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0 , 'cannot purchase more token available');
        });
    });
});