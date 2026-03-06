import 'module-alias/register';
import 'dotenv/config';
import app from './app';
import { config } from '@/common/config/config';
import { initSocket } from './common/socket/socket';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initSocket(server);

export default server;