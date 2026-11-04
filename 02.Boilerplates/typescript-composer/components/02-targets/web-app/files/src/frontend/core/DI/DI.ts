import { Api } from '../../apis/api.js';
import { GreetingService } from '../../scenes/greeting/greeting.service.js';
import { GreetingViewModel } from '../../scenes/greeting/greeting.viewmodel.js';

export function createDI() {
  const service = new GreetingService(new Api(fetch, import.meta.env.VITE_API_BASE_URL || '/api'));
  return { greetingViewModel: new GreetingViewModel(service) };
}
export type Dependencies = ReturnType<typeof createDI>;
