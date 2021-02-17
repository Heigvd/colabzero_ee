import { User } from '.';
export declare const findUser: (users: User[], username?: string | null | undefined) => User | undefined;
export declare const getDisplayName: (users: User[], username: string) => string;
