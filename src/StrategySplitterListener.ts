import {
  StrategyAdded,
  StrategyRemoved
} from "../generated/templates/StrategySplitterTemplate/StrategySplitterContract";
import { fetchStrategies, loadOrCreateStrategy, updateStrategy } from "./types/Strategy";

export function handleStrategyAdded(event: StrategyAdded): void {
  const strategy = loadOrCreateStrategy(event.address, event.block)
  updateStrategy(strategy, event.block)
}

export function handleStrategyRemoved(event: StrategyRemoved): void {
  const strategy = loadOrCreateStrategy(event.address, event.block)
  updateStrategy(strategy, event.block)

}