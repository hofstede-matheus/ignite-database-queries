import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private userRepository: Repository<User>;


  constructor() {
    this.repository = getRepository(Game);
    this.userRepository = getRepository(User)
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const result = await this.repository
    .createQueryBuilder("games")
    .where("LOWER(games.title) ILIKE :query", {query: `%${ param.toLowerCase() }%`})
    .getMany();
    return result
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("select count(id) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const result = await this.userRepository
      .createQueryBuilder("users")
      // .select(["users.id", "users.first_name", "users.last_name", "users.email", "users.created_at", "users.updated_at"])
      .innerJoin("users_games_games", "ugg", "users.id = ugg.usersId")
      .innerJoin("games", "g", "g.id = ugg.gamesId")
      .where("g.id = :id", {id})
      .getMany();
    return result; 
  }
}
