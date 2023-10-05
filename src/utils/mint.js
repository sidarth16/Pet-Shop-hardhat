import {ethers} from 'ethers'

export async function nftMint(EclecttNFT, to, uri, fee, user, txSpanId, OpenseaSpanId) {
  if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let minterAdmin = new ethers.Wallet('e3c9e84ae38d3947c308fb9b388e36c16b048217fb9ef5a3d0c4369657009707', provider);
       
      console.log("user : ", await user.getAddress());
      console.log("Minter : ", await minterAdmin.getAddress());
      try {
        
        // Setup sign message
        const minterAddress = await minterAdmin.getAddress()
        const hash = ethers.utils.solidityKeccak256([ "address","string", "uint256"], [to, uri, fee])
        const sig = await minterAdmin.signMessage(ethers.utils.arrayify(hash))
        console.log("Tx Initiated: ");

        // generate tx
        let tx = await EclecttNFT.connect(user).mintNFT(to, uri, fee, minterAddress, sig, {"value":fee});
        console.log(`Tx: https://mumbai.polygonscan.com/tx/${tx.hash}`);
        document.getElementById(txSpanId).innerHTML = `<a href='https://mumbai.polygonscan.com/tx/${tx.hash}'> Check Tx here (${tx.hash})</a>`
        const receipt = await tx.wait();

        // decode receipt and get minted tokenId
        const event = receipt.events.find(x => x.event === "Minted");
        const tokenId = event.args.TokenId.toNumber() ;
        console.log("Minted TokenId : ",tokenId);

        // update spans in html
        console.log("Tx Confirmed: Minted tokenId - ",tokenId);
        console.log(`Check Opensea : https://testnets.opensea.io/assets/mumbai/${EclecttNFT.address}/${tokenId}`);

        document.getElementById(OpenseaSpanId).innerHTML = `Tx Confirmed# Minted TokenId: ${tokenId} <br/> <a href='https://testnets.opensea.io/assets/mumbai/${EclecttNFT.address}/${tokenId}'> click here to view Nft on Opensea</a>`
       

      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }

export async function nftLazyMint(EclecttNFT, from, to, uri, fee, buyFee, user, txSpanId, OpenseaSpanId) {
  if (typeof window.ethereum !== "undefined") {
      
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    let minterAdmin = new ethers.Wallet('e3c9e84ae38d3947c308fb9b388e36c16b048217fb9ef5a3d0c4369657009707', provider);
    const minterAdminAddress = await minterAdmin.getAddress()

    console.log("User : ", await user.getAddress());
    console.log("Minter : ", await minterAdmin.getAddress());
    try {

      // Setup sign message
      const hash = ethers.utils.solidityKeccak256([ "address", "address", "string", "uint256", "uint256"], [from, to, uri, fee, buyFee])
      const sig = await minterAdmin.signMessage(ethers.utils.arrayify(hash))
      console.log("Tx Initiated: ");

      // generate tx
      let tx = await EclecttNFT.connect(user).lazyMintNFT(from, to, uri, fee, buyFee, minterAdminAddress, sig, {"value":fee+buyFee});
      console.log(`Tx: https://mumbai.polygonscan.com/tx/${tx.hash}`);
      document.getElementById(txSpanId).innerHTML = `<a href='https://mumbai.polygonscan.com/tx/${tx.hash}'> Check Tx here (${tx.hash})</a>`
      const receipt = await tx.wait();

      // decode receipt and get minted tokenId
      const event = receipt.events.find(x => x.event === "LazyMinted");
      const tokenId = event.args.TokenId.toNumber() ;
      console.log("Minted TokenId : ",tokenId);

      console.log("Tx Confirmed: Minted tokenId - ",tokenId);
      console.log(`Check Opensea : https://testnets.opensea.io/assets/mumbai/${EclecttNFT.address}/${tokenId}`);
      document.getElementById(OpenseaSpanId).innerHTML = `Tx Confirmed# Minted TokenId: ${tokenId} <br/> <a href='https://testnets.opensea.io/assets/mumbai/${EclecttNFT.address}/${tokenId}'> click here to view Nft on Opensea </a>`


    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please install MetaMask");
  }
}

export async function nftBatchMint(EclecttNFT, toAddresses, uris, fees, totalFee, user, txSpanId, tokenSpanId) {
  if (typeof window.ethereum !== "undefined") {
      
    console.log("User : ", await user.getAddress());
    try {

      console.log("Tx Initiated: ");

      // generate tx
      let tx = await EclecttNFT.connect(user).batchMintNFT(toAddresses, uris, fees, {"value":totalFee});
      console.log(`Tx: https://mumbai.polygonscan.com/tx/${tx.hash}`);
      document.getElementById(txSpanId).innerHTML = `<a href='https://mumbai.polygonscan.com/tx/${tx.hash}'> Check Tx here (${tx.hash})</a>`
      const receipt = await tx.wait();

      // decode receipt and get minted tokenId
      const events = receipt.events.filter(function(x) {return x.event === "Minted";});
      const tokenIds = events.map((event)=>  event.args.TokenId.toNumber() )
      document.getElementById(tokenSpanId).innerHTML = `Tx Confirmed# Minted TokenIds: ${tokenIds}`

    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please install MetaMask");
  }
}


export async function nftBatchLazyMint(EclecttNFT, fromAddresses, toAddresses, uris, fees, buyFees, totalFee, user, txSpanId, tokenSpanId) {
  if (typeof window.ethereum !== "undefined") {

    console.log("User : ", await user.getAddress());
   
    try {

      console.log("Tx Initiated: ");

       // generate tx
      let tx = await EclecttNFT.connect(user).batchLazyMintNFT(fromAddresses, toAddresses, uris, fees, buyFees, {"value":totalFee});
      console.log(`Tx: https://mumbai.polygonscan.com/tx/${tx.hash}`);
      document.getElementById(txSpanId).innerHTML = `<a href='https://mumbai.polygonscan.com/tx/${tx.hash}'> Check Tx here (${tx.hash})</a>`
      const receipt = await tx.wait();

      // decode receipt and get minted tokenId
      const events = receipt.events.filter(function(x) {return x.event === "LazyMinted";});
      const tokenIds = events.map((event)=>  event.args.TokenId.toNumber() )
      document.getElementById(tokenSpanId).innerHTML = `Tx Confirmed# Minted TokenIds: ${tokenIds}`


    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please install MetaMask");
  }
}
