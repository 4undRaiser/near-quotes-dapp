import { context, u128, ContractPromiseBatch } from "near-sdk-as";
import { Quote, quoteStorage, Comment, likedStorage } from "./model";

/**
 * @dev This function will add a new quotes to the mapping
 */
export function addQuote(quote: Quote): void {
	let storedQuote = quoteStorage.get(quote.id);
	if (storedQuote !== null) {
		throw new Error(`a quote with id=${quote.id} already exists`);
	}
	assert(quote.description.length > 0, "Quote's text can't be empty");
	quoteStorage.set(quote.id, Quote.fromPayload(quote));
}

/**
 * @dev this function will return an a quote @index id
 */

export function getQuote(id: string): Quote | null {
	return quoteStorage.get(id);
}

/**
 *
 * @dev Returns all quotes in the mapping
 */
export function getQuotes(): Array<Quote> {
	return quoteStorage.values();
}

/**
 *  @dev faclitates users adding a comment to quote
 */
export function addComment(id: string, comment: Comment): void {
	let storedQuote = quoteStorage.get(id);
	if (storedQuote == null) {
		throw new Error(`a quote with id=${id} does not exists`);
	}
  assert(storedQuote.owner != context.sender, "You cannot comment on your own quote");
  assert(comment.commentDescription.length > 0, "Comment can't be empty");
	storedQuote.addComment(comment);
}

/**
 * @dev facilitates user liking a quote and supporting the author with any amount
 * @notice users can like a quote only once
 */
export function likeQuote(id: string): void {
	const quote = getQuote(id);
	const liked = likedStorage.get(context.sender);
	if (quote == null) {
		throw new Error("");
	}
	assert(quote.owner != context.sender, "can't like your own quote");
	if (liked == null) {
		likedStorage.set(context.sender, [id]);
	} else {
		assert(liked.indexOf(id) == -1, "Already liked");
		liked.push(id);
		likedStorage.set(context.sender, liked);
	}
	if (context.attachedDeposit > u128.Min) {
		ContractPromiseBatch.create(quote.owner).transfer(
			context.attachedDeposit
		);
	}
	quote.incrementLikes(context.attachedDeposit);
	quoteStorage.set(id, quote);
}
