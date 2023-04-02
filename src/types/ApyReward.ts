import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { fetchPeriodFinishForToken, fetchRewardRateForToken, loadOrCreateVault } from "./Vault";
import { ApyRewardEntity } from "../../generated/schema";
import { loadTvl } from "./Tvl";
import { getTokenPrice } from "../utils/PriceUtils";
import { pow } from "../utils/MathUtils";
import { BD_TEN } from "../utils/Constant";
import { fetchDecimals } from "../utils/ERC20";
import { calculateApr, calculateApy } from "../utils/ApyUtils";

export function createApyReward(
  vaultAddress: Address,
  reward: BigInt,
  rewardToken: Address,
  block: ethereum.Block
): ApyRewardEntity {
  const vault = loadOrCreateVault(vaultAddress, block)
  const id = `${vault.id}-${block.number}`

  let apyReward = ApyRewardEntity.load(id)

  if (apyReward == null) {
    const periodFinish = fetchPeriodFinishForToken(vaultAddress, rewardToken)
    const rewardRate = fetchRewardRateForToken(vaultAddress, rewardToken)
    const tvl = loadTvl(vaultAddress, block)
    const rewardTokenPrice = getTokenPrice(rewardToken)

    const period  = periodFinish.minus(block.timestamp).toBigDecimal()
    const value = rewardRate
      .divDecimal(pow(BD_TEN, vault.decimals))
      .times(
        rewardTokenPrice.divDecimal(pow(BD_TEN, fetchDecimals(rewardToken).toI32()))
      )
      .times(period)


    apyReward = new ApyRewardEntity(id);

    apyReward.vault = vault.id

    apyReward.tvl = tvl.id

    apyReward.apr = calculateApr(period, value, tvl.value)
    apyReward.apy = calculateApy(apyReward.apr)

    apyReward.rewardAmount = reward
    apyReward.rewardToken = rewardToken.toHex()
    apyReward.rewardPeriodFinish = periodFinish
    apyReward.rewardRate = rewardRate
    apyReward.rewardTokenPrice = rewardTokenPrice

    apyReward.createAtBlock = block.number
    apyReward.timestamp = block.timestamp
    apyReward.save()
  }

  return apyReward
}