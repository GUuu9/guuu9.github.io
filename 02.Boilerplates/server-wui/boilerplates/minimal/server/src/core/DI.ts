import { GreetingBridge } from '../bridge/greeting/greeting.bridge.js';
import { GreetingUsecase } from '../bridge/greeting/greeting.usecase.js';
import { GreetingRepository } from '../repository/greeting/greeting.repository.js';
import { FileService } from '../services/file/file.service.js';

export function createDI() {
  const file = new FileService();
  const config = file.readJson(new URL('../config/greeting.json', import.meta.url));
  const repository = new GreetingRepository(config);
  const usecase = new GreetingUsecase(repository);
  return { greetingBridge: new GreetingBridge(usecase) };
}
