"use client"
import Header from "@/app/_Component/header";
import WalletTable from "@/app/wallettable";
import FilterBar from "@/app/_Component/filterbar";
import NFTShow from "@/app/_Component/nftshow";
import { Toaster } from "sonner"
import { ClipboardProvider } from "@/app/_Component/ClipboradProvider";
import { useWallets } from "@/hook/useWallets";
import { ThirdwebProvider } from "thirdweb/react";
import { Textarea } from "@/components/ui/textarea"

export default function Home() {

  const { 
    showWallets, 
    count, setCount, 
    botWallets, setbotWallets, 
    setsearch, 
    selAddress,setselAddress, 
    isloading, 
    rentButton, 
    update, 
    isStart, setstart,
    tranCount,
    history,
  } = useWallets();
  return (
    <div className="h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      <ClipboardProvider>
        <Header title={"Bot Wallets"} className={"text-3xl"} 
          rentButton={rentButton} 
          update={update}  
          isStart={isStart} 
          setstart={setstart} 
          tranCount={tranCount}
        />
        <main className="p-2 flex flex-col flex-grow overflow-auto">
          <ThirdwebProvider>
            <FilterBar count={count} setCount={setCount} setbotWallets={setbotWallets} botWallets={botWallets} setsearch={setsearch} />
            <div className="flex flex-row flex-grow overflow-y-auto">
              { !isloading ? <WalletTable showWallets={ showWallets } setselAddress={setselAddress}/>
                : <h1 className="text-center w-6/7"> loading...</h1>
              }
              <NFTShow walletAddress={selAddress}/>
            </div>
            <Textarea className="!h-37 border border-black !text-lg bg-gray-400" id="message-2" 
              readOnly
              value={history}
              />
          </ThirdwebProvider>
        </main>
      </ClipboardProvider>
      <Toaster />
    </div>
  );
}
