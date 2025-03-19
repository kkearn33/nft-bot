import { createWallet, inAppWallet } from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
const secretKey = process.env.THIRDWEB_SECRET_KEY;
if (!clientId) {
  throw new Error(
    "Missing NEXT_PUBLIC_THIRDWEB_CLIENT_ID env variable. Please add it to your .env.local file.",
  );
}

export const client = createThirdwebClient({ clientId, secretKey });

export const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "apple",
        "facebook",
        "discord",
        "line",
        "x",
        "coinbase",
        "farcaster",
        "telegram",
        "github",
        "twitch",
        "guest",
        "email",
        "phone",
        "passkey",
        "wallet",
      ],
    }
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
]

export const appMetadata = {
  name: "EvoVerses",
  url: "https://evoverses.com",
  description: "A 3D monster battling game bringing Web2 and Web3 together in one platform.",
  logoUrl: "https://evoverses.com/EVO.png",
};

export const walletConnect = {
  projectId: process.env.NEXT_PUBLIC_THIRDWEB_PROJECT_ID,
};
