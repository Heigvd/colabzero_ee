export interface Card {
    "@class": "Card";
    id?: number;
    revision: number;
    externalId: string;
    creationTime: number;
    content: string;
}
export interface User {
    "@class": "User";
    id?: number;
    username: string;
    displayName: string;
}
export interface MicroAdd {
    t: 'I';
    o: number;
    v: string;
}
export interface MicroRem {
    t: 'D';
    o: number;
    l: number;
}
export declare type MicroChange = MicroAdd | MicroRem;
export interface Change {
    atClass?: string;
    atId?: number;
    basedOn: string;
    newRevision: string;
    liveSession: string;
    changes: MicroChange[];
}
export declare function getCards(): Promise<Card[]>;
export declare function getCard(id: number): Promise<Card>;
export declare function createCard(card: Card): Promise<number>;
export declare function updateCard(card: Card): Promise<void>;
export declare function patchCard(card: Card, change: Change): Promise<void>;
export declare function deleteCard(id: number): Promise<number>;
/**
 * CHANGES
 */
export declare function getChanges(): Promise<Change[]>;
/**
 * User API
 */
export declare function getUsers(): Promise<User[]>;
export declare function createUser(user: User): Promise<number>;
export declare function updateUser(user: User): Promise<void>;
