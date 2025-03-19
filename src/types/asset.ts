import { BlockscoutAssetType, BlockscoutNFTType, BlockscoutTokenThumbnails } from "@/types/blockscout";
import { MarketplaceNFTHistoryDetail } from "@/lib/subsquid_api/types";

export type AssetToken = {
  address: `0x${string}`;
  circulatingMarketCap?: number;
  decimals: number;
  exchangeRate?: number;
  holders?: number;
  iconUrl?: string;
  name?: string;
  symbol?: string;
  totalSupply?: bigint;
  type: BlockscoutAssetType;
  volume24h?: number;
}

export type AssetMetadataAttribute = {
  trait_type: string;
  value: string;
}

export type AssetMetadata = {
  attributes: AssetMetadataAttribute[];
  description?: string;
  externalUrl?: string;
  image?: string;
  name?: string;
}

export type AssetTokenInstance = {
  animationUrl?: string
  externalAppUrl?: string;
  id: bigint;
  imageUrl?: string;
  isUnique?: boolean;
  mediaType?: string;
  mediaUrl?: string;
  metadata?: AssetMetadata;
  owner: `0x${string}`;
  thumbnails?: BlockscoutTokenThumbnails;
}

export type Asset = {
  chainId: number;
  owner: `0x${string}`;
  tokenId?: bigint;
  token: AssetToken;
  tokenInstance?: AssetTokenInstance;
  value?: bigint;
}

export type UserNFT = AssetTokenInstance & {
  chainId: number;
  type: BlockscoutNFTType,
  token: AssetToken;
  value: bigint;
}

export type AssetOwner = {
  address: `0x${string}`,
  ensName?: string,
  isContract: boolean,
  contract?: {
    name?: string;
    implementations: unknown[];
    metadata?: AssetMetadata,
  },
  isVerified: boolean
  isScam: boolean
}

export type NFT = Omit<AssetTokenInstance, "owner"> & {
  chainId: number;
  owner?: AssetOwner;
  token: AssetToken;
  marketplace?: MarketplaceNFTHistoryDetail
}

// export type NftDetailtype = {
//   image_url : string;
//   metadata : {
//     name : string;
//     properties:[
//       {
//         str
//       }
//     ]
//   }
// }