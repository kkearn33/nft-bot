import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SettingDialog from "@/app/dialog";
import { BotWalletType } from "@/lib/thirdweb/types";

type Props = {
  count: number;
  setCount: (count: number) => void;
  botWallets: BotWalletType[];
  setbotWallets: (wallets: BotWalletType[]) => void;
  setsearch: (search: string) => void;
}

const FilterBar = ({count, setCount, botWallets, setbotWallets, setsearch} :Props) => {
  return (
    <div className="flex gap-3 w-full">
      <div className="relative flex h-full w-full gap-2">
        <Search className="absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 text-gray-600" />
        <Input
          type="text"
          className="border h-full pl-9 rounded-[8px] border-gray-600"
          onChange={(e)=>setsearch(e.target.value)}
          placeholder="Search PrivateKey or Wallet Address"
        />
      </div>
      <SettingDialog count={count} setCount={setCount} botWallets={ botWallets} setbotWallets={setbotWallets}/>
    </div>
  )
}

FilterBar.displayName = "FilterBar";
export default FilterBar;