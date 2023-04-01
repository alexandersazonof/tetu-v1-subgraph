import { Address, BigDecimal, BigInt, dataSource, ethereum, log } from "@graphprotocol/graph-ts";
import { TvlEntity } from "../../generated/schema";
import { fetchTotalSupply, loadOrCreateVault } from "./Vault";
import { getTokenPrice } from "../utils/PriceUtils";
import { BD_TEN } from "../utils/Constant";
import { pow } from "../utils/MathUtils";

export function loadTvl(address: Address, block: ethereum.Block): TvlEntity {
  const id = `${address.toHex()}-${block.number}`
  const vault = loadOrCreateVault(address, block);

  let tvlEntity = TvlEntity.load(id)
  if (tvlEntity == null) {
    const totalSupply = fetchTotalSupply(address)
    const price = getTokenPrice(address)
    let value = BigDecimal.zero()

    if (!price.equals(BigInt.zero())) {
      value =
        totalSupply
          .divDecimal(pow(BD_TEN, vault.decimals))
          .times(
            price
              .divDecimal(pow(BD_TEN, vault.decimals))
          )
    } else {
      log.warning("PRICE IS ZERO FOR {} VAULT", [vault.id]);
    }

    tvlEntity = new TvlEntity(id);
    tvlEntity.vault = address.toString()


    tvlEntity.totalSupply = totalSupply
    tvlEntity.price = price
    tvlEntity.value = value

    tvlEntity.createAtBlock = block.number
    tvlEntity.timestamp = block.timestamp
    tvlEntity.save()
  }
  return tvlEntity;
}