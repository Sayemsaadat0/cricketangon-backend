import app from './app';
async function bootstrap() {
  try {
    app.listen(5000, () => {
      console.log('🚀 Server started on port 5000');
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

bootstrap();
