// import { BACKEND_WALLET_ADDRESS, ENGINE_URL, THIRDWEB_SECRET_KEY } from "@/app/campaign/acs/constants";

// export async function backDeployMarket(chainId: number, marketplaceName: string) {

//   const deployResp = await fetch(`${ENGINE_URL}/deploy/${chainId}/prebuilts/marketplace-v3`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
//       'X-Backend-Wallet-Address': BACKEND_WALLET_ADDRESS,
//     },
//     body: JSON.stringify({
//       contractMetadata: {
//         name: marketplaceName
//       }
//     })
//   })


//   if (!deployResp.ok) {
//     console.error("failed to deploy a new marketplaceV3", await deployResp.text());
//     throw new Error("Failed to deploy a new MarketplaceV3");
//   }

//   const deployData = await deployResp.json();

//   return deployData.result.deployedAddress;
// }