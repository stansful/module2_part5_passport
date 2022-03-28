import 'dotenv/config';
import { App } from './app';
import { AuthController } from './auth/auth_controller';
import { GalleryController } from './gallery/gallery_controller';

const start = async () => {
  const app = new App([new AuthController(), new GalleryController()]);
  await app.onceBeforeStart();
  app.listen();
};
start();
