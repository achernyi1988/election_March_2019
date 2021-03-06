const web3 = require ("../ethereum/web3")
const compiledFactory = require("../ethereum/build/Election");

// PRIVATE_KEY = "109D58463D2A21022382C21C9A4FA0CDDAA6E20B4FDF9CFD2304E182DCC56CBE";
//const CONTRACT_ADDRESS = "0xb9258f83C6c3339Dab568D356A77dd22c6B00042";  //rinkby
const CONTRACT_ADDRESS = "0xc8e920b19957fcaa03ed5939e5904426f81b44c5";    //ganache


const createInstance = async() => {


    let accounts = await web3.eth.getAccounts();

    let instanceSM =  await new web3.eth.Contract(JSON.parse(compiledFactory.interface), CONTRACT_ADDRESS);

    return {instanceSM, accounts }

}

 const smartContractData =  createInstance().then( contractObj => {

    return contractObj;
    }
).catch(err => {
    console.log("instanceSM", err.message);
})

module.exports = smartContractData;
    // const account = web3.eth.accounts.privateKeyToAccount('0x' + PRIVATE_KEY);
    // console.log(account);
    // web3.eth.accounts.wallet.add(account);
    // console.log("before", web3.eth.defaultAccount);
    // web3.eth.defaultAccount = account.address;
    // console.log("after", web3.eth.defaultAccount);

    // let accounts = await web3.eth.getAccounts();
    // console.log(accounts);


    // console.log("contract", smartContract);
    //
    // instanceSM =  new smartContract;
    //
    // console.log("instanceSM", smartContract);






