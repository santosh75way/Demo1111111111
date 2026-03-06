import 'module-alias/register';
import 'dotenv/config';
import app from './app';
import { config } from '@/common/config/config';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;