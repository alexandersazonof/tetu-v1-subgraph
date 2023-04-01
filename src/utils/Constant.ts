import { Address, BigDecimal, dataSource, log } from "@graphprotocol/graph-ts";

export const UNDEFINED = 'Undefined';
export const BD_TEN = BigDecimal.fromString('10');

export const BD_ONE_HUNDRED = BigDecimal.fromString('100')
export const SECONDS_OF_YEAR = BigDecimal.fromString('31557600');
export const YEAR_PERIOD = BigDecimal.fromString('365')
export const BD_ONE = BigDecimal.fromString('1')



export function getPriceCalculator(): Address {
  if (dataSource.network() == 'mainnet') {
    return Address.fromString("0x3E75231c1cc0E6D30d03346B3B87B92Bb3a1F856");
  } else if (dataSource.network() == 'matic') {
    return Address.fromString("0x0B62ad43837A69Ad60289EEea7C6e907e759F6E8");
  }
  log.warning("NO PRICE CALCULATOR ON NETWORK {}", [dataSource.network()]);
  return Address.zero()
}


