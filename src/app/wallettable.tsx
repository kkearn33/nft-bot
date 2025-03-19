"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { XAddress } from "@/app/_Component/xaddress";
import { BotWalletDetailType } from "@/lib/thirdweb/types";
import { formatUnits} from "viem";
import { useEffect , useState } from "react";

type Props = {
  showWallets: BotWalletDetailType[];
  setselAddress: (address: string) => void;
}

const WalletTable = ({ showWallets, setselAddress }: Props)=>  {
  const [allAmount_ETH, setAllAmount_ETH] = useState<bigint>(0n);
  const [allAmount_ASTR, setAllAmount_ASTR] = useState<bigint>(0n);
  const [ allNftCount, setAllNftCount] = useState(0);
  useEffect(() => {
    let buf0 = 0n
    let buf1 = 0n
    let buf2 = 0 ;
    showWallets.map(wallet => {
      buf0 += wallet.amount_ETH;
      buf1 += wallet.amount_ASTR;
      buf2 += wallet.nfts.length;
    });

    setAllNftCount(buf2);
    setAllAmount_ETH(buf0);
    setAllAmount_ASTR(buf1);
  }, [showWallets])
  const decimals = 18;
  return (
    <div className="w-6/7 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>PrivateKey</TableHead>
            <TableHead>Wallet Address</TableHead>
            <TableHead className="text-center">Amount(ETH)</TableHead>
            <TableHead className="text-center">Amount(ASTR)</TableHead>
            <TableHead className="text-center">NFT Count</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {showWallets.map((item, index) => (
            <TableRow key={item.privateKey} onClick={()=> setselAddress(item.address)}>
              <TableCell className="font-medium">{index}</TableCell>
              <TableCell><XAddress address={item.privateKey}/></TableCell>
              <TableCell><XAddress address={item.address} /></TableCell>
              <TableCell className="text-center">{formatUnits(item.amount_ETH, decimals)} ETH</TableCell>
              <TableCell className="text-center">{formatUnits(item.amount_ASTR, decimals)} ASTR</TableCell>
              <TableCell className="text-center">{item.nfts.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="bg-gray-400">
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-center">{formatUnits(allAmount_ETH, decimals)} ETH</TableCell>
            <TableCell className="text-center">{formatUnits(allAmount_ASTR, decimals)} ASTR</TableCell>
            <TableCell className=" text-center">{allNftCount}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

WalletTable.displayName="WalletTable";
export default WalletTable;