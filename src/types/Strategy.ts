import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { StrategyEntity } from "../../generated/schema";
import { StrategyBalancerBPTContract } from "../../generated/templates/ControllerTemplate/StrategyBalancerBPTContract";
import { UNDEFINED } from "../utils/Constant";

export function loadOrCreateStrategy(address: Address, block: ethereum.Block): StrategyEntity {
  let strategy = StrategyEntity.load(address.toHex())
  if (strategy == null) {
    strategy = new StrategyEntity(address.toHex())

    strategy.platform = fetchPlatform(address)
    strategy.poolId = fetchPoolId(address);

    strategy.createAtBlock = block.number;
    strategy.timestamp = block.timestamp;
    strategy.save();
  }
  return strategy;
}

function fetchPlatform(address: Address): BigInt {
  const strategy = StrategyBalancerBPTContract.bind(address)
  const tryPlatform = strategy.try_platform()
  return tryPlatform.reverted ? BigInt.zero() : BigInt.fromI32(tryPlatform.value)
}

function fetchPoolId(address: Address): string {
  const strategy = StrategyBalancerBPTContract.bind(address);
  const tryPoolId = strategy.try_poolId();
  return tryPoolId.reverted ? UNDEFINED : tryPoolId.value.toHex();
}