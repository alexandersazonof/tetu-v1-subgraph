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

export function handleTransfer(event: Transfer) {
  loadTvl(event.address, event.block)
}

// ******************************************************************************************************
//             REWARD ADDED
// ******************************************************************************************************

export function handleRewardAdded(event: RewardAdded) {
  createApyReward(event.address, event.params.reward, event.params.rewardToken, event.block)
}

export function handleAddedRewardToken(event: AddedRewardToken) {

}

export function handleDeposit(event: Deposit) {

}

export function handleInvest(event: Invest) {

}

export function handleRemovedRewardToken(event: RemovedRewardToken) {

}

export function handleRewardDenied(event: RewardDenied) {

}

export function handleRewardMovedToController(event: RewardMovedToController) {

}

export function handleRewardPaid(event: RewardPaid) {

}

export function handleRewardRecirculated(event: RewardRecirculated) {

}

export function handleRewardSentToController(event: RewardSentToController) {

}

export function handleStaked(event: Staked) {

}

export function handleStrategyAnnounced(event: StrategyAnnounced) {

}

export function handleStrategyChanged(event: StrategyChanged) {

}

export function handleWithdraw(event: Withdraw) {

}

export function handleWithdrawn(event: Withdrawn) {

}