"use client"
import Image from "next/image";
import { PropsWithChildren } from "@/types/next";
import { cn } from "@/lib/utils"
import { useEffect , useState } from "react";
import { getWalletBalance , privateKeyToAccount } from "thirdweb/wallets";
import { client } from "@/lib/thirdweb";
import { XAddress } from "@/app/_Component/xaddress";
import { soneium , soneiumMinato } from "@/lib/thirdweb/chains";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle"

type Props = {
  title: string;
  rentButton: ()=>void;
  update: boolean;
  isStart: boolean;
  setstart: (value: boolean)=>void;
  tranCount: number;
}


const Header = ({ title, rentButton, className, update, isStart, setstart, tranCount }: PropsWithChildren<Props>)=>{
  const [ address, setAddress ] = useState("");
  const [ amount, setAmount ] = useState(0n);
  const [ astrAmount, setAstrAmount ] = useState(0n);
  const decimals = 18;

  useEffect(()=>{
    const privateKey = process.env.NEXT_PUBLIC_MEGACREEP_PRIVATE_KEY as string;
    if(!privateKey) return;

    const creepAccount = privateKeyToAccount({
      client,
      privateKey: privateKey,
    });
    setAddress(creepAccount.address);

    ( async () => {
      const balance = await getWalletBalance( {
        address : creepAccount.address ,
        client ,
        chain : process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet"? soneiumMinato : soneium
      } );

      const astrbalance = await getWalletBalance( {
        address : creepAccount.address ,
        client ,
        chain : soneium,
        tokenAddress: soneium.supportedCurrencies[0].address
      } );

      setAmount(balance.value);
      setAstrAmount(astrbalance.value);
    })();
  },[update]);

  return(
    <div className="flex justify-between p-4 border-b items-center border-black">
      <div className="flex gap-2 items-center">
        <Image
          src="/globe.svg"
          alt="Globe icon"
          width={35}
          height={35}
        />
        <h1 className="text-3xl"> BOT MANAGE SYSTEM</h1>
      </div>
      <div>
        <div className="flex gap-2">
          <p className="w-22 text-right"> address :</p>
          <XAddress address={address}/>
        </div>
        {/* <div className="flex gap-2">
          <p className="w-22 text-right"> privatekey :</p>
          <XAddress address={ process.env.NEXT_PUBLIC_MEGACREEP_PRIVATE_KEY as string } />
        </div> */}
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <p> amount : </p>
          <p> {formatUnits(amount, decimals)} ETH</p>
          <Button onClick={()=>rentButton()} className="mx-3 h-7"> Rent </Button>
        </div>
        <div className="flex gap-2 items-center">
          <p> ASTR : </p>
          <p> {formatUnits(astrAmount, decimals)} ASTR</p> 
        </div>
      </div>
      <div>
        Buy Transaction Count : {tranCount}
      </div>
      <Toggle className="border border-black bg-white data-[state=on]:bg-black data-[state=on]:text-white px-10"
              pressed={isStart}
              onPressedChange={setstart} // Updates state on change
      >
        start
      </Toggle>
    </div>
  )
}
Header.displayName ="Header";
export default Header;