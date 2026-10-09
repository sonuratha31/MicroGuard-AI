import json, os, struct

base = r'c:\Users\HP\Desktop\microguard-ai\public\models'
files = ['anatomy-organs.glb', 'anatomy-skin.glb']

for f in files:
    p = os.path.join(base, f)
    with open(p, 'rb') as fh:
        data = fh.read()

    if len(data) < 12:
        print('SHORT FILE', f)
        continue

    magic = struct.unpack('<I', data[:4])[0]
    version = struct.unpack('<I', data[4:8])[0]
    total = struct.unpack('<I', data[8:12])[0]
    off = 12
    jsonb = None

    while off + 8 <= len(data):
        clen = struct.unpack('<I', data[off:off+4])[0]
        ctype = struct.unpack('<I', data[off+4:off+8])[0]
        chunk = data[off+8:off+8+clen]
        off += 8 + clen

        if ctype == 0x4E534F52:
            jsonb = chunk

    if jsonb is None:
        print('NO JSON CHUNK', f)
        continue

    doc = json.loads(jsonb.decode('utf-8'))
    nodes = doc.get('nodes') or []
    meshes = doc.get('meshes') or []

    print('FILE', f)
    print('magic', hex(magic), 'version', version, 'length', total)
    print('nodes', len(nodes), 'meshes', len(meshes), 'scenes', len(doc.get('scenes') or []))
    print('node names sample:', [n.get('name') for n in nodes[:20] if n.get('name')][:20])
    print('mesh names sample:', [m.get('name') for m in meshes[:20] if m.get('name')][:20])

    keywords = ['brain', 'lung', 'heart', 'liver', 'stomach', 'kidney', 'intestine', 'colon', 'body', 'skin', 'torso', 'head', 'arm', 'leg']
    matches = []

    for n in nodes:
        name = (n.get('name') or '').lower()
        if any(k in name for k in keywords):
            matches.append(n.get('name'))

    print('matching names:', matches[:50])
    print('---')