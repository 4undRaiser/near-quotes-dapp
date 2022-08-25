import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function createQuote(quote) {
  quote.id = uuid4();
  return window.contract.addQuote({ quote });
}

export function addComment(id, comment) {
  return window.contract.addComment({id, comment }, GAS);
}


export function getQuotess() {
  return window.contract.getQuotes();
}

export async function likeQuote({ id, ammount }) {
  const _ammount = parseNearAmount(ammount + "");
  await window.contract.likeQuote({ id: id }, GAS, _ammount);
}
