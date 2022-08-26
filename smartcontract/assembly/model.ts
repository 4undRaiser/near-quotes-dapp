import { PersistentUnorderedMap, context, u128 } from "near-sdk-as";

@nearBindgen
export class Quote {
	id: string;
	description: string;
	owner: string;
	likes: u32;
	comments: Array<Comment>;
    donations: u128;
	public static fromPayload(payload: Quote): Quote {
		const quote = new Quote();
		quote.id = payload.id;
		quote.description = payload.description;
		quote.owner = context.sender;
        quote.likes = 0;
		quote.comments = [];
        quote.donations = u128.Zero;
		return quote;
	}

	public incrementLikes(donation: u128): void {
		this.likes = this.likes + 1;
        this.donations = u128.add(this.donations, donation);
	}

	public addComment(comment: Comment): void {
		this.comments.push(comment);
	}
}

@nearBindgen
export class Comment {
	commentDescription: string;
	owner: string;

	public static fromPayload(payload: Comment): Comment {
		const comment = new Comment();
		comment.commentDescription = payload.commentDescription;
		comment.owner = context.sender;
		return comment;
	}
}

export const quoteStorage = new PersistentUnorderedMap<string, Quote>(
	"LISTED_QUOTES"
);

export const likedStorage = new PersistentUnorderedMap<string, Array<string>>(
	"USERS_LIKED"
);
