
import { useEffect , useState } from "react";
import { BotWalletDetailType , BotWalletType } from "@/lib/thirdweb/types";
import { SettingType } from "@/types/settingType";
import botWallets from "@/lib/BotWallets";
import { getWalletBalance , privateKeyToAccount } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb";
import { soneium , soneiumMinato } from "@/lib/thirdweb/chains";
import { fetchOwnedNfts } from "@/lib/blockscout_api/fetch";
import { buyNFT , listNFT , rent_ETH, rent_ASTR } from "@/lib/BotTransaction";
import { UserNFT } from "@/types/asset";
import { toWei } from "thirdweb";
import { toAccount } from "viem/accounts";
import { TowerControl } from "lucide-react";

export function useWallets(){
  const [botWallets, setbotWallets] = useState<BotWalletType[]>([]);
  const [showWallets, setShowWallets] = useState<BotWalletDetailType[]>([]);
  const [mainWallets, setmainWallets] = useState<BotWalletDetailType[]>([]);

  const [count, setCount] = useState(1);
  const [search, setsearch] = useState<string>("");
  const [selAddress, setselAddress] = useState<string>("");
  const [isloading, setloading] = useState<boolean>(true);
  const [update, setupdate] = useState<boolean>(false);
  const [isStart, setstart] = useState<boolean>(false);
  const [history, sethistory] = useState<string>("");
  const [tranCount, setTranCount] = useState(0);



  const historyEdit = (str: string) => {
    sethistory((prevHistory) => {
      const buf =  "\n" + str + "\n" + prevHistory +"\n";
      return buf;
    });
  }

  const rentButton = async () =>{

    // const privateKey = process.env.NEXT_PUBLIC_MEGACREEP_PRIVATE_KEY as string;
    // if(!privateKey) return;

    // const fromAcc = privateKeyToAccount({
    //   client,
    //   privateKey: showWallets[9].privateKey, // Example: use the first wallet's private key
    // });

    // const toAcc = privateKeyToAccount({
    //   client,
    //   privateKey: showWallets[0].privateKey, // Example: use the second wallet's private key
    // });

    // const listResult = await rent_ETH(fromAcc, toAcc, toWei("0.0002"), sethistory);

 //   await buyNFT(toAcc, showWallets[1].nfts[0], listResult, sethistory);

  }

  const getSetting = async ()=> {
    await fetch("/api/readSetting")
      .then((res) => res.json())
      .then((json) => setCount(json.count))
      .catch((err) => console.log("Error fetching data:",err));
  };

  const getWallets =  async () => {
    await fetch("/api/readWallets")
      .then((res) => res.json())
      .then((json) => setbotWallets(json))
      .catch((err) => console.log("Error fetching data:",err));
  };

  const init = async () => {
    setloading(true);
    await getSetting();
    await getWallets();
  }

  const getMainWallet = async () => {
    setloading(true);
    const wallets = botWallets.slice(0, count);
    const mainWalletsbuf = await Promise.all(
      wallets.map(async (wallet: BotWalletType) => {
        const botAccount = privateKeyToAccount({
          client,
          privateKey: wallet.privateKey,
        });

        // Ensure getWalletBalance takes (address, client, chain)
        const balance = await getWalletBalance( {
          address : botAccount.address ,
          client ,
          chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium
        });

        const balance1 = await getWalletBalance( {
          address : botAccount.address ,
          client ,
          chain : soneium,
          tokenAddress: soneium.supportedCurrencies[0].address
        });

        const nfts = await fetchOwnedNfts( botAccount.address );

        return {
          privateKey: wallet.privateKey,
          address: botAccount.address,
          amount_ETH: balance.value, // Ensure `balance.value` exists
          amount_ASTR: balance1.value, // Ensure `balance1.value` exists
          account: botAccount,
          nfts: nfts, // If this is dynamic, fetch the correct count
        };
      })
    );

    setmainWallets(mainWalletsbuf);
    setloading(false);
  }


  const getTableData = async () => {
    setloading(true);
    let wallets : BotWalletDetailType[] = [];
    if (search !== "") {
        wallets = mainWallets.filter(
          (wallet) => wallet.privateKey === search || wallet.address === search
        );
    } else {
      wallets = mainWallets;
     }

    setShowWallets(wallets);
    setloading(false);
  };

  useEffect( () => {
    init();
  } , [update]);

  useEffect( () => {
    getMainWallet();
  } , [count, botWallets]);

  useEffect(()=>{
    getTableData();
  },[search, mainWallets]);

  const getMainChangedWallets = async () => {
    const wallets = botWallets.slice(0, count);
    const mainWalletsbuf = await Promise.all(
      wallets.map(async (wallet: BotWalletType) => {
        const botAccount = privateKeyToAccount({
          client,
          privateKey: wallet.privateKey,
        });

        // Ensure getWalletBalance takes (address, client, chain)
        const balance = await getWalletBalance( {
          address : botAccount.address ,
          client ,
          chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium
        });

        const balance1 = await getWalletBalance( {
          address : botAccount.address ,
          client ,
          chain : soneium,
          tokenAddress: soneium.supportedCurrencies[0].address
        });

        const nfts = await fetchOwnedNfts( botAccount.address );

        return {
          privateKey: wallet.privateKey,
          address: botAccount.address,
          amount_ETH: balance.value, // Ensure `balance.value` exists
          amount_ASTR: balance1.value, // Ensure `balance1.value` exists
          account: botAccount,
          nfts: nfts, // If this is dynamic, fetch the correct count
        };
      })
    );

    return mainWalletsbuf;
  }

  async function run() {

    historyEdit("Start process....");
    const privateKey = process.env.NEXT_PUBLIC_MEGACREEP_PRIVATE_KEY as string;
    if(!privateKey) return;

    const mainAccount = privateKeyToAccount({
      client,
      privateKey: privateKey, // Example: use the first wallet's private key
    });

    const changedWallets = await getMainChangedWallets();
    const listwallets = changedWallets.filter(wallet => wallet.nfts.length > 0);

    const transactionArray = listwallets.flatMap((wallet: BotWalletDetailType, index: number) =>
      wallet.nfts.map((nft: UserNFT) => {

        let buyIndex = Math.floor(Math.random() * count);
        while(changedWallets[buyIndex].address === wallet.address) buyIndex = Math.floor(Math.random() * count);
        historyEdit(`Buyer: ${changedWallets[buyIndex].address} Seller: ${wallet.address} NFT: ${nft.id}`);
        return {content: `${index}`, nft: nft, fromAcc: wallet.account, toAcc: changedWallets[buyIndex].account }; // Properly returning the object
      })
    );

    console.log("transactionArray", transactionArray);

    for (const item of transactionArray) {
      const changedWallets = await getMainChangedWallets();
      const astrWallet = changedWallets.find(wallet => wallet.amount_ASTR > 0);

      if(!astrWallet){
        console.log("No ASTR wallet");
        return;
      }
      
      let res = await rent_ASTR(astrWallet.account, item.toAcc, astrWallet.amount_ASTR, historyEdit);

      if(res)
      {
        const listResult = await listNFT(item.fromAcc, item.nft, astrWallet.amount_ASTR, historyEdit);
        if(listResult) 
        {
          const buyRes = await buyNFT(item.toAcc, item.nft, listResult, historyEdit);
          if(buyRes) setTranCount((prev)=> prev + 1);
        }
      }
  //    await getMainWallet();
    }
  }


  

  useEffect(() => {
    let isActive = true; // Flag to stop execution when isStart changes

    const runLoop = async () => {
      if (!isStart || !isActive) return; // Stop if isStart is false

      console.log("Starting...");
      try{
        await run(); // Wait for `run()` to finish
      }catch(error){
        console.log(error);
      }

      if (isActive) {
        setTimeout(runLoop, 1000); // Wait 10 sec before next execution
      }
    };

    if (isStart) {
      runLoop(); // Start the loop
    }

    return () => {
      isActive = false; // Stop execution when component unmounts or isStart changes
    };
  }, [isStart]);


  return {
    showWallets,
    count,
    setCount,
    botWallets,
    setbotWallets,
    setsearch,
    selAddress,
    setselAddress,
    isloading,
    rentButton,
    update,
    setupdate,
    isStart,
    setstart,
    tranCount,
    history,
  }
}