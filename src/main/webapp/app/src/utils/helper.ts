import {User} from '../API/client';

export const findUser = (users: User[], username?: string | null) => {
  return users.find((u) => u.username === username);
}

export const getDisplayName = (users: User[], username: string) => {
  const user = findUser(users, username);
  if (user) {
    return user.displayName;
  } else {
    return "???";
  }
}