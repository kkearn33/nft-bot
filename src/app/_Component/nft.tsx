'use client'

import { shortenString } from "@/lib/utils";
import { MediaRenderer } from "thirdweb/react";
import { client } from "@/lib/thirdweb";;
import { NFT , UserNFT } from "@/types/asset";
import { chains } from "@/lib/thirdweb/chains";
import { Card , CardContent , CardFooter } from "@/components/ui/card";

type Props = {
  nft: UserNFT;
}
export default function PortfolioNFT({ nft } : Props) {
  return (
    <div className="relative group rounded-lg shadow-lg bg-gray-700">
      <Card className="relative cursor-pointer transition-all hover:scale-105 hover:shadow-lg flex flex-col w-full bg-golden-1000 justify-between border overflow-hidden border-white/10 rounded-lg">
        <CardContent>
          <div className="relative">
            <MediaRenderer
              src={nft.mediaUrl || nft.token.iconUrl}
              client={client}
              className="object-contain object-center w-full aspect-square bg-black-1500 z-[1]"
              style={{ objectFit: "contain" }}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex w-full px-3">
            <div className="flex flex-col w-full justify-center py-3">
              <span className="text-sm font-semibold text-white px-4">{nft.token.name}</span>
              <div className="flex justify-between">
                <p className="text-sm text-white whitespace-nowrap">
                  {shortenString(nft.token?.name, 8)}
                </p>
                <p className="text-sm text-white whitespace-nowrap">
                  #{nft.id}
                </p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
