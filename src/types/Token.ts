import { Address, ethereum } from "@graphprotocol/graph-ts";
import { TokenEntity } from "../../generated/schema";
import { fetchDecimals, fetchName } from "../utils/ERC20";

export function loadOrCreateToken(address: Address, block: ethereum.Block): TokenEntity {
  let token = TokenEntity.load(address.toHex())
  if (token == null) {
    token = new TokenEntity(address.toHex());

    token.decimals = fetchDecimals(address).toI32()
    token.name = fetchName(address)

    token.createAtBlock = block.number;
    token.timestamp = block.timestamp;
    token.save();
  }
  return token;
}