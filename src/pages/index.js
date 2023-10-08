import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {ethers} from 'ethers'
import { useEffect, useState } from "react";

import nftAbi from "../abi.json"
import pets from "../pets.json"

const contractAddress = "0x16A9b6E13A2C6D9CCf96cF0180D74A1F362762Af" //sepolia
// const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3" //localhost

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);
  const [signerAddress, setSignerAddress] = useState(undefined);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
    for (let i = 0; i < pets.length; i++) {
      check(i);
    }
  });

  async function connect() {
    if (window.ethereum) {

      try {
        window.ethereum.request({ method: "eth_requestAccounts" })
          .then(handleAccountsChanged)
          .catch( (err) => {console.error(err);
        })

        await window.ethereum.on('accountsChanged', handleAccountsChanged)
        async function handleAccountsChanged(accounts){
          if (accounts.length === 0){
            console.log("Please Connect Metamask");
            return;
          }
          else if (accounts[0] != signerAddress){
            const provider = new ethers.BrowserProvider(window.ethereum);
            let signer = await provider.getSigner()
            setSigner(signer);
            setSignerAddress(await signer.getAddress())
            setIsConnected(true)
            return ;
          }
        }        
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  async function check(id) {
    if (isConnected) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const adoption = new ethers.Contract(contractAddress, nftAbi, provider);
      let adopters = await adoption.getAdopters();
      if (adopters[id] != ethers.ZeroAddress){
        document.getElementById(id).innerHTML = "Adopted";
        document.getElementById(id).disabled = true;
        return;
      }
      document.getElementById(id).disabled = false; 
      return;
    }
    else {
      document.getElementById(id).disabled = true;
      return;
    }
  }

  async function getAdopter(){
    if (isConnected) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const adoption = new ethers.Contract(contractAddress, nftAbi, provider);
      let adopters = await adoption.getAdopters();

      let petId = document.getElementById("checkAdopter").value;
      console.log("petId : ",petId);
    if (petId !="" && petId >= 0 && petId <= 15){
        document.getElementById("adopterAddress").innerHTML = adopters[petId];
      }
      else{
        console.log("Please Enter Pet Id");
        document.getElementById("adopterAddress").innerHTML = "Please Enter a valid Pet Id";
      }
    }
    else {
      console.log("Please Connect your Metamask Wallet");
      document.getElementById("adopterAddress").innerHTML = "Please Connect your Metamask Wallet";
    }
  }

  async function adopt(id) {
    if (isConnected) {
      const adoption = new ethers.Contract(contractAddress, nftAbi, signer);
      console.log("Adoption Contract : ",await adoption.getAddress());

      try {
        console.log(`Callling adopt(${id})`);
        let tx = await adoption.connect(signer).adopt(id);
        document.getElementById(id).innerHTML = "... Adopting ...";
        const receipt = await tx.wait();
        console.log("receipt : ",receipt);
        document.getElementById(id).innerHTML = "Success!";
        document.getElementById(id).disabled = true;
      } catch (error) {
        console.log(error);
        document.getElementById(id).innerHTML = "Adopt";
      }
    } 
    else {
      console.log("Please Connect your Metamask Wallet");
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Pet Adoption</title>
        <meta name="description" content="Demo Dapp for pet Adoption" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        <div className={styles.connect}>
          {hasMetamask ? 
            ( isConnected ? 
              (<strong >Connected Wallet : {signerAddress}</strong>)
                : 
              (<button  onClick={() => connect()}> Connect Wallet </button>)
            ) : 
            ("Please install Metamask")
          }
        </div>
        <br/><br/>
        
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-sm-8 col-sm-push-2">
              <h1 className="text-center">Demo Pet Shop</h1>
              <hr/>
              <br/>
            </div>
          </div>

          <div id="petsRow" className="row">
            {/* <!-- PETS LOAD HERE --> */}       
            { pets.map((pet) => (
            <div key={pet.name}>
              <div className="col-sm-6 col-md-4 col-lg-3">
                <div className="panel panel-default panel-pet">
                  
                    <div className="panel-heading">
                      <h3 className="panel-title">{pet.name}</h3>
                    </div>
                    <div className="panel-body" style={{color:"black"}}>
                      <img alt="140x140" className="img-rounded img-center" style={{width: "100%"}} src={pet.picture} data-holder-rendered="true"/>
                      <br/><br/>
                      <strong>Id</strong>: <span className="pet-id">{pet.id}</span><br/>
                      <strong>Breed</strong>: <span className="pet-breed">{pet.breed}</span><br/>
                      <strong>Age</strong>: <span className="pet-age">{pet.age}</span><br/>
                      <strong>Location</strong>: <span className="pet-location">{pet.location}</span><br/><br/>
                      <button className="btn btn-default btn-adopt" id={pet.id} onClick={() => adopt(pet.id)}>Adopt</button>
                    </div>               
                </div>
                
              </div>
            </div>
            ))
          }
          </div>
        <hr/>
        </div>

        
        <div>
          <h1 >Get Adopter</h1>
          <hr/>
        </div>
        <div className={styles.adopter} >
          <span className="panel-title">Pet Id : </span>
          <input type="number" min="0" max="15" id="checkAdopter" placeholder=" (0-15)" />
          <button  onClick={() => getAdopter()}> getAdopter </button>
        </div>
        <div className={styles.adopterAddress}>
          <span id="adopterAddress" ></span>
        </div>

      </main>

        

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
