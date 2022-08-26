import { PersistentUnorderedMap, context, PersistentSet, u128 } from "near-sdk-as";


@nearBindgen
export class Quote {
    id: string;
    description: string;
    owner: string;
    likes: u32;
    comments: Array<Comment>;

    public static fromPayload(payload: Quote): Quote {
        const quote = new Quote();
        quote.id = payload.id;
        quote.description = payload.description;
        quote.owner = context.sender;
        quote.comments = [];
        quote.likes = 0;
        return quote;
    }

    public incrementLikes(): void {
        this.likes++;
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



export const quoteStorage = new PersistentUnorderedMap<string, Quote>("LISTED_QUOTES");

export const likeStorage = new PersistentSet<string>("LIKED_USERS");

export const GAS_FEE: u128 = u128.from("100000000000000");