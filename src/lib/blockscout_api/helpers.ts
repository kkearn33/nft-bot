import { BlockscoutMetadata, BlockscoutNFT } from "@/types/blockscout";
import { AssetMetadata, NFT } from "@/types/asset";

export const parseMetadata = (metadata: BlockscoutMetadata | null | undefined): AssetMetadata | undefined => metadata ? ({
  attributes: metadata.attributes ? metadata.attributes.map(attr => ({
    trait_type: attr.trait_type ?? attr.value,
    value: attr.value,
  })) : [],
  description: metadata.description ?? undefined,
  externalUrl: metadata.external_url ?? undefined,
  image: metadata.image ?? undefined,
  name: metadata.name ?? undefined,
}) : undefined;

export const parseBlockscoutNft = (chainId: number, nft: BlockscoutNFT): NFT => ({
  chainId,
  animationUrl: nft.animation_url ?? undefined,
  externalAppUrl: nft.external_app_url ?? undefined,
  id: BigInt(nft.id),
  imageUrl: nft.image_url ?? undefined,
  isUnique: nft.is_unique ?? undefined,
  mediaType: nft.media_type ?? undefined,
  mediaUrl: nft.media_url ?? undefined,
  metadata: parseMetadata(nft.metadata),
  thumbnails: nft.thumbnails ? {
    "250x250": nft.thumbnails["250x250"],
    "60x60": nft.thumbnails["60x60"],
    original: nft.thumbnails.original,
  } : undefined,
  owner: nft.owner?.hash ? {
    address: nft.owner.hash as `0x${string}`,
    ensName: nft.owner.ens_domain_name ?? undefined,
    isContract: nft.owner.is_contract,
    contract: nft.owner.is_contract ? {
      name: nft.owner.name ?? undefined,
      implementations: nft.owner.implementations,
      metadata: parseMetadata(nft.owner.metadata),
    } : undefined,
    isVerified: nft.owner.is_verified,
    isScam: nft.owner.is_scam
  } : undefined,
  token: {
    address: nft.token.address,
    circulatingMarketCap: nft.token.circulating_market_cap ? Number(nft.token.circulating_market_cap) : undefined,
    decimals: nft.token.decimals ? Number(nft.token.decimals) : 0,
    exchangeRate: nft.token.exchange_rate ? Number(nft.token.exchange_rate) : undefined,
    iconUrl: nft.token.icon_url ?? undefined,
    name: nft.token.name ?? undefined,
    symbol: nft.token.symbol ?? undefined,
    holders: nft.token.holders ? Number(nft.token.holders) : undefined,
    totalSupply: nft.token.total_supply ? BigInt(nft.token.total_supply) : undefined,
    volume24h: nft.token.volume_24h ? Number(nft.token.volume_24h) : undefined,
    type: nft.token.type,
  },
})
