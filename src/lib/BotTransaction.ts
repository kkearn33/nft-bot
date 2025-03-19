
import { ethers, Interface } from 'ethers';
import { Wallet } from "ethers";
import { BotWalletDetailType , BotWalletType } from "@/lib/thirdweb/types";
import { client } from "@/lib/thirdweb";
import { Account , getWalletBalance , privateKeyToAccount } from "thirdweb/wallets";
import { soneium , soneiumMinato } from "@/lib/thirdweb/chains";
import { mintTo as mintTo721, nextTokenIdToMint, isApprovedForAll as isApprovedForAll721, setApprovalForAll as setApprovalForAll721 } from "thirdweb/extensions/erc721";
import {
  estimateGas ,
  eth_getTransactionCount ,
  fromGwei , getContract ,
  getRpcClient , NATIVE_TOKEN_ADDRESS ,
  prepareTransaction , sendAndConfirmTransaction ,
  sendTransaction , toTokens ,
  toWei , waitForReceipt
} from "thirdweb";
import axios from "axios";
import { buyFromListing, totalListings, createListing, getAllListings } from "thirdweb/extensions/marketplace";
import { UserNFT } from "@/types/asset";
import { toast } from "sonner";
import { allowance, approve, decimals } from "thirdweb/extensions/erc20";
import { getGasPrice } from "thirdweb"; // Import the function to get gas price
import { transfer } from "thirdweb/extensions/erc20";
import { formatUnits } from "viem";
import { it } from 'node:test';

async function getGasFeeFromApi() {
  try {
    const response = await axios.get('https://soneium.blockscout.com/api/v2/stats');
    console.log('response from blockchain', JSON.stringify(response.data.gas_prices));
    return fromGwei(response.data?.gas_prices?.fast.toString());
  } catch (err) {
    console.log('getting gas fee from minato chain explorer', err);
    return fromGwei("0.08");
  }
}

function getRandomValueToRent(min: number, max: number) {
  // Generate a random value between min and max, rounded to 5 decimal places
  return (Math.random() * (max - min) + min).toFixed(6);
}

const rent_ETH = async (fromAcc:Account, toAcc: Account, amount: bigint, sethistory: (str:string) => void) => {
  const balance = await getWalletBalance( {
    address : fromAcc.address ,
    client ,
    chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium
  });

  sethistory(`Sending ETH start: ${fromAcc.address} - > ${toAcc.address} : ${amount}`);
  try {
    // const rpcRequest = getRpcClient({
    //   client,
    //   chain: process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato : soneium,
    // });

    // const transactionCount = await eth_getTransactionCount(rpcRequest, {
    //   address: fromAcc.address,
    // });

    const gasFee = await getGasFeeFromApi();

    console.log("gasFee:", gasFee);

    const transaction = prepareTransaction({
      to: toAcc.address,
      chain: process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato : soneium,
      client: client,
      value: amount,
      // nonce: transactionCount + 1,
      // maxFeePerGas: gasFee,
      // maxPriorityFeePerGas: gasFee,
    });

    console.log("transaction:", transaction);
    const receipt = await sendTransaction({
      account: fromAcc,
      transaction,
    });

    console.log("ETH send successful:",`${fromAcc.address} -> ${toAcc.address} : ${amount}` ,receipt.transactionHash);
    sethistory(`Sending ETH Success: ${fromAcc.address} - > ${toAcc.address} : ${amount} : ${receipt.transactionHash}`);
    return true;
  } catch (error) {
    console.log("ETH send failed:", error);
    sethistory(`Sending ETH fail: ${fromAcc.address} - > ${toAcc.address} : ${amount} : ${error}`); 
    return false;
  }
}


// async function rent_ETH(fromAcc : Account, toAcc : Account, amount: string){

//   console.log(fromAcc.address, toAcc.address, amount);
//   try {
//     const gasFee = await getGasFeeFromApi();
//     const contract = getContract({
//       client,
//       chain: soneiumMinato,
//       address: soneiumMinato.nativeCurrency.address,
//     });

