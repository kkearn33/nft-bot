// import { PosseFormNFT } from "@/lib/types";
// import { BACKEND_WALLET_ADDRESS, ENGINE_URL, THIRDWEB_SECRET_KEY } from "@/app/campaign/acs/constants";
// import { fetchPosseChains } from "@/server-actions/chain";

// export async function backMintNFT(nft: PosseFormNFT) {

//   const dbChains = await fetchPosseChains();
//   const dChain = dbChains.find((chain) => chain.pureId === nft.chain);
//   if (!dChain) {
//     throw new Error("please select the chain");
//   }

//   // TODO IF ERC1155 with other urls

//   const totalCountResp = await fetch(
//     `${ENGINE_URL}/contract/${nft.chain}/${nft.collection}/erc721/total-count`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
//         "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
//       },
//     }
//   );

//   const totalCountData = await totalCountResp.json();
//   const tokenId = totalCountData.result;


//   const mintResp = await fetch(
//     `${ENGINE_URL}/contract/${nft.chain}/${nft.collection}/${nft.category.toLowerCase().replace("-", "")}/mint-to`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
//         "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
//       },
//       body: JSON.stringify({
//         receiver: nft.owner,
//         metadata: {
//           name: nft.name,
//           description: nft.description,
//           image: nft.image,
//           attributes: nft.traits?.map((trait) => ({ trait_type: trait.type, value: trait.name })),
//           properties: nft.traits?.reduce((acc, trait) => {
//             acc[trait.type] = trait.name;
//             return acc;
//           }, {} as Record<string, unknown>)
//         },
//       }),
//     }
//   );

//   if (!mintResp.ok) {
//     console.log("[DEBUG] not ok", await mintResp.text());
//     throw new Error("Failed to mint new NFT");
//   }

//   const mintData = await mintResp.json();
//   const queueId = mintData.result.queueId;


//   return { tokenId, queueId };
// }