const fs = require('fs');
const base = 'c:/Users/HP/Desktop/microguard-ai/public/models';
for (const file of ['anatomy-organs.glb', 'anatomy-skin.glb']) {
  const data = fs.readFileSync(`${base}/${file}`);
  console.log('FILE', file);
  console.log('len', data.length);
  const magic = data.readUInt32LE(0);
  const version = data.readUInt32LE(4);
  const total = data.readUInt32LE(8);
  let offset = 12;
  let jsonChunk = null;
  while (offset + 8 <= total) {
    const chunkLength = data.readUInt32LE(offset);
    const chunkType = data.readUInt32LE(offset + 4);
    const chunkData = data.subarray(offset + 8, offset + 8 + chunkLength);
    offset += 8 + chunkLength;
    if (chunkType === 0x4E534F52) jsonChunk = chunkData;
  }
  const doc = JSON.parse(jsonChunk.toString('utf8'));
  const nodes = doc.nodes || [];
  const meshes = doc.meshes || [];
  console.log('nodes', nodes.length, 'meshes', meshes.length);
  console.log('node names', nodes.slice(0, 20).map((n) => n.name).filter(Boolean));
  console.log('mesh names', meshes.slice(0, 20).map((m) => m.name).filter(Boolean));
  const keywords = ['brain', 'lung', 'heart', 'liver', 'stomach', 'kidney', 'intestine', 'colon', 'body', 'skin', 'torso', 'head', 'arm', 'leg'];
  const matches = [];
  for (const n of nodes) {
    const name = (n.name || '').toLowerCase();
    if (keywords.some((k) => name.includes(k))) matches.push(n.name || '(unnamed)');
  }
  console.log('matching names', matches.slice(0, 50));
  console.log('---');
}
