import { DataSource } from 'typeorm';
import app from './app';
import config from './config';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [__dirname + '/app/entities/*.ts'],
  synchronize: true, 
});

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('🛢 Database connected successfully');

    app.listen(5000, () => {
      console.log(`🚀 Application listening on port ${5000}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

bootstrap();
