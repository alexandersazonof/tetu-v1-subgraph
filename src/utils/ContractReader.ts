import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ContractReaderContract } from '../../generated/Controller/ContractReaderContract';
import { getContractReader } from './Constant';


export function fetchAssets(strategy: Address): Address[] {
  const contractReader = ContractReaderContract.bind(getContractReader())
  const tryStrategy = contractReader.try_strategyAssets(strategy)
  return tryStrategy.reverted ? [] : tryStrategy.value;
}

export function fetchUsers(vault: Address): BigInt {
  const contractReader = ContractReaderContract.bind(getContractReader())
  const tryVaultUsers = contractReader.try_vaultUsers(vault)
  return tryVaultUsers.reverted ? BigInt.zero() : tryVaultUsers.value;
}

export function fetchTvl(vault: Address): BigInt {
  const contractReader = ContractReaderContract.bind(getContractReader())
  const tryVaultTvl = contractReader.try_vaultTvl(vault)
  return tryVaultTvl.reverted ? BigInt.zero() : tryVaultTvl.value;
}

export function fetchTvlUsd(vault: Address): BigInt {
  const contractReader = ContractReaderContract.bind(getContractReader())
  const tryVal = contractReader.try_vaultTvlUsdc(vault)
  return tryVal.reverted ? BigInt.zero() : tryVal.value;
}

export function fetchRewardApr(vault: Address): BigInt[] {
  const contractReader = ContractReaderContract.bind(getContractReader())
  const tryVal = contractReader.try_vaultRewardsApr(vault)
  return tryVal.reverted ? [] : tryVal.value;
}

export function fetchRewardTokensBal(vault: Address): BigInt[] {
  const contractReader = ContractReaderContract.bind(getContractReader())
  const tryVal = contractReader.try_vaultRewardTokensBal(vault)
  return tryVal.reverted ? [] : tryVal.value;
}