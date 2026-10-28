import type { GreetingRepository } from '../../repository/greeting/greeting.repository.js';
import type { Greeting } from './greeting.model.js';

export class GreetingUsecase {
  constructor(private readonly repository: GreetingRepository) {}

  greet(name: string): Greeting {
    return { message: `${this.repository.getPrefix()}, ${name}!` };
  }
}
