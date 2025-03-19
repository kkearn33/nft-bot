import { defineChain, NATIVE_TOKEN_ADDRESS } from "thirdweb";
import {
  base as thirdwebBase,
  baseSepolia as thirdwebBaseSepolia,
  Chain,
  cronos as thirdwebCronos,
  soneiumMinato as thirdwebSoneiumMinato,
} from "thirdweb/chains";
import { Currency, PosseChain } from "@/lib/thirdweb/types";

const defaultNativeCurrency: Currency = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  address: NATIVE_TOKEN_ADDRESS,
  icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040"
}
const withBlockscout = (chain: Chain, nameOverride: string | undefined = undefined) => {
  const name = nameOverride ?? chain.name ?? "";
  const url = `https://${name.toLowerCase().replace(/ /g, "-")}.blockscout.com`;
  return {
    ...chain,
    name,
    blockExplorers: [
      ...(chain.blockExplorers ?? []),
      {name: "Blockscout", url: `${url}/`, apiUrl: `${url}/api/v2/`},
    ]
  } as PosseChain;
};

const withMarketplace = (chain: Chain, marketplace: `0x${string}`) => ({...chain, marketplace} as PosseChain)

const withSupportedCurrencies = (chain: Chain, nativeCurrency: Partial<Currency> = {}, supportedCurrencies: Currency[] = []) => ({
  ...chain,
  nativeCurrency: {...defaultNativeCurrency, ...chain.nativeCurrency, ...nativeCurrency},
  supportedCurrencies
} as PosseChain)

export const base = withSupportedCurrencies(withBlockscout({
  ...thirdwebBase,
  icon: {
    url: "https://assets.coingecko.com/nft_contracts/images/2989/small_2x/base-introduced.png?1707289780",
    height: 40,
    width: 40,
    format: "png"
  }
}));
export const baseSepolia = withSupportedCurrencies(withBlockscout(thirdwebBaseSepolia));

export const soneium = withSupportedCurrencies(
  withMarketplace(
    withBlockscout(
      defineChain({
        id: 1868,
        name: "Soneium",
        nativeCurrency: {name: "Ether", symbol: "ETH", decimals: 18},
        icon: {
          url: "https://cdn.prod.website-files.com/6503306c491d20f69e484470/66d1d1eb6c65e24bf6823b43_66ced2298e05dc2323b00cd0_66c8395fb58bb0320c64e853_ujzFVEj0_400x400.jpeg",
          height: 40,
          width: 40,
          format: "png"
        }
      })
    ),
    "0xFF4C94b6D2A89F5CA5FC46A49BE40A42f7352D18"
  ),
  {},
  [{
    name: "Astar",
    symbol: "ASTR",
    decimals: 18,
    address: "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441",
    icon: "https://assets.coingecko.com/coins/images/53778/small/astar.jpg"
  }]
)

export const soneiumMinato = withSupportedCurrencies(
  withMarketplace(
  withBlockscout(thirdwebSoneiumMinato),
    "0x748202c29A5C65383053b65ccb3937d0c54546E9"
  )
);

export const cronos = withSupportedCurrencies(
  withBlockscout(thirdwebCronos),
  {icon: "https://cryptologos.cc/logos/cronos-cro-logo.png?v=040"}
);

const testnets = [soneiumMinato] as PosseChain[];
const mainnets = [soneium] as PosseChain[];
export const chains = [
  ...(process.env.NEXT_PUBLIC_CURRENT_NETWORK === "testnet" ? testnets : []),
  ...mainnets,
];
