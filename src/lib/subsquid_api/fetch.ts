'use server';

// import {AstarSale, RawMarketplaceSale} from "@/app/airdrop/types";
import { CurrencyQuery, MarketNftQuery, marketplaceSalesQuery, nftDetailQuery } from "@/lib/subsquid_api/queries";
import {
  Currency ,
  MarketNFTtype ,
  MarketplaceNFTHistoryDetail ,
  NFTDetailQueryResponse ,
  PageInfotype
} from "@/lib/subsquid_api/types";
const url = new URL("https://squid.api.possestudios.io/graphql");

const init = { method: "POST", headers: { accept: "application/json", "content-type": "application/json" } }

// export const fetchMarketplaceSalesWithAstar = async (): Promise<AstarSale[]> => {
//   const resp = await fetch(url, {
//     ...init,
//     body: JSON.stringify({
//       operationName: "AstrSales",
//       query: marketplaceSalesQuery,
//       variables: { ASTR: "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441".toLowerCase() }
//     })
//   })
//   if (!resp.ok) {
//     console.error("Error fetching marketplace sales:", await resp.text())
//     return []
//   }
//   const { data: { sales } }: { data: { sales: RawMarketplaceSale[] } } = await resp.json()
//   return sales.map(sale => ({
//     listingId: BigInt(sale.listing.listingId),
//     seller: sale.seller.address,
//     buyer: sale.buyer.address,
//     astr: BigInt(sale.totalPrice),
//     timestamp: sale.tx.block.timestamp * 1000,
//     hash: sale.tx.hash,
//   }))
// }
//
// export const fetchMarketplaceNftHistory = async (address: `0x${string}`, tokenId: string | bigint | number): Promise<MarketplaceNFTHistoryDetail | undefined> => {
//   const resp = await fetch(url, {
//     ...init,
//     body: JSON.stringify({
//       operationName: "NftHistory",
//       query: nftDetailQuery,
//       variables: { address: address.toLowerCase(), tokenId: String(tokenId) }
//     })
//   })
//   if (!resp.ok) {
//     console.error("Error fetching marketplace nft history:", await resp.text())
//     return undefined
//   }
//   const { data: { sales, listings, auctions, offers } }: { data: NFTDetailQueryResponse } = await resp.json()
//   return {
//     sales: sales.map(s => ({
//       quantity: BigInt(s.quantity),
//       totalPrice: BigInt(s.totalPrice),
//       buyer: s.buyer.address,
//       seller: s.seller.address,
//       txHash: s.tx.hash,
//       timestamp: sanitizeDate(s.tx.block.timestamp),
//     })),
//     listings: listings.map(l => ({
//       id: BigInt(l.listingId),
//       pricePerToken: BigInt(l.pricePerToken),
//       quantity: BigInt(l.quantity),
//       status: l.status,
//       startAt: sanitizeDate(l.startAt),
//       endAt: sanitizeDate(l.endAt),
//       reserved: l.reserved,
//       creator: l.creator.address,
//       currency: {
//         address: l.currency.contract.address,
//         name: l.currency.contract.name,
//         symbol: l.currency.contract.symbol,
//         decimals: l.currency.decimals
//       },
//       txHash: l.tx.hash,
//       timestamp: sanitizeDate(l.tx.block.timestamp),
//     })),
//     auctions: auctions.map(a => ({
//       id: BigInt(a.auctionId),
//       bidBufferBps: a.bidBufferBps,
//       quantity: BigInt(a.quantity),
//       status: a.status,
//       timeBufferInSeconds: a.timeBufferInSeconds,
//       bids: a.bids.map(b => ({
//         amount: BigInt(b.amount),
//         txHash: b.tx.hash,
//         timestamp: sanitizeDate(b.tx.block.timestamp)
//       })),
//       buyoutBidAmount: BigInt(a.buyoutBidAmount),
//       minimumBidAmount: BigInt(a.minimumBidAmount),
//       startAt: sanitizeDate(a.startAt),
//       endAt: sanitizeDate(a.endAt),
//       closer: a.closer?.address,
//       creator: a.creator.address,
//       winningBidder: a.winningBidder?.address,
//       txHash: a.tx.hash,
//       timestamp: sanitizeDate(a.tx.block.timestamp),
//     })),
//     offers: offers.map(o => ({
//       id: BigInt(o.offerId),
//       status: o.status,
//       totalPrice: BigInt(o.totalPrice),
//       quantity: BigInt(o.quantity),
//       offeror: o.offeror.address,
//       expiresAt: sanitizeDate(o.expiresAt),
//       txHash: o.tx.hash,
//       timestamp: sanitizeDate(o.tx.block.timestamp),
//       currency: {
//         address: o.currency.contract.address,
//         name: o.currency.contract.name,
//         symbol: o.currency.contract.symbol,
//         decimals: o.currency.decimals
//       }
//     })),
//   }
// }

export const fetchNFTOwnDetailQuery = async (address: string, tokenId: string | bigint | number): Promise<NFTDetailQueryResponse | undefined> => {
  const resp = await fetch(url, {
    ...init,
    body: JSON.stringify({
      operationName: "NFTDetail",
      query: nftDetailQuery,
      variables: { address: address.toLowerCase(), tokenId: String(tokenId) }
    })
  })

   if (!resp.ok) {
    console.error("Error fetching NftDetail :", await resp.text())
    return undefined;
  }
   const data = await resp.json();
   const detail: NFTDetailQueryResponse = data.data;
   return detail;
}

export const fetchMarketNFTQuery = async (start: number, after?: string ): Promise<{ nfts: MarketNFTtype[], page: PageInfotype | undefined }> => {
  const variables: { first: number, after?: string } = { first: start };
  if (after) {
    variables.after = after;
  }

  const resp = await fetch(url, {
    ...init,
    body: JSON.stringify({
      operationName: "MarketNfts",
      query: MarketNftQuery,
      variables: variables
    }),
  });

  if (!resp.ok) {
    console.error("Error fetching MarketNFT:", await resp.text());
    return { nfts: [], page: undefined };
  }

  const data = await resp.json();
  const listingsConnection = data?.data?.listingsConnection;

  if (!listingsConnection) {
    console.error("Invalid response structure:", data);
    return { nfts: [], page: undefined };
  }

  const edges = listingsConnection.edges || [];
  const nfts: MarketNFTtype[] = edges.map((edge: any) => edge.node);
  const { totalCount, pageInfo } = listingsConnection;
  return { nfts, page: { totalCount, ...pageInfo } };
};


// export const fetchCurrency = async (): Promise<Currency[] | undefined> => {
//     const resp = await fetch(url, {
//         ...init,
//         body: JSON.stringify({
//             operationName: "Tokens",
//             query: CurrencyQuery,
//         })
//     })
//
//     if (!resp.ok) {
//         console.error("Error fetching NftDetail :", await resp.text())
//         return undefined;
//     }
//     const data = await resp.json();
//     const{ data: { currncies } : { data: { tokens:Currency[]}}} = data;
//     return currencies;
// }