import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { StrategyEntity } from "../../generated/schema";
import { StrategyBalancerBPTContract } from "../../generated/templates/ControllerTemplate/StrategyBalancerBPTContract";
import { STRATEGY_SPLITTER_PLATFORM, UNDEFINED } from "../utils/Constant";
import { StrategySplitterContract } from "../../generated/Controller/StrategySplitterContract";
import { StrategySplitterTemplate } from "../../generated/templates";

export function loadOrCreateStrategy(address: Address, block: ethereum.Block): StrategyEntity {
  let strategy = StrategyEntity.load(address.toHex())
  if (strategy == null) {
    strategy = new StrategyEntity(address.toHex())

    strategy.platform = fetchPlatform(address)
    strategy.poolId = fetchPoolId(address);

    strategy.createAtBlock = block.number;
    strategy.timestamp = block.timestamp;
    strategy.name = fetchName(address)
    strategy.strategies = []

    if (strategy.poolId == STRATEGY_SPLITTER_PLATFORM) {
      updateStrategy(strategy, block)
      StrategySplitterTemplate.create(address);
    }
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

function fetchName(address: Address): string {
  const strategy = StrategyBalancerBPTContract.bind(address);
  const tryName = strategy.try_STRATEGY_NAME()
  return tryName.reverted ? UNDEFINED : tryName.value
}

export function fetchStrategies(address: Address): Address[] {
  const strategy = StrategySplitterContract.bind(address);
  const tryStrategies = strategy.try_allStrategies();
  return tryStrategies.reverted ? [] : tryStrategies.value
}

export function updateStrategy(strategy: StrategyEntity, block: ethereum.Block): void {
  const array: string[] = []
  const strategies = fetchStrategies(Address.fromString(strategy.id));
  for (let i=0;i<strategies.length;i++) {
    array.push(loadOrCreateStrategy(strategies[i], block).id)
  }
  strategy.strategies = array
  strategy.save()
}