import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { TvlEntity } from "../../generated/schema";
import { fetchSharePrice, fetchTotalSupply, loadOrCreateVault } from "./Vault";
import { getTokenPrice } from "../utils/PriceUtils";
import { BD_18, BD_TEN } from "../utils/Constant";
import { pow } from "../utils/MathUtils";

export function loadTvl(address: Address, block: ethereum.Block): TvlEntity {
  const id = `${address.toHex()}-${block.number}`
  const vault = loadOrCreateVault(address, block);

  let tvlEntity = TvlEntity.load(id)
  if (tvlEntity == null) {
    const totalSupply = fetchTotalSupply(address)
    const price = getTokenPrice(address)
    const ppfs = fetchSharePrice(address)
    let value = BigDecimal.zero()

    if (!price.equals(BigInt.zero())) {
      value =
        totalSupply
          .divDecimal(pow(BD_TEN, vault.decimals))
          .times(
            price
              .divDecimal(BD_18)
          )
          .times(
            ppfs
              .divDecimal(pow(BD_TEN, vault.decimals))
          )
    } else {
      log.warning("PRICE IS ZERO FOR {} VAULT", [vault.id]);
    }

    tvlEntity = new TvlEntity(id);
    tvlEntity.vault = vault.id


    tvlEntity.totalSupply = totalSupply
    tvlEntity.price = price
    tvlEntity.value = value
    tvlEntity.ppfs = ppfs

    tvlEntity.createAtBlock = block.number
    tvlEntity.timestamp = block.timestamp
    tvlEntity.save()
  }
  return tvlEntity;
}