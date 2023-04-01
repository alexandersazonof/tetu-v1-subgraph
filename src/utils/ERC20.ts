import { Address } from "@graphprotocol/graph-ts";
import { ERC20 } from "../../generated/Controller/ERC20";
import { UNDEFINED } from "./Constant";

export function fetchDecimals(address: Address): number {
  const erc20 = ERC20.bind(address)
  const tryDecimals = erc20.try_decimals()
  return tryDecimals.reverted ? 0 : tryDecimals.value;
}

export function fetchName(address: Address): string {
  const erc20 = ERC20.bind(address);
  const tryName = erc20.try_name();
  return tryName.reverted ? UNDEFINED : tryName.value;
}

export function fetchSymbol(address: Address): string {
  const erc20 = ERC20.bind(address);
  const trySymbol = erc20.try_symbol();
  return trySymbol.reverted ? UNDEFINED : trySymbol.value;
}