import { BigDecimal } from "@graphprotocol/graph-ts";
import { BD_ONE, BD_ONE_HUNDRED, SECONDS_OF_YEAR, YEAR_PERIOD } from "./Constant";
import { pow } from "./MathUtils";

export function calculateAprAutoCompound(diffSharePrice: BigDecimal, diffTimestamp: BigDecimal): BigDecimal {
  if (diffTimestamp.equals(BigDecimal.zero()) || diffTimestamp.equals(BigDecimal.zero())) {
    return BigDecimal.zero()
  }
  return diffSharePrice.div(diffTimestamp).times(BD_ONE_HUNDRED).times(SECONDS_OF_YEAR)
}

export function calculateApy(apr: BigDecimal): BigDecimal {
  if (BigDecimal.compare(BigDecimal.zero(), apr) == 0) {
    return apr
  }
  let tempValue: BigDecimal = apr.div(BD_ONE_HUNDRED)
    .div(YEAR_PERIOD)
    .plus(BD_ONE);

  tempValue = pow(tempValue, 365)
  return tempValue
    .minus(BD_ONE)
    .times(BD_ONE_HUNDRED)
}

export function calculateApr(period: BigDecimal, reward: BigDecimal, tvl: BigDecimal): BigDecimal {
  if (BigDecimal.compare(BigDecimal.zero(), tvl) == 0 || BigDecimal.compare(reward, BigDecimal.zero()) == 0) {
    return BigDecimal.zero()
  }
  const ratio = SECONDS_OF_YEAR.div(period);
  const tempValue = reward.div(tvl)
  return tempValue.times(ratio).times(BD_ONE_HUNDRED)
}