export type BlockscoutAssetType = "ERC-20" | "ERC-721" | "ERC-1155" | "ERC-404";
export type BlockscoutNFTType = Omit<BlockscoutAssetType, "ERC-20">

export type BlockscoutToken = {
  address: `0x${string}`;
  circulating_market_cap: string | null;
  decimals: string;
  exchange_rate: string | null;
  holders: string | null;
  icon_url: string | null;
  name: string | null;
  symbol: string | null;
  total_supply: string | null;
  type: BlockscoutAssetType;
  volume_24h: string | null
}

export type BlockscoutMetadataAttribute = {
  trait_type: string | null;
  value: string
}

export type BlockscoutMetadata = {
  attributes: BlockscoutMetadataAttribute[] | null;
  description: string | null;
  external_url: string | null;
  image: string | null;
  name: string | null;
}

export type BlockscoutTokenThumbnails = {
  "250x250": string;
  "60x60": string;
  original: string
}

export type BlockscoutTokenInstance = {
  animation_url: string | null;
  external_app_url:  string | null;
  id: string;
  image_url: string | undefined;
  is_unique: boolean | null;
  media_type: string | null;
  media_url: string | null;
  metadata: BlockscoutMetadata;
  owner: `0x${string}` | null;
  thumbnails: BlockscoutTokenThumbnails | null;
  token: BlockscoutToken;
}
export type BlockscoutAsset = {
  token: BlockscoutToken;
  token_instance: BlockscoutTokenInstance | null;
  token_id: string | null;
  value: string | null;
}

export type BlockscoutNextPageParams = {
  fiat_value: string | null;
  id: number;
  items_count: number;
  value: string | null;
}

export type BlockscoutTag = {
  display_name: string
  label: string
}
export type BlockscoutUserTag = BlockscoutTag & {
  address_hash: `0x${string}`,
}

export type BlockscoutOwner = {
  ens_domain_name: string | null,
  hash: `0x${string}` | null,
  implementations: unknown[],
  is_contract: boolean,
  is_scam: boolean,
  is_verified: boolean,
  metadata: BlockscoutMetadata | null,
  name: string | null,
  private_tags: string[],
  proxy_type: string | null,
  public_tags: string[],
  watchlist_names: string[]
}

export type BlockscoutGetTokensResponse = {
  items: BlockscoutAsset[] | null;
  next_page_params: BlockscoutNextPageParams | null;
}

export type BlockscoutUserNFT = {
  token_type: BlockscoutNFTType,
  value: string | null;
} & BlockscoutTokenInstance;

export type BlockscoutNFT = {
  owner: BlockscoutOwner;
} & BlockscoutTokenInstance;

export type BlockscoutGetNFTsResponse = {
  items: BlockscoutUserNFT[] | null;
  next_page_params: Record<string, string> | null;
}

export type BlockscoutGetNFTInstancesResponse = {
  items: BlockscoutNFT[];
  next_page_params: { unique_token: number } | null;
}

export type BlockscoutAPIError = {
  message: string;
}
