import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { VaultEntity } from "../../generated/schema";
import { fetchDecimals, fetchName, fetchSymbol } from "../utils/ERC20";
import { VaultContract } from "../../generated/Controller/VaultContract";
import { loadOrCreateToken } from "./Token";
import { VaultTemplate } from "../../generated/templates";
import { BI_18, UNDEFINED } from "../utils/Constant";
import { getERC20Symbols } from "../utils/ContractUtils";


export function loadOrCreateVault(address: Address, block: ethereum.Block): VaultEntity {
  let vaultEntity = VaultEntity.load(address.toHex());
  if (vaultEntity == null) {
    vaultEntity = new VaultEntity(address.toHex());

    vaultEntity.decimals = fetchDecimals(address).toI32();
    vaultEntity.name = fetchVaultName(address)
    vaultEntity.symbol = fetchSymbol(address);

    vaultEntity.active = true;
    vaultEntity.underlying = loadOrCreateToken(fetchUnderlying(address), block).id;
    // vaultEntity.strategy = loadOrCreateStrategy(fetchStrategy(address), block).id;

    vaultEntity.lastShareTimestamp = BigInt.zero()

    vaultEntity.createAtBlock = block.number;
    vaultEntity.timestamp = block.timestamp;
    vaultEntity.userUniqueCount = BigInt.zero()
    vaultEntity.userActiveCount = BigInt.zero()
    vaultEntity.save();

    VaultTemplate.create(address);
  }
  return vaultEntity;
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