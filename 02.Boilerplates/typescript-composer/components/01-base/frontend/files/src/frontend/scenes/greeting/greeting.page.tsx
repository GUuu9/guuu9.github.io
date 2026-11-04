import { useSyncExternalStore } from 'react';
import { useDI } from '../../core/DI/DIProvider.js';
import './greeting.page.css';

export function GreetingPage() {
  const { greetingViewModel: vm } = useDI();
  const state = useSyncExternalStore(vm.subscribe, vm.getSnapshot);
  return (
    <main>
      <h1>Greeting</h1>
      <p>A small Page → ViewModel → Service → API example.</p>
      <form onSubmit={(event) => { event.preventDefault(); void vm.submit(); }}>
        <label htmlFor="name">Name</label>
        <input id="name" value={state.name} disabled={state.loading}
          onChange={(event) => vm.setName(event.target.value)} />
        <button disabled={state.loading}>{state.loading ? 'Loading…' : 'Send'}</button>
      </form>
      {state.message && <p role="status">{state.message}</p>}
      {state.error && <p role="alert">{state.error}</p>}
    </main>
  );
}
