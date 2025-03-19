// const indexer = new URL("https://squid.api.possestudios.io/graphql");
// const ASTR = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441".toLowerCase();

export const marketplaceSalesQuery = `\
query AstrSales($ASTR: String) {
  sales(where: {listing: {currency: {contract: {address_eq: $ASTR}}}}) {
    listing {
      listingId
    }
    totalPrice
    seller {
      address
    }
    tx {
      block {
        timestamp
      }
      hash
    }
    buyer {
      address
    }
  }
}`
export const CurrencyQuery = `\
query MyQuery {
    tokens {
        contract {
            name
            symbol
            address
        }
        decimals
    }
}`
export const MarketNftQuery = `\
query MarketNftQuery($first: Int, $after: String) {
  listingsConnection(orderBy: listingId_DESC, first: $first, where: {status_eq: CREATED}, after: $after) {
    totalCount
    pageInfo {
      startCursor
      hasPreviousPage
      hasNextPage
      endCursor
    }
    edges {
      node {
        nft {
          contract {
            address
            name
            chain {
              icon
              id
            }
          }
          tokenId
        }
        pricePerToken
        currency {
          decimals
          contract {
            address
            symbol
          }
        }
        quantity
        listingId
        creator {
          address
        }
      }
    }
  }
}`

export const nftDetailQuery = `\
query NftDetailQuery($address: String, $tokenId: BigInt) {
  listings(where: {nft: {tokenId_eq: $tokenId, contract: {address_eq: $address}}}) {
    listingId
    pricePerToken
    startAt
    endAt
    status
    reserved
    quantity
    creator {
      address
    }
    currency {
      contract {
        address
        name
        symbol
      }
    }
    marketplace {
      contract {
        address
        chain {
          id
        }
      }
    }
    tx {
      hash
      block {
        timestamp
      }
    }
  }
  sales(where: {listing: {nft: {tokenId_eq: $tokenId, contract: {address_eq: $address}}}}) {
    quantity
    totalPrice
    tx {
      hash
      block {
        timestamp
      }
    }
    buyer {
      address
    }
    seller {
      address
    }
  }
  auctions(where: {nft: {tokenId_eq: $tokenId, contract: {address_eq: $address}}}) {
    auctionId
    bidBufferBps
    bids {
      amount
      tx {
        block {
          timestamp
        }
        hash
      }
    }
    buyoutBidAmount
    endAt
    closer {
      address
    }
    creator {
      address
    }
    minimumBidAmount
    quantity
    startAt
    status
    timeBufferInSeconds
    tx {
      hash
      block {
        timestamp
      }
    }
    winningBidder {
      address
    }
  }
  offers(where: {nft: {tokenId_eq: $tokenId, contract: {address_eq: $address}}}) {
    expiresAt
    offerId
    status
    totalPrice
    quantity
    offeror {
      address
    }
    tx {
      hash
      block {
        timestamp
      }
    }
    currency {
      contract {
        address
        name
        symbol
      }
      decimals
    }
  }
}`
