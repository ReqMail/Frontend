"use client"
import { useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { AuthAdapter, WEB3AUTH_NETWORK } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "./utils/rpc";
import axios from 'axios'
import { UserCircle2, Wallet, CreditCard, MessageCircle, LogOut, Power } from 'lucide-react';

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const web3auth = new Web3Auth({
  clientId: "BJe6CJUaVDi6GGlrgimVCx7LJAKte0HzaIy-9okXOEF7QCX6-Hydevtza6tDufFh1okpJISGBJwZ7Rt9KmvUj8M",
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

export default function Web3AuthComponent() {
  const [provider, setProvider] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [balance, setBalance] = useState('');
  const postUserAddress = async (email, address) => {
    try {
      await axios.post('http://localhost:3000/address', {
        email,
        walletAddress: address
      });
      console.log('User address posted successfully');
    } catch (error) {
      console.error('Error posting user address:', error);
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        const authAdapter = new AuthAdapter({
          adapterSettings: {
            loginConfig: {
              google: {
                verifier: "custom-reqmail-google",
                typeOfLogin: "google",
                clientId: "327617573650-hduvdv79m92b8t695qvhkieffhekj3ub.apps.googleusercontent.com",
              },
            },
          },
          privateKeyProvider,
        });
        web3auth.configureAdapter(authAdapter);
        await web3auth.initModal();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
          await fetchUserDetails();
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, [provider]);

  const fetchUserDetails = async () => {
    try {
      const user = await web3auth.getUserInfo();
      setUserInfo(user);

      if (web3auth.provider) {
        const address = await RPC.getAccounts(web3auth.provider);
        setWalletAddress(address);
        console.log("address",address)

        const balance = await RPC.getBalance(web3auth.provider);
        setBalance(balance);
        const privateKey = await web3auth.provider.request({
          method: "eth_private_key",
        });
        console.log("private key",privateKey);
      }
      if (user.email && address) {
        await postUserAddress(user.email, address);
      }

    } catch (error) {
      console.error('Error fetching user details', error);
    }
  };
  
  const login = async () => {
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      
      if (web3auth.connected) {
        setLoggedIn(true);
        await fetchUserDetails();
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setUserInfo(null);
    setWalletAddress('');
    setBalance('');
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome to Web3Auth</h2>
          <button 
            onClick={login} 
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 flex items-center mx-auto"
          >
            <Power className="mr-2" /> Connect Wallet
          </button>
        </div>
      </div>
    );
  }
  const getAccounts = async () => {
    if (!web3auth.provider) {
      console.error("Provider not initialized yet");
      return;
    }
  
    try {
      const address = await RPC.getAccounts(provider);
      setWalletAddress(address);
    } catch (error) {
      console.error("Error getting accounts:", error);
    }
  };
  const getBalance = async () => {
    if (!provider) {
      console.error("Provider not initialized yet");
      return;
    }
  
    try {
      const balance = await RPC.getBalance(provider);
      setBalance(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };
  
  const signMessage = async () => {
    if (!provider) {
      console.error("Provider not initialized yet");
      return;
    }
  
    try {
      const { message, signature } = await RPC.signMessage(provider);
      console.log("Signed message:", message, signature);
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Web3 Profile</h1>
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300 flex items-center"
          >
            <LogOut className="mr-2" /> Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <UserCircle2 className="mr-2 text-blue-500" /> User Information
            </h2>
            {userInfo && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {userInfo.name}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
              </div>
            )}
          </div>

          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Wallet className="mr-2 text-green-500" /> Wallet Details
            </h2>
            <div className="space-y-2">
            <p><strong>Address:</strong> {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'N/A'}</p>
            <p><strong>Balance:</strong> {balance ? `${balance} ETH` : 'Loading...'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <button 
            onClick={getAccounts} 
            className="bg-blue-100 text-blue-600 p-4 rounded-lg hover:bg-blue-200 flex items-center justify-center"
          >
            <Wallet className="mr-2" /> Get Accounts
          </button>
          <button 
            onClick={getBalance} 
            className="bg-green-100 text-green-600 p-4 rounded-lg hover:bg-green-200 flex items-center justify-center"
          >
            <CreditCard className="mr-2" /> Get Balance
          </button>
          <button 
            onClick={signMessage} 
            className="bg-purple-100 text-purple-600 p-4 rounded-lg hover:bg-purple-200 flex items-center justify-center"
          >
            <MessageCircle className="mr-2" /> Sign Message
          </button>
        </div>
      </div>
    </div>
  );
}