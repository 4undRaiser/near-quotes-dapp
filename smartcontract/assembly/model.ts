import { PersistentUnorderedMap, context, PersistentMap, u128 } from "near-sdk-as";


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
        return quote;
    }

    public incrementLikes(): void {
        this.likes = this.likes + 1;
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
//export const commentStorage = new PersistentUnorderedMap<string, Array<Comment>>("COMMENTS");
