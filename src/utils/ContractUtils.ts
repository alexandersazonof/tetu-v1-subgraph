import { Address } from "@graphprotocol/graph-ts";
import { UtilsContract } from "../../generated/Controller/UtilsContract";
import { getUtilsHelper } from "./Constant";

export function getERC20Symbols(addresses: Address[]): string[] {
  const contract = UtilsContract.bind(getUtilsHelper())
  const trySymbol = contract.try_erc20Symbols(addresses)
  return trySymbol.reverted ? [] : trySymbol.value;
}