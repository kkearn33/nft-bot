import { strict } from "node:assert";

type Status = "CREATED" | "COMPLETED" | "CANCELLED";

type TxDetail = {
  hash: `0x${string}`;
  block: {
    timestamp: number;
  };
}

type WithAddress = {
  address: `0x${string}`;
}

export type Currency = {
  contract: {
    address: `0x${string}`;
    name: string;
    symbol: string;
  };
  decimals: number;
}

export type PageInfotype = {
  totalCount: number;
  startCursor : number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  endCursor : string;
}

export type MarketNFTtype = {
  nft:{
    contract: {
      address: string;
      name: string;
      chain: {
        icon : string;
        id: string;
      }
    }
    tokenId: bigint;
  }
  pricePerToken: bigint;
  currency: {
    decimals: number;
    contract: {
      address: string;
      symbol: string;
      url: string;
    }
  }
  quantity: bigint;
  listingId: bigint;
  creator: {
    address: string;
  }
}

export type NFTDetailQueryResponse = {
  listings: {
    listingId: string;
    pricePerToken: string;
    startAt: number;
    endAt: number;
    status: Status;
    reserved: boolean;
    quantity: string;
    creator: WithAddress;
    currency: Currency;
    marketplace: {
      contract: WithAddress;
    };
    tx: TxDetail;
  }[];
  sales: {
    quantity: string;
    totalPrice: string;
    tx: TxDetail;
    buyer: WithAddress;
    seller: WithAddress;
  }[];
  auctions: {
    auctionId: string;
    bidBufferBps: number;
    bids: {
      amount: string;
      tx: TxDetail;
    }[];
    buyoutBidAmount: string;
    endAt: number;
    closer: WithAddress | null;
    creator: WithAddress;
    minimumBidAmount: string;
    quantity: string;
    startAt: number;
    status: Status;
    timeBufferInSeconds: number;
    tx: TxDetail;
    winningBidder: WithAddress | null;
  }[];
  offers: {
    offerId: string;
    expiresAt: number;
    totalPrice: string;
    quantity: string;
    offeror: WithAddress;
    tx: TxDetail;
    currency: Currency;
    status: Status;
  }[];
};

type MarketplaceCurrency = {
  address: `0x${string}`;
  name: string;
  symbol: string;
  decimals: number;
}

export type MarketplaceSale = {
  quantity: bigint;
  totalPrice: bigint;
  buyer: `0x${string}`;
  seller: `0x${string}`;
  txHash: `0x${string}`;
  timestamp: Date;
}

export type MarketplaceOffer = {
  id: bigint;
  status: Status;
  totalPrice: bigint;
  quantity: bigint;
  offeror: `0x${string}`;
  expiresAt: Date;
  txHash: `0x${string}`;
  timestamp: Date;
  currency: MarketplaceCurrency;
}

export type MarketplaceBid = {
  amount: bigint;
  txHash: `0x${string}`;
  timestamp: Date;
}

export type MarketplaceAuction = {
  id: bigint;
  bidBufferBps: number;
  quantity: bigint;
  status: Status;
  timeBufferInSeconds: number;
  bids: MarketplaceBid[];
  buyoutBidAmount: bigint;
  minimumBidAmount: bigint;
  startAt: Date;
  endAt: Date;
  closer?: `0x${string}`;
  creator: `0x${string}`;
  winningBidder?: `0x${string}`;
  txHash: `0x${string}`;
  timestamp: Date;
}


export type MarketplaceListing = {
  id: bigint;
  pricePerToken: bigint;
  quantity: bigint;
  status: Status;
  startAt: Date;
  endAt: Date;
  reserved: boolean;
  creator: `0x${string}`;
  currency: MarketplaceCurrency;
  txHash: `0x${string}`;
  timestamp: Date;
}

export type MarketplaceNFTHistoryDetail = {
  listings: MarketplaceListing[];
  sales: MarketplaceSale[];
  auctions: MarketplaceAuction[];
  offers: MarketplaceOffer[];
}
