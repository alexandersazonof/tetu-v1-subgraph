import { VaultEntity, VaultHistoryEntity } from '../../generated/schema';
import { ethereum } from '@graphprotocol/graph-ts';

export function createVaultHistory(vault: VaultEntity, block: ethereum.Block): void {
  const id = `${vault.id}-${block.number.toString()}`
  let vaultHistory = VaultHistoryEntity.load(id);
  if (!vaultHistory) {
    vaultHistory = new VaultHistoryEntity(id);
    vaultHistory.decimals = vault.decimals;
    vaultHistory.name = vault.name;
    vaultHistory.symbol = vault.symbol;
    vaultHistory.active = vault.active;
    vaultHistory.underlying = vault.underlying;
    vaultHistory.strategy = vault.strategy;
    vaultHistory.lastShareTimestamp = vault.lastShareTimestamp;
    vaultHistory.userUniqueCount = vault.userUniqueCount;
    vaultHistory.userActiveCount = vault.userActiveCount;
    vaultHistory.rewardTokens = vault.rewardTokens;
    vaultHistory.assets = vault.assets;
    vaultHistory.totalUsers = vault.totalUsers;
    vaultHistory.tvl = vault.tvl
    vaultHistory.tvlUsd = vault.tvlUsd;
    vaultHistory.rewardsApr = vault.rewardsApr;
    vaultHistory.rewardTokensBal = vault.rewardTokensBal;
    vaultHistory.aprAutoCompound = vault.aprAutoCompound;
    vaultHistory.buyBackRatio = vault.buyBackRatio;
    vaultHistory.createAtBlock = block.number;
    vaultHistory.timestamp = block.timestamp;
    vaultHistory.save();
  }
}