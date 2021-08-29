import {Network} from "./interfaces";

export type ProjectJson = {
  "name": string,
  "category": "lending" | "amm" | "vault" | "marketplace" | "staking",
  "website"?: string,
  "logo": string,
  "background": string | Array<string>,
  "foreground": string,
  "network": Network
}