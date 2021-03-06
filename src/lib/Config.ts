import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { ConfigItem } from './entities/ConfigItem';

export enum ConfigKey {
  ACTIVE_FIRST_PARTY_ENDPOINT_ID = 'first_party_endpoint_id',
}

@Service()
export class Config {
  constructor(@InjectRepository(ConfigItem) private configRepository: Repository<ConfigItem>) {}

  public async get(key: ConfigKey): Promise<string | null> {
    const item = await this.configRepository.findOne(key);
    return item?.value ?? null;
  }

  public async set(key: ConfigKey, value: string): Promise<void> {
    const configItem = await this.configRepository.create({ key, value });
    await this.configRepository.save(configItem);
  }
}
