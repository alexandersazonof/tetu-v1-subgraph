import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { loadOrCreateVault } from "./Vault";
import { VaultActiveUserEntity, VaultUniqueUserCountEntity, VaultUniqueUserEntity } from "../../generated/schema";
import { fetchBalance } from "../utils/ERC20";

export function createUniqueUser(
  vaultAddress: Address,
  userAddress: Address,
  tx: ethereum.Transaction,
  block: ethereum.Block
  ): VaultUniqueUserEntity {
  const id = `${vaultAddress.toHex()}-${userAddress.toHex()}`
  let userUnique = VaultUniqueUserEntity.load(id)
  if (userUnique == null) {
    createUniqueCountUser(vaultAddress, userAddress, tx, block)

    userUnique = new VaultUniqueUserEntity(id)

    userUnique.vault = vaultAddress.toHex()

    userUnique.timestamp = block.timestamp
    userUnique.createAtBlock = block.number
    userUnique.save()
  }
  return userUnique;
}

function createUniqueCountUser(
  vaultAddress: Address,
  userAddress: Address,
  tx: ethereum.Transaction,
  block: ethereum.Block
): void {
  const vault = loadOrCreateVault(vaultAddress, block)
  const id = `${vault.id}-${userAddress.toHex()}-${tx.hash.toHex()}`
  let userCount = VaultUniqueUserCountEntity.load(id)
  if (userCount == null) {
    vault.userUniqueCount = vault.userUniqueCount.plus(BigInt.fromI32(1))
    vault.save()

    userCount = new VaultUniqueUserCountEntity(id);

    userCount.vault = vault.id
    userCount.value = vault.userUniqueCount

    userCount.timestamp = block.timestamp
    userCount.createAtBlock = block.number
    userCount.save()
  }
}

export function loadActiveUser(
  vaultAddress: Address,
  userAddress: Address,
  tx: ethereum.Transaction,
  block: ethereum.Block
): VaultActiveUserEntity {
  const id = `${vaultAddress.toHex()}-${userAddress.toHex()}`
  let userActive = VaultActiveUserEntity.load(id)
  if (userActive == null) {
    createActiveUserCount(vaultAddress, userAddress, tx, block, true)
    userActive = new VaultActiveUserEntity(id)

    userActive.active = true
    userActive.vault = vaultAddress.toHex()
    userActive.timestamp = block.timestamp
    userActive.createAtBlock = block.number
    userActive.save()
  }

  const balance = fetchBalance(vaultAddress, userAddress)
  if (balance.equals(BigInt.zero())) {
    createActiveUserCount(vaultAddress, userAddress, tx, block, false)
    userActive.active = false
    userActive.save()
  } else if (!userActive.active && balance.gt(BigInt.zero())) {
    createActiveUserCount(vaultAddress, userAddress, tx, block, true)
    userActive.active = true
    userActive.save()
  }


  return userActive
}

function createActiveUserCount(
  vaultAddress: Address,
  userAddress: Address,
  tx: ethereum.Transaction,
  block: ethereum.Block,
  plus: boolean
): void {
  const vault = loadOrCreateVault(vaultAddress, block)
  const id = `${vault.id}-${userAddress.toHex()}-${tx.hash.toHex()}`
  let userCount = VaultUniqueUserCountEntity.load(id)
  if (userCount == null) {
    vault.userUniqueCount = plus
      ? vault.userActiveCount.plus(BigInt.fromI32(1))
      : vault.userActiveCount.minus(BigInt.fromI32(1))

    vault.save()

    userCount = new VaultUniqueUserCountEntity(id);

    userCount.vault = vault.id
    userCount.value = vault.userUniqueCount

    userCount.timestamp = block.timestamp
    userCount.createAtBlock = block.number
    userCount.save()
  }
}