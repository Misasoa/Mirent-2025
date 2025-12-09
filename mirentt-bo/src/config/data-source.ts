import { DataSource } from 'typeorm';
import { typeOrmConfig } from './database.config';

export default new DataSource(typeOrmConfig);
