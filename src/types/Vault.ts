import { Address, BigDecimal, BigInt, ethereum, log } from '@graphprotocol/graph-ts';
import { VaultEntity, VaultLogHistoryEntity } from "../../generated/schema";
import { fetchDecimals, fetchName, fetchSymbol } from "../utils/ERC20";
import { VaultContract } from "../../generated/Controller/VaultContract";
import { loadOrCreateBatchToken, loadOrCreateToken } from './Token';
import { VaultTemplate } from "../../generated/templates";
import { BI_18, UNDEFINED } from "../utils/Constant";
import { getERC20Symbols } from "../utils/ContractUtils";
import { fetchBuyBackRation, loadOrCreateStrategy } from './Strategy';
import {
  fetchAssets,
  fetchRewardApr,
  fetchRewardTokensBal,
  fetchTvl,
  fetchTvlUsd,
  fetchUsers,
} from '../utils/ContractReader';
import { createVaultHistory } from './VaultHistory';


export function loadOrCreateVault(address: Address, block: ethereum.Block): VaultEntity {
  let vaultEntity = VaultEntity.load(address.toHex());
  if (vaultEntity == null) {
    vaultEntity = new VaultEntity(address.toHex());

    vaultEntity.decimals = fetchDecimals(address).toI32();
    vaultEntity.name = fetchVaultName(address)
    vaultEntity.symbol = fetchSymbol(address);

    vaultEntity.active = true;
    vaultEntity.underlying = loadOrCreateToken(fetchUnderlying(address), block).id;
    vaultEntity.strategy = loadOrCreateStrategy(fetchStrategy(address), block).id;

    vaultEntity.lastShareTimestamp = BigInt.zero()

    vaultEntity.createAtBlock = block.number;
    vaultEntity.timestamp = block.timestamp;
    vaultEntity.userUniqueCount = BigInt.zero()
    vaultEntity.userActiveCount = BigInt.zero()

    vaultEntity.rewardTokens = loadOrCreateBatchToken(fetchRewardTokens(address), block);
    vaultEntity.assets = loadOrCreateBatchToken(fetchAssets(Address.fromString(vaultEntity.strategy)), block);

    vaultEntity.totalUsers = BigInt.zero();
    vaultEntity.tvl = BigInt.zero();
    vaultEntity.tvlUsd = BigInt.zero();
    vaultEntity.rewardsApr = [];
    vaultEntity.rewardTokensBal = [];
    vaultEntity.aprAutoCompound = BigDecimal.zero();
    vaultEntity.buyBackRatio = fetchBuyBackRation(Address.fromString(vaultEntity.strategy))

    vaultEntity.save();

    VaultTemplate.create(address);
  } else {
    // check is activated
    isActivatedVault(vaultEntity, block);

    vaultEntity.name = fetchName(Address.fromString(vaultEntity.id))

    vaultEntity.rewardTokens = loadOrCreateBatchToken(fetchRewardTokens(address), block);
    vaultEntity.assets = loadOrCreateBatchToken(fetchAssets(Address.fromString(vaultEntity.strategy)), block);

    vaultEntity.totalUsers = fetchUsers(address);
    vaultEntity.tvl = fetchTvl(address);
    vaultEntity.tvlUsd = fetchTvlUsd(address);
    vaultEntity.rewardsApr = fetchRewardApr(address);
    vaultEntity.rewardTokensBal = fetchRewardTokensBal(address);
    vaultEntity.buyBackRatio = fetchBuyBackRation(Address.fromString(vaultEntity.strategy));


    vaultEntity.save()
  }

  createVaultHistory(vaultEntity, block);

  return vaultEntity;
}

export function isActivatedVault(vault: VaultEntity, block: ethereum.Block): void {
  const id = `${vault.id}-${block.number}`
  let log = VaultLogHistoryEntity.load(id)
  if (log == null) {
    const active = fetchActive(Address.fromString(vault.id))
    log = new VaultLogHistoryEntity(id);

    log.vault = vault.id
    log.active = active

    log.createAtBlock = block.number
    log.timestamp = block.timestamp
    log.save()

    vault.active = active
    vault.save()
  }
}

export function fetchActive(address: Address): boolean {
  const vault = VaultContract.bind(address)
  const tryActive = vault.try_active()
  return tryActive.reverted ? false : tryActive.value;
}

export function fetchTotalSupply(address: Address): BigInt {
  const vault = VaultContract.bind(address);
  const tryTotalSupply = vault.try_totalSupply()
  return tryTotalSupply.reverted ? BigInt.zero() : tryTotalSupply.value;
}

function fetchRewardTokens(address: Address): Address[] {
  const vault = VaultContract.bind(address);
  const tryRewardTokens = vault.try_rewardTokens();
  return tryRewardTokens.reverted ? [] : tryRewardTokens.value;
}

function fetchUnderlying(address: Address): Address {
  const vault = VaultContract.bind(address);
  const tryUnderlying = vault.try_underlying();
  return tryUnderlying.reverted ? Address.zero() : tryUnderlying.value;
}

function fetchStrategy(address: Address): Address {
  const vault = VaultContract.bind(address);
  const tryStrategy = vault.try_strategy();
  return tryStrategy.reverted ? Address.zero() : tryStrategy.value;
}

export function fetchPeriodFinishForToken(address: Address, value: Address): BigInt {
  const vault = VaultContract.bind(address);
  const tryPeriodFinish = vault.try_periodFinishForToken(value)
  return tryPeriodFinish.reverted ? BigInt.zero() : tryPeriodFinish.value
}

export function fetchRewardRateForToken(address: Address, value: Address): BigInt {
  const vault = VaultContract.bind(address)
  const tryRewardRateForToken = vault.try_rewardRateForToken(value)
  return tryRewardRateForToken.reverted ? BigInt.zero() : tryRewardRateForToken.value
}

export function fetchSharePrice(address: Address): BigInt {
  const vault = VaultContract.bind(address)
  const trySharePrice = vault.try_getPricePerFullShare();
  return trySharePrice.reverted ? BI_18 : trySharePrice.value
}

export function fetchVaultName(address: Address): string {
  const values = getERC20Symbols([address])

  if (values.length == 0) {
    return fetchName(address)
  }

  return values[0]
}