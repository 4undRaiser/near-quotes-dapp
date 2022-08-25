import { context, u128, ContractPromiseBatch} from "near-sdk-as";
import { Quote, quoteStorage, Comment, } from './model';



/**
 * This function will add a new quotes to the mapping
 */
 export function addQuote(quote: Quote): void {
  let storedQuote = quoteStorage.get(quote.id);
  if (storedQuote !== null) {
      throw new Error(`a quote with id=${quote.id} already exists`);
  }
  quoteStorage.set(quote.id, Quote.fromPayload(quote));
}

/**
 * this function will return an a quote @index id
 */
 
 export function getQuote(id: string): Quote | null {
  return quoteStorage.get(id);
}

/**
* 
* Returns all quotes in the mapping
*/
export function getQuotes(): Array<Quote> {
  return quoteStorage.values();
}


// faclitates users adding a comment to quote

export function addComment(id: string, comment: Comment): void {
  let storedQuote = quoteStorage.get(id);
  if (storedQuote == null) {
      throw new Error(`a quote with id=${id} does not exists`);
  }
  if (storedQuote.owner == context.sender ){
    throw new Error(" You cannot comment on your own quote")
  }
  storedQuote.comments.push(comment);
}
  

// facilitates user liking a quote and supporting the author with any ammount
export function likeQuote(id: string): void {
  const quote = getQuote(id);
  if (quote == null) {
      throw new Error("quote not found");
  }

  if (quote.owner == context.sender) {
    throw new Error("can't like your own quote");
}

  ContractPromiseBatch.create(quote.owner).transfer(context.attachedDeposit);
  quote.incrementLikes();
  quoteStorage.set(id, quote);
}
