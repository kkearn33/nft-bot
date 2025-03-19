// import { PosseFormContract } from "@/lib/types";
// import { BACKEND_WALLET_ADDRESS, ENGINE_URL, THIRDWEB_SECRET_KEY } from "@/app/campaign/acs/constants";

// export async function backDeployContract(contract: PosseFormContract) {

//   const deployResp = await fetch(`${ENGINE_URL}/deploy/${contract.chain}/prebuilts/nft-collection`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
//       "x-backend-wallet-address": BACKEND_WALLET_ADDRESS,
//     },
//     body: JSON.stringify({
//       contractMetadata: {
//         name: contract.name,
//         symbol: contract.symbol,
//       }
//     })
//   });

//   if (!deployResp.ok) {
//     console.error("failed to deploy new contract", await deployResp.text());
//     throw new Error("Failed to deploy new contract");
//   }

//   const deployData = await deployResp.json();

//   return deployData.result.deployedAddress;
// }