//     const transaction = await  transfer({
//       contract,
//       to: toAcc.address,
//       amount: amount,
//     });

//     const receipt = await sendTransaction({
//       transaction,
//       account: fromAcc, // Ensure the account is set correctly
//     });

//     console.log("Transaction successful:", receipt);
//     return receipt;
//   } catch (error) {
//     console.error("Error sending tokens:", error);
//     throw new Error("Failed to send tokens");
//   }
// }

async function rent_ASTR(fromAcc : Account, toAcc : Account, amount: bigint, sethistory: (str:string) => void){
  sethistory(`Sending ASTR start: ${fromAcc.address} - > ${toAcc.address} : ${amount}`);
  try {
    const gasFee = await getGasFeeFromApi();
    const contract = getContract({
      client,
      chain: soneium,
      address: soneium.supportedCurrencies[0].address,
    });

    const transaction = await transfer({
      contract,
      to: toAcc.address,
      amount: formatUnits(amount, 18),
    });

    const receipt = await sendTransaction({
      transaction,
      account: fromAcc, // Ensure the account is set correctly
    });

    console.log("ASTR send successful:",`${fromAcc.address} -> ${toAcc.address} : ${amount}` ,receipt.transactionHash);
    sethistory(`Sending ASTR Success: ${fromAcc.address} - > ${toAcc.address} : ${amount}: ${receipt.transactionHash}`);
    return true;
  } catch (error) {
    console.log("Error sending tokens:", error);
    sethistory(`Sending ASTR Fail: ${fromAcc.address} - > ${toAcc.address} : ${amount} : ${error}`);
    return false;
  }
}


const buyNFT = async (account:Account, item: UserNFT, res: any, sethistory: (str:string) => void) => {

  console.log("buyNFT starting...", account, item, res);
  sethistory(`buying NFT start: ${account.address} : ${res.listId} : ${res.pricePerToken}`);
  if(!soneium.marketplace || !soneiumMinato.marketplace) return ;
  try {
    const balance = await getWalletBalance({
      address: account.address,
      client,
      chain: process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium,
      tokenAddress: res.currencyContractAddress
    });

    console.log("balance:", balance.value, res.pricePerToken);
    if (BigInt(balance.value) < res.pricePerToken) {
      toast.error("You don't have enough funds for this purchase.");
      return;
    }

    // if(soneium.marketplace === undefined || soneiumMinato.marketplace === undefined) return ;
    if (res.currencyContractAddress.toLowerCase() !== NATIVE_TOKEN_ADDRESS.toLowerCase()) {
      const customTokenContract = getContract( {
        address : res.currencyContractAddress ,
        client ,
        chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium ,
      } );

      console.log( "customToken contract:" , customTokenContract );

      const result = await allowance( {
        contract : customTokenContract ,
        owner : account.address ,
        spender : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato.marketplace : soneium.marketplace ,
      } );

      console.log( "result:" , result );

      if (result < res.pricePerToken ) {
        const transaction = approve( {
          contract : customTokenContract ,
          spender : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato.marketplace : soneium.marketplace ,
          amount: res.pricePerToken.toString(),
        } );

        console.log( "transaction amount:" ,res.pricePerToken);
        await sendAndConfirmTransaction( {transaction , account} );
      }
    }


    const MARKETPLACE_CONTRACT = getContract({
      address: process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato.marketplace : soneium.marketplace,
      client,
      chain: process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato : soneium,
    });

    console.log("Marketplace:", MARKETPLACE_CONTRACT);

    const transaction = buyFromListing({
      contract: MARKETPLACE_CONTRACT,
      listingId: BigInt(res.listId),
      quantity: 1n,
      recipient: account.address,
    });

    console.log("transaction:", transaction);

    // const gas = await estimateGas({
    //   transaction,
    //   from: account.address,
    // });

    // console.log("gas:", gas);


    const receipt = await sendTransaction({
      transaction,
      account,
    });

    console.log("buy success",`${account.address}`, res.listId, res.pricePerToken, receipt.transactionHash);
    sethistory(`buying NFT Success: ${account.address} : ${res.listId} : ${res.pricePerToken} : ${receipt.transactionHash}`);
    return true;
  } catch (err) {
    console.log("buy failed", err);
    sethistory(`buying NFT Fail: ${account.address} : ${res.listId} : ${res.pricePerToken} : ${err}`);
    return false;
  }

};

