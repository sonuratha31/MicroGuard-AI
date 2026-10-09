import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript','.mjs':'application/javascript','.json':'application/json','.wasm':'application/wasm','.glb':'model/gltf-binary','.zip':'application/zip','.txt':'text/plain'};
const port=Number(process.env.PORT||8080);
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Bad request');return;}if(pathname==='/')pathname='/index.html';const file=path.resolve(root,'.'+pathname);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}fs.stat(file,(err,s)=>{if(err||!s.isFile()){res.writeHead(404);res.end('File not found');return;}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':s.size,'Cache-Control':'no-cache'});fs.createReadStream(file).pipe(res);});}).on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port '+port+' is already in use. Open the existing server or set PORT to another value.':e.message);process.exitCode=1;}).listen(port,'127.0.0.1',()=>console.log('\nMicroGuard Anatomy Explorer\nOpen http://localhost:'+port+'\nKeep this terminal open. Press Ctrl+C to stop.\n'));
