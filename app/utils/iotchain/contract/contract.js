const contract = {
    itcMapping:{
        code:`pragma solidity >=0.4.0 <0.5.0;


        /**
         * @title SafeMath
         * @dev Unsigned math operations with safety checks that revert on error.
         * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol
         */
        library SafeMath {
            
            function div(uint256 a, uint256 b) internal pure returns (uint256) {
               
                require(b > 0);
                uint256 c = a / b;
                return c;
            }
        }
        
        /**
         * @title Token
         * @dev API interface for interacting with the ITC Token contract 
         */
        interface Token {
        
          function transfer(address _to, uint256 _value) external;
        
          function balanceOf(address _owner) external returns (uint256 balance);
        }
        
        
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol
         */
        contract Ownable {
             address public _owner;
        
            event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
            constructor () internal {
                _owner = msg.sender;
                emit OwnershipTransferred(address(0), _owner);
            }
        
            modifier onlyOwner() {
                require(isOwner());
                _;
            }
        
            function isOwner() public view returns (bool) {
                return msg.sender == _owner;
            }
        
            function transferOwnership(address newOwner) public onlyOwner {
                _transferOwnership(newOwner);
            }
        
            function _transferOwnership(address newOwner) internal {
                require(newOwner != address(0));
                emit OwnershipTransferred(_owner, newOwner);
                _owner = newOwner;
            }
        }
        
        contract ITCMapping is Ownable{
            
            using SafeMath for uint256;
        
            //ITC合约
            Token public token;
            
            //ITC和ITG发放比例
            uint ratio = 10;
            
            constructor(address tokenAddress) public{
                
                token = Token(tokenAddress);
            }
            
            /**
            * @dev 接收ETH
            */
            function() payable external{
            }
            
            /**
            * @dev 批量映射ITC和ITG
            */
            function batchTransfer(address[] memory addresses,uint256[] memory values) public payable onlyOwner{
                
                require(addresses.length == values.length,'param error');
                
                uint length = addresses.length;
                for (uint i=0 ; i< length ; i++){
                                
                    uint256 itgBalance = SafeMath.div(values[i],ratio);
        
                    require(token.balanceOf(address(this))>values[i],'Insufficient ITC balance');
                    require(address(this).balance>itgBalance,'Insufficient ITG balance');
                    
                    //发放ITC
                    token.transfer(addresses[i],values[i]);
                    
                    //发放ITG
                    addresses[i].transfer(itgBalance);
                }
            }
            
            /**
            * @dev 发送剩余ITC至合约拥有人
            */
            function transferITCToOwner() public onlyOwner{
                
                address contractAddress = address(this);
                uint256 balance = token.balanceOf(contractAddress);
                token.transfer(msg.sender,balance);
            }
            
            /**
            * @dev 销毁合约
            */
            function destruct() payable public onlyOwner {
                
                //销毁合约前，先确保合约地址的ITC已经转移完毕 
                address contractAddress = address(this);
                require(token.balanceOf(contractAddress) == 0,'ITC balance is not empty, please transfer ITC first');
                
                selfdestruct(msg.sender); // 销毁合约
            }
        }`,
        byteCode:`6080604052600a60025534801561001557600080fd5b50604051602080610dc983398101806040528101908080519060200190929190505050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a380600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610c84806101456000396000f300608060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632b68b9c61461008557806388d695b21461008f5780638f32d59b1461012b578063a858a6961461015a578063b2bdfa7b14610171578063f2fde38b146101c8578063fc0c546a1461020b575b005b61008d610262565b005b6101296004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050610428565b005b34801561013757600080fd5b5061014061087f565b604051808215151515815260200191505060405180910390f35b34801561016657600080fd5b5061016f6108d6565b005b34801561017d57600080fd5b50610186610aca565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101d457600080fd5b50610209600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610aef565b005b34801561021757600080fd5b50610220610b0e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600061026c61087f565b151561027757600080fd5b3090506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15801561033957600080fd5b505af115801561034d573d6000803e3d6000fd5b505050506040513d602081101561036357600080fd5b810190808051906020019092919050505014151561040f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001807f4954432062616c616e6365206973206e6f7420656d7074792c20706c6561736581526020017f207472616e73666572204954432066697273740000000000000000000000000081525060400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16ff5b600080600061043561087f565b151561044057600080fd5b835185511415156104b9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f706172616d206572726f7200000000000000000000000000000000000000000081525060200191505060405180910390fd5b84519250600091505b82821015610878576104ed84838151811015156104db57fe5b90602001906020020151600254610b34565b905083828151811015156104fd57fe5b90602001906020020151600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1580156105c457600080fd5b505af11580156105d8573d6000803e3d6000fd5b505050506040513d60208110156105ee57600080fd5b8101908080519060200190929190505050111515610674576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f496e73756666696369656e74204954432062616c616e6365000000000000000081525060200191505060405180910390fd5b803073ffffffffffffffffffffffffffffffffffffffff1631111515610702576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f496e73756666696369656e74204954472062616c616e6365000000000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb868481518110151561074e57fe5b90602001906020020151868581518110151561076657fe5b906020019060200201516040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156107f557600080fd5b505af1158015610809573d6000803e3d6000fd5b50505050848281518110151561081b57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561086a573d6000803e3d6000fd5b5081806001019250506104c2565b5050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6000806108e161087f565b15156108ec57600080fd5b309150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1580156109ac57600080fd5b505af11580156109c0573d6000803e3d6000fd5b505050506040513d60208110156109d657600080fd5b81019080805190602001909291905050509050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015610aae57600080fd5b505af1158015610ac2573d6000803e3d6000fd5b505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610af761087f565b1515610b0257600080fd5b610b0b81610b5e565b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080600083111515610b4657600080fd5b8284811515610b5157fe5b0490508091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610b9a57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a72305820e5325d7be3adc5e2624cd096af389c6f171204c922512615a7c7c5f5a679dda00029`,
        abi:`[
            {
                "constant": false,
                "inputs": [],
                "name": "destruct",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "addresses",
                        "type": "address[]"
                    },
                    {
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "name": "batchTransfer",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "isOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "transferITCToOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "_owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "token",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "name": "tokenAddress",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            }
        ]`
    },
    itcToken:{
        code:`pragma solidity >=0.4.0 <0.6.0;

        interface tokenRecipient { 
            function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) external; 
        }
        
        contract TokenERC20 {
            // Public variables of the token
            string public name = "IOT on Chain";
            string public symbol = "ITC";
            uint256 public decimals = 18;
            // 18 decimals is the strongly suggested default, avoid changing it
            uint256 public totalSupply = 100*1000*1000*10**decimals;
        
            // This creates an array with all balances
            mapping (address => uint256) public balanceOf;
            mapping (address => mapping (address => uint256)) public allowance;
        
            // This generates a public event on the blockchain that will notify clients
            event Transfer(address indexed from, address indexed to, uint256 value);
        
            // This notifies clients about the amount burnt
            event Burn(address indexed from, uint256 value);
        
            /**
             * Constrctor function
             *
             * Initializes contract with initial supply tokens to the creator of the contract
             */
            constructor() public {
                balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
            }
        
            /**
             * Internal transfer, only can be called by this contract
             */
            function _transfer(address _from, address _to, uint _value) internal {
                // Prevent transfer to 0x0 address. Use burn() instead
                require(_to != address(0));
                // Check if the sender has enough
                require(balanceOf[_from] >= _value);
                // Check for overflows
                require(balanceOf[_to] + _value > balanceOf[_to]);
                // Save this for an assertion in the future
                uint previousBalances = balanceOf[_from] + balanceOf[_to];
                // Subtract from the sender
                balanceOf[_from] -= _value;
                // Add the same to the recipient
                balanceOf[_to] += _value;
                emit Transfer(_from, _to, _value);
                // Asserts are used to use static analysis to find bugs in your code. They should never fail
                assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
            }
        
            /**
             * Transfer tokens
             *
             * Send "_value" tokens to "_to" from your account
             *
             * @param _to The address of the recipient
             * @param _value the amount to send
             */
            function transfer(address _to, uint256 _value) public {
                _transfer(msg.sender, _to, _value);
            }
        
            /**
             * Transfer tokens from other address
             *
             * Send "_value" tokens to "_to" in behalf of "_from"
             *
             * @param _from The address of the sender
             * @param _to The address of the recipient
             * @param _value the amount to send
             */
            function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
                require(_value <= allowance[_from][msg.sender]);     // Check allowance
                allowance[_from][msg.sender] -= _value;
                _transfer(_from, _to, _value);
                return true;
            }
        
            /**
             * Set allowance for other address
             *
             * Allows "_spender" to spend no more than "_value" tokens in your behalf
             *
             * @param _spender The address authorized to spend
             * @param _value the max amount they can spend
             */
            function approve(address _spender, uint256 _value) public
                returns (bool success) {
                allowance[msg.sender][_spender] = _value;
                return true;
            }
        
            /**
             * Set allowance for other address and notify
             *
             * Allows "_spender" to spend no more than "_value" tokens in your behalf, and then ping the contract about it
             *
             * @param _spender The address authorized to spend
             * @param _value the max amount they can spend
             * @param _extraData some extra information to send to the approved contract
             */
            function approveAndCall(address _spender, uint256 _value, bytes memory _extraData)
                public
                returns (bool success) {
                tokenRecipient spender = tokenRecipient(_spender);
                if (approve(_spender, _value)) {
                    spender.receiveApproval(msg.sender, _value, address(this), _extraData);
                    return true;
                }
            }
        
            /**
             * Destroy tokens
             *
             * Remove "_value" tokens from the system irreversibly
             *
             * @param _value the amount of money to burn
             */
            function burn(uint256 _value) public returns (bool success) {
                require(balanceOf[msg.sender] >= _value);   // Check if the sender has enough
                balanceOf[msg.sender] -= _value;            // Subtract from the sender
                totalSupply -= _value;                      // Updates totalSupply
                emit Burn(msg.sender, _value);
                return true;
            }
        
            /**
             * Destroy tokens from other account
             *
             * Remove "_value" tokens from the system irreversibly on behalf of "_from".
             *
             * @param _from the address of the sender
             * @param _value the amount of money to burn
             */
            function burnFrom(address _from, uint256 _value) public returns (bool success) {
                require(balanceOf[_from] >= _value);                // Check if the targeted balance is enough
                require(_value <= allowance[_from][msg.sender]);    // Check allowance
                balanceOf[_from] -= _value;                         // Subtract from the targeted balance
                allowance[_from][msg.sender] -= _value;             // Subtract from the sender's allowance
                totalSupply -= _value;                              // Update totalSupply
                emit Burn(_from, _value);
                return true;
            }
        }
        `,
        byteCode:`60806040526040805190810160405280600c81526020017f494f54206f6e20436861696e000000000000000000000000000000000000000081525060009080519060200190620000519291906200010e565b506040805190810160405280600381526020017f4954430000000000000000000000000000000000000000000000000000000000815250600190805190602001906200009f9291906200010e565b506012600255600254600a0a6305f5e10002600355348015620000c157600080fd5b50600354600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550620001bd565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200015157805160ff191683800117855562000182565b8280016001018555821562000182579182015b828111156200018157825182559160200191906001019062000164565b5b50905062000191919062000195565b5090565b620001ba91905b80821115620001b65760008160009055506001016200019c565b5090565b90565b6110d680620001cd6000396000f3006080604052600436106100ba576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100bf578063095ea7b31461014f57806318160ddd146101b457806323b872dd146101df578063313ce5671461026457806342966c681461028f57806370a08231146102d457806379cc67901461032b57806395d89b4114610390578063a9059cbb14610420578063cae9ca511461046d578063dd62ed3e14610518575b600080fd5b3480156100cb57600080fd5b506100d461058f565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101145780820151818401526020810190506100f9565b50505050905090810190601f1680156101415780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561015b57600080fd5b5061019a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061062d565b604051808215151515815260200191505060405180910390f35b3480156101c057600080fd5b506101c96106ba565b6040518082815260200191505060405180910390f35b3480156101eb57600080fd5b5061024a600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506106c0565b604051808215151515815260200191505060405180910390f35b34801561027057600080fd5b506102796107ed565b6040518082815260200191505060405180910390f35b34801561029b57600080fd5b506102ba600480360381019080803590602001909291905050506107f3565b604051808215151515815260200191505060405180910390f35b3480156102e057600080fd5b50610315600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506108f7565b6040518082815260200191505060405180910390f35b34801561033757600080fd5b50610376600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061090f565b604051808215151515815260200191505060405180910390f35b34801561039c57600080fd5b506103a5610b29565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156103e55780820151818401526020810190506103ca565b50505050905090810190601f1680156104125780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561042c57600080fd5b5061046b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610bc7565b005b34801561047957600080fd5b506104fe600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610bd6565b604051808215151515815260200191505060405180910390f35b34801561052457600080fd5b50610579600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610d59565b6040518082815260200191505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106255780601f106105fa57610100808354040283529160200191610625565b820191906000526020600020905b81548152906001019060200180831161060857829003601f168201915b505050505081565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b60035481565b6000600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054821115151561074d57600080fd5b81600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055506107e2848484610d7e565b600190509392505050565b60025481565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561084357600080fd5b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816003600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a260019050919050565b60046020528060005260406000206000915090505481565b600081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561095f57600080fd5b600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482111515156109ea57600080fd5b81600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816003600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a26001905092915050565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bbf5780601f10610b9457610100808354040283529160200191610bbf565b820191906000526020600020905b815481529060010190602001808311610ba257829003601f168201915b505050505081565b610bd2338383610d7e565b5050565b600080849050610be6858561062d565b15610d50578073ffffffffffffffffffffffffffffffffffffffff16638f4ffcb1338630876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b83811015610ce0578082015181840152602081019050610cc5565b50505050905090810190601f168015610d0d5780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b158015610d2f57600080fd5b505af1158015610d43573d6000803e3d6000fd5b5050505060019150610d51565b5b509392505050565b6005602052816000526040600020602052806000526040600020600091509150505481565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614151515610dbb57600080fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610e0957600080fd5b600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401111515610e9757600080fd5b600460008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401905081600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a380600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054600460008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011415156110a457fe5b505050505600a165627a7a72305820501a2841262a802691e71ec2a114c1c2d51844217d901f9cf666144c47d503560029`,
        abi:`[
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "burn",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "burnFrom",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    },
                    {
                        "name": "_extraData",
                        "type": "bytes"
                    }
                ],
                "name": "approveAndCall",
                "outputs": [
                    {
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Burn",
                "type": "event"
            }
        ]`
    },
    testContract:{
        code:`pragma solidity >=0.4.0 <0.6.0;
        pragma experimental ABIEncoderV2;
        
        contract Vaccine {
            address public minter;
        
            uint256 private recoderAmount;
        
            mapping (string => string) private values;
        
            constructor() public {
                minter = msg.sender;
            }
        
            function setValue(string memory key, string memory newValue) public onlyOwner {
                require(msg.sender == minter,"没有权限");
                require(bytes(key).length != 0,"invalid key");
                require(bytes(newValue).length != 0,"invalid value");
        
                if(bytes(values[key]).length==0){
                    recoderAmount++;
                }
                
                values[key] = newValue;
            }
        
            function batchSetValues(string[] memory keys,string[] memory newValues) public onlyOwner {
                
                require(keys.length == newValues.length,"invalid keys and values");
                
                for (uint i = 0;i<keys.length;i++) {
                    
                    require(bytes(keys[i]).length != 0,"invalid key");
                    require(bytes(newValues[i]).length != 0,"invalid value");
                    
                    if(bytes(values[keys[i]]).length==0){
                    recoderAmount++;
                }
                    
                    values[keys[i]] = newValues[i];
                }
            }
        
            function getValue(string memory key) public onlyOwner view returns (string memory){ 
                
                return values[key];
            }
        
            function batchGetValues(string[] memory keys) public onlyOwner view returns (string[] memory){
                
                string[] memory list = new string[](keys.length);
                for (uint i = 0;i<keys.length;i++) {
                    list[i] = values[keys[i]];
                }
                return list;
            }
            
            function getRecoderAmount() public view onlyOwner returns(uint256 ){
                
                return recoderAmount;
            }
            
            modifier onlyOwner {
                require(msg.sender == minter,"No Permission");
                _;
            }
        }`,
        byteCode:`608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610dab806100606000396000f3fe60806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630754617214610072578063960384a01461009d578063bd7166a8146100da578063d885851e14610117578063ec86cfad14610140575b600080fd5b34801561007e57600080fd5b50610087610169565b6040516100949190610b65565b60405180910390f35b3480156100a957600080fd5b506100c460048036036100bf9190810190610961565b61018e565b6040516100d19190610ba2565b60405180910390f35b3480156100e657600080fd5b5061010160048036036100fc91908101906108b4565b61029b565b60405161010e9190610b80565b60405180910390f35b34801561012357600080fd5b5061013e600480360361013991908101906108f5565b610432565b005b34801561014c57600080fd5b50610167600480360361016291908101906109a2565b6105d8565b005b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60606001826040518082805190602001908083835b6020831015156101c857805182526020820191506020810190506020830392506101a3565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561028f5780601f106102645761010080835404028352916020019161028f565b820191906000526020600020905b81548152906001019060200180831161027257829003601f168201915b50505050509050919050565b60608082516040519080825280602002602001820160405280156102d357816020015b60608152602001906001900390816102be5790505b50905060008090505b835181101561042857600184828151811015156102f557fe5b906020019060200201516040518082805190602001908083835b602083101515610334578051825260208201915060208101905060208303925061030f565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103fb5780601f106103d0576101008083540402835291602001916103fb565b820191906000526020600020905b8154815290600101906020018083116103de57829003601f168201915b5050505050828281518110151561040e57fe5b9060200190602002018190525080806001019150506102dc565b5080915050919050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156104c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ba90610be4565b60405180910390fd5b80518251141515610509576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161050090610bc4565b60405180910390fd5b60008090505b82518110156105d357818181518110151561052657fe5b906020019060200201516001848381518110151561054057fe5b906020019060200201516040518082805190602001908083835b60208310151561057f578051825260208201915060208101905060208303925061055a565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906105c59291906106ed565b50808060010191505061050f565b505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610669576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161066090610be4565b60405180910390fd5b806001836040518082805190602001908083835b6020831015156106a2578051825260208201915060208101905060208303925061067d565b6001836020036101000a038019825116818451168082178552505050505050905001915050908152602001604051809103902090805190602001906106e89291906106ed565b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061072e57805160ff191683800117855561075c565b8280016001018555821561075c579182015b8281111561075b578251825591602001919060010190610740565b5b509050610769919061076d565b5090565b61078f91905b8082111561078b576000816000905550600101610773565b5090565b90565b600082601f83011215156107a557600080fd5b81356107b86107b382610c31565b610c04565b9150818183526020840193506020810190508360005b838110156107fe57813586016107e48882610808565b8452602084019350602083019250506001810190506107ce565b5050505092915050565b600082601f830112151561081b57600080fd5b813561082e61082982610c59565b610c04565b9150808252602083016020830185838301111561084a57600080fd5b610855838284610d1e565b50505092915050565b600082601f830112151561087157600080fd5b813561088461087f82610c85565b610c04565b915080825260208301602083018583830111156108a057600080fd5b6108ab838284610d1e565b50505092915050565b6000602082840312156108c657600080fd5b600082013567ffffffffffffffff8111156108e057600080fd5b6108ec84828501610792565b91505092915050565b6000806040838503121561090857600080fd5b600083013567ffffffffffffffff81111561092257600080fd5b61092e85828601610792565b925050602083013567ffffffffffffffff81111561094b57600080fd5b61095785828601610792565b9150509250929050565b60006020828403121561097357600080fd5b600082013567ffffffffffffffff81111561098d57600080fd5b6109998482850161085e565b91505092915050565b600080604083850312156109b557600080fd5b600083013567ffffffffffffffff8111156109cf57600080fd5b6109db8582860161085e565b925050602083013567ffffffffffffffff8111156109f857600080fd5b610a048582860161085e565b9150509250929050565b610a1781610cec565b82525050565b6000610a2882610cbe565b80845260208401935083602082028501610a4185610cb1565b60005b84811015610a7a578383038852610a5c838351610ac1565b9250610a6782610cdf565b9150602088019750600181019050610a44565b508196508694505050505092915050565b6000610a9682610cd4565b808452610aaa816020860160208601610d2d565b610ab381610d60565b602085010191505092915050565b6000610acc82610cc9565b808452610ae0816020860160208601610d2d565b610ae981610d60565b602085010191505092915050565b6000600f82527fe58f82e695b0e4b88de58cb9e9858d00000000000000000000000000000000006020830152604082019050919050565b6000600c82527fe6b2a1e69c89e69d83e9999000000000000000000000000000000000000000006020830152604082019050919050565b6000602082019050610b7a6000830184610a0e565b92915050565b60006020820190508181036000830152610b9a8184610a1d565b905092915050565b60006020820190508181036000830152610bbc8184610a8b565b905092915050565b60006020820190508181036000830152610bdd81610af7565b9050919050565b60006020820190508181036000830152610bfd81610b2e565b9050919050565b6000604051905081810181811067ffffffffffffffff82111715610c2757600080fd5b8060405250919050565b600067ffffffffffffffff821115610c4857600080fd5b602082029050602081019050919050565b600067ffffffffffffffff821115610c7057600080fd5b601f19601f8301169050602081019050919050565b600067ffffffffffffffff821115610c9c57600080fd5b601f19601f8301169050602081019050919050565b6000602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b6000610cf782610cfe565b9050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b82818337600083830152505050565b60005b83811015610d4b578082015181840152602081019050610d30565b83811115610d5a576000848401525b50505050565b6000601f19601f830116905091905056fea265627a7a72305820cd995ddc9555dcff4448854ee4728caa8bca5b265967a301ae4ddd0b86dd5db36c6578706572696d656e74616cf50037`,
        abi:``
    },
    testMappingContract:{
        code:`pragma solidity >=0.4.0 <0.5.0;


        /**
         * @title SafeMath
         * @dev Unsigned math operations with safety checks that revert on error.
         * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/math/SafeMath.sol
         */
        library SafeMath {
            
            function div(uint256 a, uint256 b) internal pure returns (uint256) {
               
                require(b > 0);
                uint256 c = a / b;
                return c;
            }
        }
        
        /**
         * @title Token
         * @dev API interface for interacting with the ITC Token contract 
         */
        interface Token {
        
          function transfer(address _to, uint256 _value) external;
        
          function balanceOf(address _owner) external returns (uint256 balance);
        }
        
        
        /**
         * @title Ownable
         * @dev The Ownable contract has an owner address, and provides basic authorization control
         * https://github.com/OpenZeppelin/openzeppelin-solidity/blob/master/contracts/ownership/Ownable.sol
         */
        contract Ownable {
             address public _owner;
        
            event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
        
            constructor () internal {
                _owner = msg.sender;
                emit OwnershipTransferred(address(0), _owner);
            }
        
            modifier onlyOwner() {
                require(isOwner());
                _;
            }
        
            function isOwner() public view returns (bool) {
                return msg.sender == _owner;
            }
        
            function transferOwnership(address newOwner) public onlyOwner {
                _transferOwnership(newOwner);
            }
        
            function _transferOwnership(address newOwner) internal {
                require(newOwner != address(0));
                emit OwnershipTransferred(_owner, newOwner);
                _owner = newOwner;
            }
        }
        
        contract ITCMapping is Ownable{
            
            using SafeMath for uint256;
        
            //ITC合约
            Token public token;
            
            //ITC和ITG发放比例
            uint ratio = 1;
            
            constructor() public{
                
                token = Token(0xCc4f9b69118063D05D43ec4d327D4331a2931a20);
            }
            
            /**
            * @dev 接收
            */
            function() payable external{
            }
            
            /**
            * @dev 批量映射ITC和ITG
            */
            function batchTransfer(address[] memory addresses,uint256[] memory values) public payable onlyOwner{
                
                require(addresses.length == values.length,'param error');
                
                uint length = addresses.length;
                for (uint i=0 ; i< length ; i++){
                                
                    uint256 itgBalance = SafeMath.div(values[i],ratio);
        
                    require(token.balanceOf(address(this))>values[i],'Insufficient ITC balance');
                    require(address(this).balance>itgBalance,'Insufficient ITG balance');
                    
                    //发放ITC
                    token.transfer(addresses[i],values[i]);
                    
                    //发放ITG
                    addresses[i].transfer(itgBalance);
                }
            }
            
            /**
            * @dev 发送剩余ITC至合约拥有人
            */
            function transferITCToOwner() public onlyOwner{
                
                address contractAddress = address(this);
                uint256 balance = token.balanceOf(contractAddress);
                token.transfer(msg.sender,balance);
            }
            
            /**
            * @dev 销毁合约
            */
            function destruct() payable public onlyOwner {
                
                //销毁合约前，先确保合约地址的ITC已经转移完毕 
                address contractAddress = address(this);
                require(token.balanceOf(contractAddress) == 0,'ITC balance is not empty, please transfer ITC first');
                
                selfdestruct(msg.sender); // 销毁合约
            }
        }`,
        byteCode:`6080604052600160025534801561001557600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a373cc4f9b69118063d05d43ec4d327d4331a2931a20600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610c84806101366000396000f300608060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632b68b9c61461008557806388d695b21461008f5780638f32d59b1461012b578063a858a6961461015a578063b2bdfa7b14610171578063f2fde38b146101c8578063fc0c546a1461020b575b005b61008d610262565b005b6101296004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290505050610428565b005b34801561013757600080fd5b5061014061087f565b604051808215151515815260200191505060405180910390f35b34801561016657600080fd5b5061016f6108d6565b005b34801561017d57600080fd5b50610186610aca565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101d457600080fd5b50610209600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610aef565b005b34801561021757600080fd5b50610220610b0e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b600061026c61087f565b151561027757600080fd5b3090506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b15801561033957600080fd5b505af115801561034d573d6000803e3d6000fd5b505050506040513d602081101561036357600080fd5b810190808051906020019092919050505014151561040f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260338152602001807f4954432062616c616e6365206973206e6f7420656d7074792c20706c6561736581526020017f207472616e73666572204954432066697273740000000000000000000000000081525060400191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff16ff5b600080600061043561087f565b151561044057600080fd5b835185511415156104b9576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600b8152602001807f706172616d206572726f7200000000000000000000000000000000000000000081525060200191505060405180910390fd5b84519250600091505b82821015610878576104ed84838151811015156104db57fe5b90602001906020020151600254610b34565b905083828151811015156104fd57fe5b90602001906020020151600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1580156105c457600080fd5b505af11580156105d8573d6000803e3d6000fd5b505050506040513d60208110156105ee57600080fd5b8101908080519060200190929190505050111515610674576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f496e73756666696369656e74204954432062616c616e6365000000000000000081525060200191505060405180910390fd5b803073ffffffffffffffffffffffffffffffffffffffff1631111515610702576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f496e73756666696369656e74204954472062616c616e6365000000000000000081525060200191505060405180910390fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb868481518110151561074e57fe5b90602001906020020151868581518110151561076657fe5b906020019060200201516040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156107f557600080fd5b505af1158015610809573d6000803e3d6000fd5b50505050848281518110151561081b57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561086a573d6000803e3d6000fd5b5081806001019250506104c2565b5050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6000806108e161087f565b15156108ec57600080fd5b309150600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231836040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050602060405180830381600087803b1580156109ac57600080fd5b505af11580156109c0573d6000803e3d6000fd5b505050506040513d60208110156109d657600080fd5b81019080805190602001909291905050509050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b158015610aae57600080fd5b505af1158015610ac2573d6000803e3d6000fd5b505050505050565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b610af761087f565b1515610b0257600080fd5b610b0b81610b5e565b50565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080600083111515610b4657600080fd5b8284811515610b5157fe5b0490508091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610b9a57600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a72305820620d26ffd0f9ab5ee2555f41057944ea3570bc087cc62f2566916930013b48a40029`,
        abi:`[
            {
                "constant": false,
                "inputs": [],
                "name": "destruct",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "addresses",
                        "type": "address[]"
                    },
                    {
                        "name": "values",
                        "type": "uint256[]"
                    }
                ],
                "name": "batchTransfer",
                "outputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "isOwner",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "transferITCToOwner",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "_owner",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "transferOwnership",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "token",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "previousOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "name": "OwnershipTransferred",
                "type": "event"
            }
        ]`
    },
    exampleContract:{
        code:``,
        byteCode:``,
        abi:``
    }
}

module.exports = contract