const listNFT = async (account:Account, item: UserNFT, listValue: bigint,  sethistory: (str:string) => void) => {

    console.log("input data",account, item);
    sethistory(`listing NFT start: ${account.address} : ${item.token.address} ${item.id} : ${listValue}`);
    if(!soneium.marketplace || !soneiumMinato.marketplace) return ;
    try {
      const MARKETPLACE_CONTRACT = getContract( {
        address : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato.marketplace : soneium.marketplace ,
        client ,
        chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato: soneium ,
      } );

      console.log("marketcontract",process.env.NEXT_PUBLIC_CURRENT_NETWORK, MARKETPLACE_CONTRACT);

      const nftContract = getContract( {
        address : item.token.address,
        chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium ,
        client ,
      } );

      // Check for approval

      const isApproved = await isApprovedForAll721( {
        contract : nftContract ,
        owner : account.address ,
        operator : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato.marketplace : soneium.marketplace,
      });

      if (!isApproved) {
        const approveTx = setApprovalForAll721( {
          contract : nftContract ,
          operator : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? soneiumMinato.marketplace : soneium.marketplace,
          approved : true ,
        } );

        await sendAndConfirmTransaction( {
          transaction : approveTx ,
          account ,
        } );
      }

      // const rndGasFee = getRandomValueForGas(12, 13.2);
      const gasFee = await getGasFeeFromApi();

      const transaction = createListing( {
        contract : MARKETPLACE_CONTRACT ,
        assetContractAddress : item.token.address ,
        tokenId : BigInt( item.id ) ,
        quantity : 1n,
        currencyContractAddress : soneium.supportedCurrencies[0].address ,
        pricePerToken : formatUnits(listValue, 18),
        // gas: 21000,
        // gasPrice: fromGwei("1"),
        // maxFeePerGas: gasFee,
        // maxPriorityFeePerGas: gasFee,
      } );

      const receipt = await sendTransaction( {transaction , account} );

      await waitForReceipt({
        transactionHash: receipt.transactionHash,
        client,
        chain: process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato: soneium,
        // maxBlocksWaitTime: 360,
      });

      const cntTotalListings = await totalListings({ contract: MARKETPLACE_CONTRACT });

      const lastListings = await getAllListings({
        contract: MARKETPLACE_CONTRACT,
        start: cntTotalListings > 35n ? Number(cntTotalListings - 35n) : 0,
        count: 35n,
      });

      const lastListingNFT = lastListings.slice().reverse().find((ll) => 
        ll.assetContractAddress === item.token.address && 
        ll.tokenId.toString() === item.id.toString() && 
        ll.status === "ACTIVE"
      );

      if (!lastListingNFT) {
        console.log('[ERROR ON FINDING THE LAST LISTED YOUR NFT]', account.address, item.token.address, "#", item.id);
        return null;
      }

      sethistory(`listing NFT Success: ${account.address} : ${lastListingNFT.id} : ${lastListingNFT.creatorAddress} : ${lastListingNFT.currencyContractAddress} : ${receipt.transactionHash}`);  
      return { listId: lastListingNFT.id, pricePerToken : listValue, currencyContractAddress: lastListingNFT.currencyContractAddress};
    }catch (error) {
      console.log("List failed:", error);
      sethistory(`listing NFT Fail: ${account.address} : ${item.token.address} ${item.id} : ${listValue} : ${error}`);
      return null;
    }
};

export {rent_ETH, buyNFT, listNFT, rent_ASTR};