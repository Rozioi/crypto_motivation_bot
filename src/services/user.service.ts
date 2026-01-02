import { UserRepo } from "../db/repositories/user.repo";

export const UserService = {
  getOrCreate: (telegramId: string, username: string) => {
    let user = UserRepo.getByTelegramId(telegramId);

    if (!user) {
      UserRepo.createUser(telegramId, username);
      user = UserRepo.getByTelegramId(telegramId);
    }
    return user;
  },
};
