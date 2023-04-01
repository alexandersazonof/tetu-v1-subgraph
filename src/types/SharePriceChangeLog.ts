import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { SharePriceChangeLogEntity } from "../../generated/schema";
import { loadOrCreateVault } from "./Vault";
import { loadOrCreateStrategy } from "./Strategy";

export function createSharePriceChangeLog(
  vaultAddress: Address,
  strategyAddress: Address,
  oldSharePrice: BigInt,
  newSharePrice: BigInt,
  block: ethereum.Block): SharePriceChangeLogEntity {
  const id = `${vaultAddress.toHex()}-${block.number}`
  let sharePrice =  SharePriceChangeLogEntity.load(id)
  if (sharePrice == null) {
    sharePrice = new SharePriceChangeLogEntity(id);

    sharePrice.oldSharePrice = oldSharePrice
    sharePrice.newSharePrice = newSharePrice

    sharePrice.vault = loadOrCreateVault(vaultAddress, block).id
    sharePrice.strategy = loadOrCreateStrategy(strategyAddress, block).id

    sharePrice.createAtBlock = block.number
    sharePrice.timestamp = block.timestamp

    sharePrice.save()
  }
  return sharePrice;
}