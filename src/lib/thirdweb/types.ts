import { RequireKeys } from "@/types/generic";
import { Chain } from "thirdweb/chains";
import { UserNFT } from "@/types/asset";
import { Account } from "thirdweb/wallets";

export type Currency = Required<RequireKeys<Chain, "nativeCurrency">["nativeCurrency"]> & {
  icon: string
  address: string
}

export type PosseChain = Omit<RequireKeys<Chain, "name" | "blockExplorers">, "nativeCurrency"> & Readonly<{
  marketplace?: string,
  nativeCurrency: Currency
  supportedCurrencies: Currency[]
}>

export type BotWalletType = {
  privateKey: string;
  address: string;
}


export type BotWalletDetailType = {
  privateKey: string;
  address: string;
  amount_ETH: bigint;
  amount_ASTR: bigint;
  account: Account;
  nfts: UserNFT[];
}