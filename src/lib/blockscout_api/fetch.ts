'use server';

import { Address } from "viem";
import { chains } from "@/lib/thirdweb/chains";
import {
  BlockscoutAPIError,
  BlockscoutAssetType,
  BlockscoutGetNFTInstancesResponse,
  BlockscoutGetNFTsResponse,
  BlockscoutGetTokensResponse,
  BlockscoutNFT,
  BlockscoutNFTType
} from "@/types/blockscout";
import { Asset, NFT, UserNFT } from "@/types/asset";
import { parseBlockscoutNft, parseMetadata } from "./helpers";

export const fetchOwnedAssets = async (address: Address, types: BlockscoutAssetType[] | undefined = undefined, chainIds: number[] | undefined = undefined) => {
  const assets = await Promise.all((chainIds ?? chains.map(c => c.id)).map(chainId => fetchOwnedAssetsByChain(chainId, address, types)));
  return assets.flat();
}

export const fetchOwnedAssetsByChain = async (chainId: number, address: Address, types: BlockscoutAssetType[] | undefined = undefined, next_page_params: Record<string, string> | null | undefined = undefined): Promise<Asset[]> => {
  const chain = chains.find(c => c.id === chainId);
  if (!chain) {
    console.error("fetchOwnedAssetsByChain::Unknown chainId", chainId);
    return [];
  }

  const url = new URL(`addresses/${address}/tokens`, chain.blockExplorers.find(be => be.name === "Blockscout")?.apiUrl);
  url.searchParams.set("type", (types && types.length > 0 ? types : ["ERC-721", "ERC-1155"]).join(","));
  if (next_page_params) {
    for (const [key, value] of Object.entries(next_page_params)) {
      url.searchParams.set(key, value);
    }
  }

  const resp = await fetch(url)
  if (!resp.ok) {
    console.error("Error getting owned assets for address", address, "via", url.toString())
    return [];
  }
  const data: BlockscoutGetTokensResponse = await resp.json();
  if (!data.items) {
    return [];
  }

  return data.items.map(({ token_id, token_instance, token, value }) => ({
    chainId,
    owner: address as `0x${string}`,
    token: {
      address: token.address,
      tokenId: token_id ? BigInt(token_id) : undefined,
      circulatingMarketCap: token.circulating_market_cap ? Number(token.circulating_market_cap) : undefined,
      decimals: token.decimals ? Number(token.decimals) : 0,
      exchangeRate: token.exchange_rate ? Number(token.exchange_rate) : undefined,
      iconUrl: token.icon_url ?? undefined,
      name: token.name ?? undefined,
      symbol: token.symbol ?? undefined,
      holders: token.holders ? Number(token.holders) : undefined,
      totalSupply: token.total_supply ? BigInt(token.total_supply) : undefined,
      volume24h: token.volume_24h ? Number(token.volume_24h) : undefined,
      type: token.type,
    },
    tokenInstance: token_instance ? {
      animationUrl: token_instance.animation_url ?? undefined,
      externalAppUrl: token_instance.external_app_url ?? undefined,
      id: BigInt(token_instance.id),
      imageUrl: token_instance.image_url ?? undefined,
      isUnique: token_instance.is_unique ?? undefined,
      mediaType: token_instance.media_type ?? undefined,
      mediaUrl: token_instance.media_url ?? undefined,
      metadata: parseMetadata(token_instance.metadata),
      owner: token_instance.owner ?? address as `0x${string}`,
      thumbnails: token_instance.thumbnails ? {
        "250x250": token_instance.thumbnails["250x250"],
        "60x60": token_instance.thumbnails["60x60"],
        original: token_instance.thumbnails.original,
      } : undefined,
    } : undefined,
    value: value ? BigInt(value) : undefined,
  }));
}

export const fetchOwnedNfts = async (address: Address, types: BlockscoutNFTType[] | undefined = undefined, chainIds: number[] | undefined = undefined) => {
  const assets = await Promise.all((chainIds ?? chains.map(c => c.id)).map(chainId => fetchOwnedNftsByChain(chainId, address, types)));
  return assets.flat();
}

