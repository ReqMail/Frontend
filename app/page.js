"use client"
import { useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { AuthAdapter, WEB3AUTH_NETWORK } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import axios from 'axios';
import RPC from './utils/rpc';
import Image from 'next/image';
import { 
  Mail, 
  ArrowRight, 
  Globe, 
  Shield, 
  Layers, 
  Zap, 
  CheckCircle, 
  Code, 
  Users, 
  Briefcase,
  LogOut,
  Wallet,
  BarChart,
  CreditCard,
  FileText, 
  Power,
  Check,
} from 'lucide-react';
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
const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white/10 border border-white/10 rounded-xl p-6 transform transition-all duration-300 hover:scale-105 hover:border-blue-300/50 hover:shadow-xl">
    <div className="mb-4 bg-blue-500/20 p-3 rounded-full w-fit">
      <Icon className="text-blue-400" size={28} />
    </div>
    <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

const IntegrationLogo = ({ src, alt }) => (
  <div className="bg-white/10 p-4 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
    <img src={src} alt={alt} className="h-12 w-auto grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all" />
  </div>
);

export default function InMailTreasuryHomepage() {
  const [activeTab, setActiveTab] = useState('features');
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

        const balance = await RPC.getBalance(web3auth.provider);
        setBalance(balance);
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
  const features = [
    {
      icon: Mail,
      title: "Email-Driven Treasury",
      description: "Manage crypto finances through simple email commands, no blockchain expertise required."
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Enterprise-grade security with multi-signature and compliance controls."
    },
    {
      icon: Globe,
      title: "Multi-Currency Support",
      description: "Seamlessly handle transactions across multiple cryptocurrencies."
    }
  ];
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-400" size={28} />
              <span className="text-xl font-bold text-white">InMail Treasury</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <button className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center" onClick={login} >
                Get Started <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-24 relative">
          <div className="grid gap-12 items-center">
            <div className='flex w-full'>
            <div className="space-y-6 pt-[2rem] pb-[2rem] w-[60%]">
              <div className="bg-blue-500/20 px-4 py-2 rounded-full w-fit">
                <span className="text-blue-400 text-sm">Revolutionizing Crypto Treasury</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight text-white">
                Simplify Crypto Management with Email
              </h1>
              <p className="text-gray-300 text-lg">
                Transform your organization's crypto treasury management with intuitive, email-driven financial workflows powered by Request Network.
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition-colors flex items-center" onClick={login} >
                  Connect Wallet <ArrowRight className="ml-2" size={20} />
                </button>
                <button className="border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-2 bg-blue-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/5 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
                <div className="grid grid-cols-3 gap-4">
                  {features.map((feature, index) => (
                    <FeatureCard key={index} {...feature} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Integration Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">Seamless Integrations</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Connect with your favorite tools and platforms to streamline your crypto treasury management.
            </p>
          </div>
          <div className="grid grid-cols-6 gap-6">
            {['ethereum', 'request', 'google', 'metamask', 'chainlink', 'stripe'].map((logo) => (
              <IntegrationLogo 
                key={logo} 
                src={`/logos/${logo}-logo.png`} 
                alt={`${logo} logo`} 
              />
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-4">Designed for Every Organization</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              From startups to enterprises, InMail Treasury provides flexible crypto financial management.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: "Corporate Treasury", description: "Manage multinational crypto holdings with ease." },
              { icon: Code, title: "Crypto Projects", description: "Streamline financial operations for blockchain startups." },
              { icon: Users, title: "DAOs", description: "Simplify decentralized organization financial workflows." }
            ].map((useCase, index) => (
              <div 
                key={index} 
                className="bg-white/10 border border-white/10 rounded-xl p-6 hover:border-blue-300/50 hover:bg-white/20 transition-all"
              >
                <div className="mb-4 bg-blue-500/20 p-3 rounded-full w-fit">
                  <useCase.icon className="text-blue-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{useCase.title}</h3>
                <p className="text-gray-300 text-sm">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Revolutionize Your Crypto Treasury?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join InMail Treasury and transform how your organization manages crypto finances.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-full hover:bg-blue-50 transition-colors flex items-center">
                Get Started <CheckCircle className="ml-2" size={20} />
              </button>
              <button className="border border-white text-white px-10 py-4 rounded-full hover:bg-white/10 transition-colors">
                Book a Demo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-white/10">
          <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="text-blue-400" size={28} />
                  <span className="text-xl font-bold text-white">InMail Treasury</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Simplifying crypto treasury management through email-driven workflows.
                </p>
              </div>
              {['Product', 'Company', 'Resources'].map((section) => (
                <div key={section}>
                  <h4 className="text-white font-semibold mb-4">{section}</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Link 1</a></li>
                    <li><a href="#" className="hover:text-white">Link 2</a></li>
                    <li><a href="#" className="hover:text-white">Link 3</a></li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Navigation - identical to landing page */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-3">
            <Mail className="text-blue-400" size={28} />
            <span className="text-xl font-bold text-white">InMail Treasury</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <button 
              className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center" 
              onClick={logout}
            >
              Logout <LogOut className="ml-2" size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Profile Card - with dark theme styling */}
          <div className="bg-white/10 border border-white/20 rounded-xl shadow-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-100 flex items-center">
              <Wallet className="mr-2 text-blue-400" /> Wallet Profile
            </h2>
            {userInfo && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={userInfo.profileImage || '/default-avatar.png'} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-2 border-blue-500/30"
                  />
                  <div>
                    <p className="font-medium text-gray-100">{userInfo.name}</p>
                    <p className="text-sm text-gray-400">{userInfo.email}</p>
                  </div>
                </div>
                
                <div className="bg-blue-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Wallet Address</p>
                  <p className="font-mono text-sm text-blue-200">
                    {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'N/A'}
                  </p>
                </div>
                
                <div className="bg-green-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 mb-2">Current Balance</p>
                  <p className="font-semibold text-green-200">
                    {balance ? `${balance} ETH` : 'Loading...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions - with dark theme styling */}
          <div className="bg-white/10 border border-white/20 rounded-xl shadow-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                className="w-full bg-blue-600 text-blue-300 py-3 rounded-lg hover:bg-blue-500/30 flex items-center justify-center"
              >
                <BarChart className="mr-2" /> Treasury Overview
              </button>
              <button 
                className="w-full bg-green-600 text-green-300 py-3 rounded-lg hover:bg-green-500/30 flex items-center justify-center"
              >
                <FileText className="mr-2" /> Payment Requests
              </button>
              <button 
                className="w-full bg-purple-600 text-purple-300 py-3 rounded-lg hover:bg-purple-500/30 flex items-center justify-center"
              >
                <Mail className="mr-2" /> Send Email Command
              </button>
            </div>
          </div>

          {/* Recent Activity - with dark theme styling */}
          <div className="bg-white/10 border border-white/20 rounded-xl shadow-xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Activity</h2>
            <div className="space-y-4">
              <div className="bg-gray-500/10 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-200">Wallet Connected</p>
                <p className="text-xs text-gray-400">Just now</p>
              </div>
              <div className="bg-gray-500/10 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-200">Initial Balance Synced</p>
                <p className="text-xs text-gray-400">A moment ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}