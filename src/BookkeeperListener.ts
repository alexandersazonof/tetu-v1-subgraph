import {
  RegisterStrategyEarned,
  RegisterUserEarned
} from "../generated/templates/BookkeeperTemplate/BookkeeperContract";
import { fetchVault, loadOrCreateStrategy } from "./types/Strategy";
import { StrategyEarnedEntity, UserEarnedEntity } from "../generated/schema";
import { getTokenPrice } from "./utils/PriceUtils";
import { getTetuToken } from "./utils/Constant";
import { loadOrCreateVault } from "./types/Vault";
import { loadOrCreateToken } from "./types/Token";


// ******************************************************************************************************
//             STRATEGY EARNED
// ******************************************************************************************************

export function handleRegisterStrategyEarned(event: RegisterStrategyEarned): void {
  const id = `${event.params.strategy.toHex()}-${event.transaction.hash.toHex()}`
  let strategyEarned = StrategyEarnedEntity.load(id)
  if (strategyEarned == null) {
    strategyEarned = new StrategyEarnedEntity(id)

    strategyEarned.amount = event.params.amount
    strategyEarned.strategy = loadOrCreateStrategy(event.params.strategy, event.block).id
    strategyEarned.tetuPrice = getTokenPrice(getTetuToken())
    strategyEarned.vault = loadOrCreateVault(fetchVault(event.params.strategy), event.block).id
    strategyEarned.createAtBlock = event.block.number
    strategyEarned.timestamp = event.block.timestamp
    strategyEarned.save()
  }
}

export function handlerRegisterUserEarned(event: RegisterUserEarned): void {
  const id = `${event.params.user.toHex()}-${event.transaction.hash.toHex()}`
  let userEarned = UserEarnedEntity.load(id)
  if (userEarned == null) {
    userEarned = new UserEarnedEntity(id)

    userEarned.user = event.params.user.toHex()
    userEarned.vault = loadOrCreateVault(event.params.vault, event.block).id
    userEarned.token = loadOrCreateToken(event.params.token, event.block).id
    userEarned.amount = event.params.amount
    userEarned.tokenPrice = getTokenPrice(event.params.token)

    userEarned.createAtBlock = event.block.number
    userEarned.timestamp = event.block.timestamp
    userEarned.save()
  }
}