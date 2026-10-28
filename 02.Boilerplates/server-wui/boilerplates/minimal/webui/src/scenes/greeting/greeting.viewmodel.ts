import { Observable } from '../../core/DI/observable.js';
import type { GreetingService } from './greeting.service.js';
import type { GreetingState } from './greeting.model.js';

export class GreetingViewModel extends Observable<GreetingState> {
  constructor(private readonly service: Pick<GreetingService, 'greet'>) {
    super({ name: 'World', message: '', error: '', loading: false });
  }

  setName(name: string): void {
    if (!this.getSnapshot().loading) this.updateState({ name, error: '' });
  }

  async submit(): Promise<void> {
    const { name, loading } = this.getSnapshot();
    if (loading) return;
    this.updateState({ loading: true, error: '' });
    try {
      this.updateState({ message: await this.service.greet(name) });
    } catch (error) {
      this.updateState({ error: error instanceof Error ? error.message : 'Request failed.' });
    } finally {
      this.updateState({ loading: false });
    }
  }
}
