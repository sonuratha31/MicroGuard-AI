const fs = require('fs');
const path = require('path');

function inspectGLB(filePath) {
  const data = fs.readFileSync(filePath);
  if (data.readUInt32LE(0) !== 0x46546c67) {
    console.error('Not a GLB:', filePath);
    return;
  }

  // GLB header: 12 bytes, then chunks
  const length = data.readUInt32LE(8);
  let offset = 12;
  let json = null;

  while (offset < length) {
    const chunkLength = data.readUInt32LE(offset);
    const chunkType = data.readUInt32LE(offset + 4);
    const chunkData = data.slice(offset + 8, offset + 8 + chunkLength);
    // JSON chunk type = 0x4E4F534A
    if (chunkType === 0x4E4F534A) {
      json = JSON.parse(chunkData.toString('utf8'));
      break;
    }
    offset += 8 + chunkLength;
  }

  if (!json) {
    console.error('No JSON chunk found in', filePath);
    return;
  }

  console.log('\n====', path.basename(filePath), '====');
  console.log('Scenes:', (json.scenes || []).length);
  console.log('Nodes:', (json.nodes || []).length);
  console.log('Meshes:', (json.meshes || []).length);
  console.log('Materials:', (json.materials || []).length);
  console.log('Accessors:', (json.accessors || []).length);

  const nodes = json.nodes || [];
  const meshes = json.meshes || [];
  const accessors = json.accessors || [];

  nodes.forEach((node, i) => {
    const name = node.name || `(node_${i})`;
    const mesh = typeof node.mesh === 'number' ? node.mesh : null;
    const children = node.children ? node.children.join(',') : '';
    const t = node.translation ? `t=${node.translation.join(',')}` : '';
    const r = node.rotation ? `r=${node.rotation.join(',')}` : '';
    const s = node.scale ? `s=${node.scale.join(',')}` : '';

    console.log(`\nNode[${i}]: ${name}`);
    if (mesh !== null) {
      console.log(`  mesh: ${mesh} (${meshes[mesh] && meshes[mesh].name ? meshes[mesh].name : 'unnamed'})`);
      const m = meshes[mesh];
      if (m && m.primitives) {
        m.primitives.forEach((prim, pi) => {
          console.log(`    primitive[${pi}] mode=${prim.mode || 4}`);
          if (prim.attributes) {
            Object.keys(prim.attributes).forEach((attr) => {
              const acc = accessors[prim.attributes[attr]];
              const accInfo = acc ? ` accessor=${prim.attributes[attr]} type=${acc.type} count=${acc.count}` : '';
              const minmax = acc && acc.min ? ` min=${acc.min.join(',')} max=${acc.max.join(',')}` : '';
              console.log(`      attr ${attr}${accInfo}${minmax}`);
            });
          }
          if (prim.indices !== undefined) {
            const idx = accessors[prim.indices];
            console.log(`      indices accessor=${prim.indices} count=${idx ? idx.count : 'unknown'}`);
          }
        });
      }
    }

    if (children) console.log(`  children: ${children}`);
    if (t || r || s) console.log(`  transform: ${t} ${r} ${s}`);
  });

  // Heuristic: list mesh primitives named like organs
  console.log('\n-- Meshes summary --');
  meshes.forEach((m, i) => {
    console.log(`Mesh[${i}]: ${m.name || '(unnamed)'} primitives=${m.primitives ? m.primitives.length : 0}`);
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node inspect-glb.cjs <file.glb> [other.glb ...]');
    process.exit(1);
  }

  args.forEach((arg) => {
    try {
      inspectGLB(arg);
    } catch (err) {
      console.error('Error inspecting', arg, err.message);
    }
  });
}
