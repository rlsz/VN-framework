import {LoggerService} from '../../logger/logger.service';
import {Source} from '../../logger/logger';
import {serialize, deserialize} from "../utils";

export class SessionStorageService {
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
      sessionStorage.setItem(key, this.serialize(value));
    } catch (e) {
      this.logger.error(Source.frontend, 'Can not save to sessionStorage: ', e);
    }
  }

  get(key) {
    return this.deserialize(sessionStorage.getItem(key));
  }

  remove(key) {
    sessionStorage.removeItem(key);
  }

  removeAll() {
    sessionStorage.clear();
  }
}
