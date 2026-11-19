import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createRoomService } from './server/rooms';
import { createOnlineRoomService } from './server/onlineRooms';
import { memoryRoomStore, supabaseRoomStore } from './server/onlineStore';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['SUPABASE_URL','SUPABASE_SECRET_KEY','SUPABASE_SERVICE_ROLE_KEY']) if (env[key]) process.env[key] = env[key];
  return {
  plugins: [react(), { name: 'local-qr-rooms', configureServer(server) {
    const service = createRoomService(true);
    const online = createOnlineRoomService(process.env.SUPABASE_URL ? supabaseRoomStore() : memoryRoomStore());
    server.middlewares.use('/api/online-room', (req, res) => {
      if(req.method !== 'POST'){res.statusCode=405;res.end();return;}
      let body=''; req.on('data', chunk => { body+=chunk; if(body.length>32000) req.destroy(); });
      req.on('end',async()=>{res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');try{res.end(JSON.stringify(await online(JSON.parse(body))));}catch(error){res.statusCode=400;res.end(JSON.stringify({error:error instanceof Error?error.message:'Không thể kết nối phòng online.'}));}});
    });
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
  };
});

