
import { Wallet } from "ethers";
import { BotWalletType } from "@/lib/thirdweb/types";

const createBotWallets = async (cnt:number) => {

  const botWallets: BotWalletType[] = [];

  for( let i = 0; i < cnt; i++ ) {
    const wallet = Wallet.createRandom();
    botWallets.push({
      privateKey: wallet.privateKey,
      address: wallet.address,
    });
  }
  return botWallets;
}

export default createBotWallets;