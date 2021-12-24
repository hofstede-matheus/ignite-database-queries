import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private gamesRepository: Repository<Game>;

  constructor() {
    this.repository = getRepository(User);
    this.gamesRepository = getRepository(Game)
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(user_id, {relations: ["games"]});
    // const gamesOfUser = await this.repository
    

    if (!user) throw new Error("User not find")
    return user 
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      select * 
        from users 
      ORDER by first_name;
    `); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      select * 
        from users
      where LOWER(first_name) = LOWER($1)
      AND LOWER(last_name) = LOWER($2)
    `, [first_name, last_name]); // Complete usando raw query
  }
}
