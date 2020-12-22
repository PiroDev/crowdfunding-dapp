/* web3 provider with fallback for old version */
window.addEventListener('load', async() => {
    /* New web3 provider */
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            /* Ask user for permission */
            await ethereum.enable();
            /* User approved permission */
        } catch (error) {
            /* User rejected permission */
            console.log('Access denied');
        }
    }
    /* Old web3 provider */
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
    }
    /* No web3 provider */
    else {
        console.log('No web3 provider detected! Please install MetaMask or other web3 provider.');
    }
});

/* ContractAddress and abi are setted after contract deploy */
const contractAddress = '0x487564c016fAaD642dFa4611B40B00ac017D046f';
const contractAbi = [{ "constant": true, "inputs": [], "name": "date_end", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "daysRemaining", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "rate", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "hard_cap", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalTokens", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "collected", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "funds_address", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "date_start", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "token", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }]

let contract = web3.eth.contract(contractAbi).at(contractAddress);

var account;

web3.eth.getAccounts(function(error, accounts) {
    if (error != null) {
        console.log("Error retrieving accounts.");
        return;
    }
    if (accounts.length == 0) {
        console.log("No account found! Make sure the Ethereum client is configured properly.");
        return;
    }
    account = accounts[0];
    web3.eth.defaultAccount = account;
});

GetInfo();

/* Smart contract functions */
function GetInfo() {
    let element = document.getElementById('contractAddress');
    element.innerHTML = contractAddress;
    element.href = 'https://rinkeby.etherscan.io/address/' + contractAddress;
    element.appendChild(document.createTextNode(contractAddress));

    var info = 'Goal: collect ';

    contract.hard_cap.call((error, result) => {
        info = (info + ToEth(result) + ' Eth.');
        (info + ToEth(result) + ' Eth.');
    });

    contract.daysRemaining.call((error, result) => {
        info = (info + ' Days remain: ' + result.c[0] + '.');
        document.getElementById('info').innerHTML = info;
        GetFundedAmount();
    });

}

function Donate() {
    amount = web3.utils.toWei($("#donationAmount").val(), 'ether');
    web3.eth.sendTransaction({
        to: contract.address,
        value: amount,
        gas: 1000000
    }).then(GetFundedAmount);
}


function GetFundedAmount() {
    contract.collected.call((error, result) => {
        document.getElementById('amount').innerHTML = ToEth(result) + ' ETH was funded';
    });
}

function ToEth(data) {
    let amount = data.c[0];
    let exp = data.e - String(amount).length + 1;
    amount = web3.utils.fromWei(String(amount) + '0'.repeat(exp), 'ether');
    return amount;
}