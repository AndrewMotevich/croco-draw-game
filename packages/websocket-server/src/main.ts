import { server } from './server/main.server';

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port 8999 :)`);
});
