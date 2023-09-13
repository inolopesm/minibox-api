import type { Person } from "../entities/Person";
import type { Team } from "../entities/Team";
import type { PersonRepository } from "../repositories/PersonRepository";
import type { TeamRepository } from "../repositories/TeamRepository";

export class PersonService {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly teamRepository: TeamRepository,
  ) {}

  async find(
    name: string | undefined = "",
    teamId: number | undefined,
  ): Promise<Array<Person & { team: Team }>> {
    const people =
      teamId === undefined
        ? await this.personRepository.findILikeName(name)
        : await this.personRepository.findILikeNameAndByTeamId(name, teamId);

    const peopleWithTeam = new Array<Person & { team: Team }>();

    for (const person of people) {
      const team = await this.teamRepository.findOneById(person.teamId);

      if (team === null) {
        throw new Error(`Team (${person.teamId})`);
      }

      peopleWithTeam.push({ ...person, team });
    }

    return peopleWithTeam;
  }

  async findOne(id: number): Promise<Person | Error> {
    const person = await this.personRepository.findOneById(id);

    if (person === null) {
      return new Error("Produto não encontrado");
    }

    return person;
  }

  async create(name: string, teamId: number): Promise<Error | null> {
    const count = await this.teamRepository.countById(teamId);

    if (count === 0) {
      return new Error("Equipe não encontrada");
    }

    await this.personRepository.create(name, teamId);

    return null;
  }

  async update({
    name,
    teamId,
    id,
  }: {
    name: string;
    teamId: number;
    id: number;
  }): Promise<Error | null> {
    const count = await this.teamRepository.countById(teamId);

    if (count === 0) {
      return new Error("Equipe não encontrada");
    }

    await this.personRepository.updateNameAndTeamIdById({ name, teamId, id });

    return null;
  }
}
