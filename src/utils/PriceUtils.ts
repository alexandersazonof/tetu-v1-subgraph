import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { PriceCalculatorContract } from "../../generated/templates/VaultTemplate/PriceCalculatorContract";
import { getPriceCalculator } from "./Constant";

export function getTokenPrice(address: Address): BigInt {
  const contract = PriceCalculatorContract.bind(getPriceCalculator())
  const tryPrice = contract.try_getPriceWithDefaultOutput(address)
  return tryPrice.reverted ? BigInt.zero() : tryPrice.value
}


