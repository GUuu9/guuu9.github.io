export class Observable<State extends object> {
  private readonly listeners = new Set<() => void>();

  protected constructor(private state: Readonly<State>) {}

  getSnapshot = (): Readonly<State> => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };

  protected updateState(change: Partial<State>): void {
    this.state = { ...this.state, ...change };
    this.listeners.forEach((listener) => listener());
  }
}
