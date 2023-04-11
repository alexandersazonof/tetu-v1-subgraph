import {
  RegisterStrategyEarned,
  RegisterUserEarned, RegisterVault, RemoveVault
} from "../generated/templates/BookkeeperTemplate/BookkeeperContract";
import { fetchVault, loadOrCreateStrategy } from "./types/Strategy";
import { StrategyEarnedEntity, UserEarnedEntity, VaultLogHistoryEntity } from "../generated/schema";
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

// ******************************************************************************************************
//             USER EARNED
// ******************************************************************************************************

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

// ******************************************************************************************************
//             REMOVE VAULT
// ******************************************************************************************************

export function handleRemoveVault(event: RemoveVault): void {
  const vault = loadOrCreateVault(event.params.value, event.block)
  vault.active = false
  vault.save()

  const id = `${vault.id}-${event.transaction.hash.toHex()}`
  let log = VaultLogHistoryEntity.load(id)
  if (log == null) {
    log = new VaultLogHistoryEntity(id);

    log.vault = vault.id
    log.active = false

    log.createAtBlock = event.block.number
    log.timestamp = event.block.timestamp
    log.save()
  }
}

// ******************************************************************************************************
//             ACTIVATE VAULT
// ******************************************************************************************************

export function handleRegisterVault(event: RegisterVault): void {
  const vault = loadOrCreateVault(event.params.value, event.block)
  vault.active = true
  vault.save()

  const id = `${vault.id}-${event.transaction.hash.toHex()}`
  let log = VaultLogHistoryEntity.load(id)
  if (log == null) {
    log = new VaultLogHistoryEntity(id);

    log.vault = vault.id
    log.active = true

    log.createAtBlock = event.block.number
    log.timestamp = event.block.timestamp
    log.save()
  }
}