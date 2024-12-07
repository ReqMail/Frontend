import { Web3Auth } from "@web3auth/modal";
import { AuthAdapter, WEB3AUTH_NETWORK } from "@web3auth/auth-adapter";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { CHAIN_NAMESPACES } from "@web3auth/base";

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
    clientId: "BJe6CJUaVDi6GGlrgimVCx7LJAKte0HzaIy-9okXOEF7QCX6-Hydevtza6tDufFh1okpJISGBJwZ7Rt9KmvUj8M", // Get your Client ID from the Web3Auth Dashboard
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
  });

  const authAdapter = new AuthAdapter({
    adapterSettings: {
      loginConfig: {
        // Google login
        google: {
          verifier: "custom-reqmail-google", // Please create a verifier on the developer dashboard and pass the name here
          typeOfLogin: "google", // Pass on the login provider of the verifier you've created
          clientId: "327617573650-hduvdv79m92b8t695qvhkieffhekj3ub.apps.googleusercontent.com", // Pass on the clientId of the login provider here - Please note this differs from the Web3Auth ClientID. This is the JWT Client ID
        },
      },
    },
    privateKeyProvider,
  });
  web3auth.configureAdapter(authAdapter);
  await web3auth.initModal();