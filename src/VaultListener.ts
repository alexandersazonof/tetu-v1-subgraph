import {
  AddedRewardToken,
  Deposit,
  Invest,
  RemovedRewardToken,
  RewardAdded,
  RewardDenied,
  RewardMovedToController,
  RewardPaid,
  RewardRecirculated,
  RewardSentToController, Staked, StrategyAnnounced, StrategyChanged, Transfer, Withdraw, Withdrawn
} from "../generated/templates/VaultTemplate/VaultContract";
import { loadTvl } from "./types/Tvl";
import { createApyReward } from "./types/ApyReward";

// ******************************************************************************************************
//             TRANSFER
// ******************************************************************************************************

export function handleTransfer(event: Transfer): void  {
  loadTvl(event.address, event.block)
}

// ******************************************************************************************************
//             REWARD ADDED
// ******************************************************************************************************

export function handleRewardAdded(event: RewardAdded): void  {
  createApyReward(event.address, event.params.reward, event.params.rewardToken, event.block)
}

export function handleAddedRewardToken(event: AddedRewardToken): void  {

}

export function handleDeposit(event: Deposit): void  {

}

export function handleInvest(event: Invest): void  {

}

export function handleRemovedRewardToken(event: RemovedRewardToken): void  {

}

export function handleRewardDenied(event: RewardDenied): void  {

}

export function handleRewardMovedToController(event: RewardMovedToController): void  {

}

export function handleRewardPaid(event: RewardPaid): void  {

}

export function handleRewardRecirculated(event: RewardRecirculated): void  {

}

export function handleRewardSentToController(event: RewardSentToController): void  {

}

export function handleStaked(event: Staked): void  {

}

export function handleStrategyAnnounced(event: StrategyAnnounced): void  {

}

export function handleStrategyChanged(event: StrategyChanged): void  {

}

export function handleWithdraw(event: Withdraw): void  {

}

export function handleWithdrawn(event: Withdrawn): void  {

}