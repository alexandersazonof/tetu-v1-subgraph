import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { ApyAutoCompoundEntity, VaultEntity } from "../../generated/schema";
import { calculateAprAutoCompound, calculateApy } from "../utils/ApyUtils";
import { pow } from "../utils/MathUtils";
import { BD_TEN } from "../utils/Constant";

export function createApyAutoCompound(
  vault: VaultEntity,
  differentSharePrice: BigInt,
  differentTimestamp: BigInt,
  block: ethereum.Block): ApyAutoCompoundEntity {

  const id = `${vault.id}-${block.number}`
  let apyAutoCompound = ApyAutoCompoundEntity.load(id);

  if (apyAutoCompound == null) {
    apyAutoCompound = new ApyAutoCompoundEntity(id);


    const apr = calculateAprAutoCompound(
      differentSharePrice.divDecimal(pow(BD_TEN, vault.decimals)),
      differentTimestamp.toBigDecimal())


    apyAutoCompound.apr = apr
    apyAutoCompound.apy = calculateApy(apr)

    apyAutoCompound.vault = vault.id
    apyAutoCompound.differentSharePrice = differentSharePrice
    apyAutoCompound.differentShareTimestamp = differentTimestamp

    apyAutoCompound.timestamp = block.timestamp
    apyAutoCompound.createAtBlock = block.number
    apyAutoCompound.save()
  }

  return apyAutoCompound;
}