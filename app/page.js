"use client"
import { useAppKitAccount } from "@reown/appkit/react";
import { useWalletInfo } from '@reown/appkit/react'
import { web3auth } from "./config/web3auth";

export default function ConnectButton() {
  const { address, isConnected, caipAddress, status} = useAppKitAccount()
  console.log(address, caipAddress);
  const login = async () => {
    // IMP START - Login
    await web3auth.connect();
    // IMP END - Login
    if (web3auth.connected) {
      console.log("Connected")
    }
  };
  return(
    <div>
      <button onClick={login}>Click here </button>
    </div>
  )
}