export const fetchOwnedNftsByChain = async (chainId: number, address: Address, types: BlockscoutNFTType[] | undefined = undefined, next_page_params: Record<string, string> | null | undefined = undefined): Promise<UserNFT[]> => {
  const chain = chains.find(c => c.id === chainId);
  if (!chain) {
    console.error("fetchOwnedNftsByChain::Unknown chainId", chainId);
    return [];
  }

  const apiBaseUrl = chain.blockExplorers.find(be => be.name === "Blockscout")?.apiUrl;
  if (!apiBaseUrl) {
    console.log(`fetchOwnedNftsByChain::Skipping fetch for unconfigured chain ${chain.name}`);
    return [];
  }


  const url = new URL(`addresses/${address}/nft`, apiBaseUrl);
  url.searchParams.set("type", (types && types.length > 0 ? types : ["ERC-721", "ERC-1155"]).join(","));
  if (next_page_params) {
    for (const [key, value] of Object.entries(next_page_params)) {
      url.searchParams.set(key, value);
    }
  }

  const resp = await fetch(url)
  if (!resp.ok) {
    console.error("Error getting owned nfts for address", address, "via", url.toString())
    return [];
  }
  const data: BlockscoutGetNFTsResponse = await resp.json();
  if (!data.items) {
    return [];
  }

  return data.items.map(({ token, value, ...token_instance }) => ({
    chainId,
    owner: token_instance.owner ?? address as `0x${string}`,
    animationUrl: token_instance.animation_url ?? undefined,
    externalAppUrl: token_instance.external_app_url ?? undefined,
    id: BigInt(token_instance.id),
    imageUrl: token_instance.image_url ?? undefined,
    isUnique: token_instance.is_unique ?? undefined,
    mediaType: token_instance.media_type ?? undefined,
    mediaUrl: token_instance.media_url ?? undefined,
    metadata: parseMetadata(token_instance.metadata),
    thumbnails: token_instance.thumbnails ? {
      "250x250": token_instance.thumbnails["250x250"],
      "60x60": token_instance.thumbnails["60x60"],
      original: token_instance.thumbnails.original,
    } : undefined,
    token: {
      address: token.address,
      circulatingMarketCap: token.circulating_market_cap ? Number(token.circulating_market_cap) : undefined,
      decimals: token.decimals ? Number(token.decimals) : 0,
      exchangeRate: token.exchange_rate ? Number(token.exchange_rate) : undefined,
      iconUrl: token.icon_url ?? undefined,
      name: token.name ?? undefined,
      symbol: token.symbol ?? undefined,
      holders: token.holders ? Number(token.holders) : undefined,
      totalSupply: token.total_supply ? BigInt(token.total_supply) : undefined,
      volume24h: token.volume_24h ? Number(token.volume_24h) : undefined,
      type: token.type,
    },
    type: token.type,
    value: BigInt(value || "1"),
  }));
}

export const fetchNftByChain = async (chainId: number, address: string, id: string | number | bigint): Promise<NFT | undefined> => {
  const chain = chains.find(c => c.id === chainId);
  if (!chain) {
    console.error("fetchOwnedNftsByChain::Unknown chainId", chainId);
    return undefined;
  }
  const apiBaseUrl = chain.blockExplorers.find(be => be.name === "Blockscout")?.apiUrl;
  if (!apiBaseUrl) {
    console.log(`fetchOwnedNftsByChain::Skipping fetch for unconfigured chain ${chain.name}`);
    return undefined;
  }
  const url = new URL(`tokens/${address}/instances/${id}`, apiBaseUrl);
  const resp = await fetch(url)
  if (!resp.ok) {
    console.log("Error fetching nft at address", address, "via", url.toString())
    return undefined;
  }
  const data: BlockscoutNFT | BlockscoutAPIError = await resp.json();
  if ("message" in data) {
    return undefined;
  }
  return parseBlockscoutNft(chainId, data);
}

export const fetchNft = async (address: Address, id: string | number | bigint, chainIds: number[] | undefined = undefined) => {
  const nfts = await Promise.all((chainIds ?? chains.map(c => c.id)).map(chainId => fetchNftByChain(chainId, address, id)));
  const nft = nfts.filter(nft => nft !== undefined);
  if (nft.length === 0) {
    return undefined;
  }
  return nft[0];
}

export const fetchNftsInCollection = async (chainId: number, address: Address) => {
  const chain = chains.find(c => c.id === chainId);
  if (!chain) {
    console.error("fetchOwnedNftsByChain::Unknown chainId", chainId);
    return [];
  }
  const apiBaseUrl = chain.blockExplorers.find(be => be.name === "Blockscout")?.apiUrl;
  if (!apiBaseUrl) {
    console.log(`fetchOwnedNftsByChain::Skipping fetch for unconfigured chain ${chain.name}`);
    return [];
  }

  const url = new URL(`tokens/${address}/instance`, apiBaseUrl);
  const resp = await fetch(url)
  if (!resp.ok) {
    console.log("Error fetching nfts at collection address", address, "via", url.toString())
    return [];
  }
  const data: BlockscoutGetNFTInstancesResponse | BlockscoutAPIError = await resp.json();
  if ("message" in data) {
    console.error("Upstream error fetching nfts at collection address", address, "via", url.toString())
    return [];
  }
  return data.items.map(nft => parseBlockscoutNft(chainId, nft));
}
