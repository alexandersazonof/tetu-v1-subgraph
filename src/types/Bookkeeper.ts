import { Address, ethereum } from "@graphprotocol/graph-ts";
import { BookkeeperEntity } from "../../generated/schema";
import { BookkeeperTemplate } from "../../generated/templates";

export function loadOrCreateBookkeeper(address: Address, block: ethereum.Block): BookkeeperEntity {
  let bookkeeper = BookkeeperEntity.load(address.toHex())
  if (bookkeeper == null) {
    bookkeeper = new BookkeeperEntity(address.toHex())

    bookkeeper.createAtBlock = block.number
    bookkeeper.timestamp = block.timestamp
    bookkeeper.save()

    BookkeeperTemplate.create(address)
  }
  return bookkeeper
}