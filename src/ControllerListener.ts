import {
  ControllerTokenMoved, DistributorChanged, FundKeeperTokenMoved,
  HardWorkerAdded,
  HardWorkerRemoved, Minted, ProxyUpgraded,
  SharePriceChangeLog, StrategyTokenMoved,
  VaultAndStrategyAdded, VaultStrategyChanged, WhiteListStatusChanged
} from "../generated/Controller/ControllerContract";
import { loadOrCreateController } from "./types/Controller";
import { ControllerTemplate } from "../generated/templates";
import { loadOrCreateVault } from "./types/Vault";
import { createSharePriceChangeLog } from "./types/SharePriceChangeLog";
import { BigInt } from "@graphprotocol/graph-ts";
import { createApyAutoCompound } from "./types/ApyAutoCompound";

// ******************************************************************************************************
//             ADD NEW STRATEGY AND VAULT
// ******************************************************************************************************

export function handleVaultAndStrategyAdded(event: VaultAndStrategyAdded): void {
  loadOrCreateController(event.address, event.block);

  // create vault and strategy
  loadOrCreateVault(event.params.vault, event.block);
}

// ******************************************************************************************************
//             ADD NEW PROXY CONTROLLER
// ******************************************************************************************************

export function handleProxyUpgraded(event: ProxyUpgraded): void {
  const controller = loadOrCreateController(event.params.newLogic, event.block);
  controller.oldAddress = event.address.toString()
  controller.save();
  ControllerTemplate.create(event.params.newLogic);
}

// ******************************************************************************************************
//             DO HARD WORK COMPLETED AND PRICE PER FULL SHARE CHANGED
// ******************************************************************************************************

export function handleSharePriceChangeLog(event: SharePriceChangeLog): void {
  loadOrCreateController(event.address, event.block);

  const sharePrice = createSharePriceChangeLog(event.params.vault, event.params.strategy, event.params.oldSharePrice, event.params.newSharePrice, event.block)
  const vault = loadOrCreateVault(event.params.vault, event.block)

  if (sharePrice.oldSharePrice != sharePrice.newSharePrice && vault.lastShareTimestamp.ge(BigInt.zero())) {
    const differentShareTimestamp = event.params.timestamp.minus(vault.lastShareTimestamp)
    const differentSharePrice = event.params.newSharePrice.minus(event.params.oldSharePrice)

    createApyAutoCompound(vault, differentSharePrice, differentShareTimestamp, event.block)
  }

  vault.lastShareTimestamp = event.params.timestamp
  vault.save()
}


// ******************************************************************************************************
//             ADD/REMOVE HARD WORKERS
// ******************************************************************************************************

export function handleHardWorkerAdded(event: HardWorkerAdded): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

export function handleHardWorkerRemoved(event: HardWorkerRemoved): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

// ******************************************************************************************************
//             VAULT STRATEGY CHANGED
// ******************************************************************************************************

export function handleVaultStrategyChanged(event: VaultStrategyChanged): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

// ******************************************************************************************************
//             CONTRACT WHITELIST STATUS CHANGED
// ******************************************************************************************************

export function handleWhiteListStatusChanged(event: WhiteListStatusChanged): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

// ******************************************************************************************************
//             TOKENS MOVED TO GOVERNANCE
// ******************************************************************************************************

export function handleControllerTokenMoved(event: ControllerTokenMoved): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

export function handleStrategyTokenMoved(event: StrategyTokenMoved): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

export function handleFundKeeperTokenMoved(event: FundKeeperTokenMoved): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

// ******************************************************************************************************
//             MINTED
// ******************************************************************************************************

export function handleMinted(event: Minted): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}

// ******************************************************************************************************
//             DISTRIBUTOR CHANGED
// ******************************************************************************************************

export function handleDistributorChanged(event: DistributorChanged): void {
  loadOrCreateController(event.address, event.block);
  // TODO add logic
}