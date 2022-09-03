import { context, u128, ContractPromiseBatch} from "near-sdk-as";
import {Quote, quoteStorage, Comment, GAS_FEE, userLikeStorage,} from './model';



/**
 * This function will add a new quotes to the mapping
 * @param quote Quote details object
 */
 export function addQuote(quote: Quote): void {
  let storedQuote = quoteStorage.get(quote.id);
  if (storedQuote !== null) {
      throw new Error(`A quote with id=${quote.id} already exists`);
  }
  quoteStorage.set(quote.id, Quote.fromPayload(quote));
}

/**
 * this function will return a quote @index id
 * @param id ID of the quote
 * @return Quote details if it exits, otherwise null
 */
 
 export function getQuote(id: string): Quote | null {
  return quoteStorage.get(id);
}

/**
 *
 * Returns all quotes in the mapping
 * @return Quotes Array
 */
export function getQuotes(): Array<Quote> {
  return quoteStorage.values();
}


/**
 * Facilitates users adding a comment to quote
 * @param id Quote ID which user needs to add a comment
 * @param comment Comment details
 */
export function addComment(id: string, comment: Comment): void {
  let storedQuote = quoteStorage.get(id);
  if (storedQuote == null) {
      throw new Error(`A quote with id=${id} does not exists`);
  }
  if (storedQuote.owner == context.sender ){
    throw new Error(" You cannot comment on your own quote")
  }
  const savedComment = Comment.fromPayload(comment);
  storedQuote.addComment(savedComment);

  quoteStorage.set(id, storedQuote);
}
  

/**
 * Facilitates user liking a quote and supporting the author with any amount
 * @param id Quote ID which user needs to add a like
 */
export function likeQuote(id: string): void {
  const quote = getQuote(id);
  if (quote == null) {
      throw new Error("Quote not found");
  }

  if (u128.ge(GAS_FEE, context.attachedDeposit)) {
      throw new Error("Insufficient amount")
  }

  if (quote.owner == context.sender) {
    throw new Error("Can't like your own quote");
  }

  let userLikes = userLikeStorage.get(context.sender);
  if(userLikes == null){
      userLikes = [];
  }

  if(userLikes.includes(id)){
      throw new Error("You have already liked the comment")
  }

  ContractPromiseBatch.create(quote.owner).transfer(context.attachedDeposit);
  quote.incrementLikes();

  quoteStorage.set(id, quote);

  userLikes.push(id);
  userLikeStorage.set(context.sender,userLikes);
}

/**
 *
 * Returns all the like details for the logged-in user
 * @return ID
 */
export function getUserLikes(): Array<string> {
    let userLikes = userLikeStorage.get(context.sender);
    if(userLikes == null) {
        return [];
    }

    return userLikes;
}
