import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRoomService } from './server/rooms';

export default defineConfig({
  plugins: [react(), { name: 'local-qr-rooms', configureServer(server) {
    const service = createRoomService(true);
    server.middlewares.use('/api/qr-room', (req, res) => {
      if(req.method!=='POST'){res.statusCode=405;res.end();return;}
      let body=''; req.on('data',chunk=>{body+=chunk;if(body.length>16000)req.destroy();});
      req.on('end',async()=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');try{res.end(JSON.stringify(await service(JSON.parse(body))));}catch(error){res.statusCode=400;res.end(JSON.stringify({error:error instanceof Error?error.message:'Không thể kết nối phòng.'}));}});
    });
  } }],
  server: {
    port: 5173,
    host: true
  }
});

