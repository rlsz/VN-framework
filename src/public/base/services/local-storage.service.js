import {LoggerService} from '../../logger/logger.service';
import {Source} from '../../logger/logger';
import {serialize, deserialize} from "../utils";

export class LocalStorageService {
  logger
  constructor(injector) {
    this.logger = injector.get(LoggerService)
  }

  serialize(val) {
    return serialize(val);
  }

  deserialize(value) {
    try {
      return deserialize(value)
    } catch (e) {
      this.logger.error(Source.frontend, 'deserialize failed:', value);
      return value
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(key, this.serialize(value));
    } catch (e) {
      this.logger.error(Source.frontend, 'Can not save to localStorage: ', e);
    }
  }

  get(key) {
    return this.deserialize(localStorage.getItem(key));
  }

  remove(key) {
    localStorage.removeItem(key);
  }

  removeAll() {
    localStorage.clear();
  }
}
