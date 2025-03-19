"use client"
import { UserNFT } from "@/types/asset";
import { useEffect , useState } from "react";
import PortfolioNFT from "@/app/_Component/nft";
import { fetchOwnedNfts } from "@/lib/blockscout_api/fetch";

type Props = {
  walletAddress: string;
}
const NFTShow = ( {walletAddress}:Props)=> {
  const [nfts, setNFTs] = useState<UserNFT[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect( () => {

    if(walletAddress){
      (async () => {
        setLoading(true);
        const nfts = await fetchOwnedNfts(walletAddress);
        setNFTs(nfts);
        setLoading(false);
      })();
    }

  } , [walletAddress] );

  return (
    <div className="w-1/7 m-3 border border-black rounded-lg">
      { !loading ?
        <div className="grid grid-cols-1 gap-3 p-3">
        {nfts.map(( nft, index) => (
          <PortfolioNFT nft={nft} key={index} />
        ))}
      </div> :
        <h1 className="text-center text-black text-2xl">Loading...</h1>
      }
    </div>
  )
}

NFTShow.displayName = "NFTShow";
export default NFTShow;