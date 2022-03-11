import './App.css';
import { useState } from 'react';

const getAccountMM = async (updateMM) => {
  if ("ethereum" in window) {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];
    updateMM(account);
  }
}

const getAccountPhantom = async (updatePhantom) => {
  if ("solana" in window) {
   const provider = window.solana;
   let resp = await window.solana.connect();
   if (provider.isPhantom) {
      updatePhantom(resp.publicKey.toString());
      return; 
    }
  }
  window.open("https://phantom.app/", "_blank");
}

const signSolana = async (message, setSignature) => {
  if (!window.solana.publicKey) {
    throw new Error("Must Connect to PhantomWallet")
  }
  let provider = window.solana;
  console.log(message)
  try {
    const data = new TextEncoder().encode(message);
    const res = await provider.signMessage(data);
    setSignature("Signed Phantom Wallet Message " + JSON.stringify(res));
  } catch (err) {
    console.error(err);
    alert("[error] signMessage: " + JSON.stringify(err));
  }
}

const signMM = async (message, setSignature) => {
  if (!window.ethereum.selectedAddress) {
    throw new Error("Must Connect to PhantomWallet")
  }
  try {
    const from = window.ethereum.selectedAddress;
    console.log(from)
    const msg = message;
    const sign = await window.ethereum.request({
      method: 'personal_sign',
      params: [msg, from, 'Example password'],
    });
    setSignature("Signed MetaMask Message: " + sign);
  } catch (err) {
    console.error(err);
    alert("[error] signMessage: " + JSON.stringify(err));
  }
}





function App() {

  let [mm, updateMM] = useState(window.ethereum.selectedAddress);
  let [phantom, updatePhantom] = useState();

  let [mmSig, updateMMSig] = useState();
  let [phantomSig, updatePhantomSig] = useState();


  return (
    <div className="App">
      <h2>Wallet Signing Demo</h2>
      <button onClick={() => getAccountMM(updateMM)}>Connect MetaMask</button>
      <button onClick={() => getAccountPhantom(updatePhantom)}>Connect Phantom</button>
      <div>Your account MetaMask: {mm}</div>
      <div>Your account Phantom: {phantom}</div>

      <button onClick={() => {signMM("Eluvio link account - " + Date.now(), updateMMSig)}}> Sign With MetaMask</button>
      <button onClick={() => {signSolana("Eluvio link account - " + Date.now(), updatePhantomSig)}}> Sign With Phantom Wallet </button>
      
      <div>{mmSig}</div>
      <div>{phantomSig}</div>
    </div>
  );
}

export default App;
