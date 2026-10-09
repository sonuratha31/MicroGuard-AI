# MicroGuard Human Anatomy Explorer

An interactive, self-contained 3D anatomy viewer inspired by the supplied reference. Includes 2,803 named structures after excluding reproductive anatomy. Uses real Z-Anatomy / BodyParts3D meshes, not procedural placeholder organs.

## Run on Windows

1. Extract the ZIP completely.
2. Open the extracted folder in VS Code.
3. Run `npm.cmd run dev` in that folder. No npm install is needed.
4. Open http://localhost:8080 and keep the terminal open.

Alternatively double-click START-WINDOWS.bat. Node.js is required (the same installation used for Vite). Do not open index.html directly: browsers require an HTTP server to load the models and decoder. After extraction, the app works without internet, API keys, or paid services.

## Controls

- Drag: rotate. Scroll/pinch: zoom. Right-drag/two-finger drag: pan.
- Click an organ label: isolate and zoom to that organ.
- Click geometry or a search result: select and focus a structure.
- Layer button: toggle the system. Shift-click: show only that system.
- Normal, exploded, organ focus, and X-ray modes.
- Front, back, left, right, top, bottom preset cameras; automatic 360° rotation.
- Close-up, isolate, hide part, restore, full-screen, labels and opacity controls.
- “Open torso & head” removes selected covering structures to reveal organs.
- Colored dots: illustrative microplastics. Use “Inspect lungs” to see them closely.

## Model and limitations

Seven compressed anatomy collections are combined in human-anatomy.glb. They retain separate meshes and stable names. No reproductive structure can be enabled in the viewer. The included human-anatomy.glb combines the collections and illustrative particles; it can be opened in Blender or any Draco-capable GLB viewer.

The screenshot is a visual reference, not a source 3D model. This atlas does not have the exact screenshot textures or a separate skin mesh. It is not an exhaustive map of every human tissue. It is a static anatomical assembly, not a rigged character for walking or joint posing. Full-resolution assets have approximately 10.3 million triangles; older devices can improve performance by hiding unused systems.

Microplastic dots are synthetic, enlarged for visibility, and not measured. They do not represent an individual's exposure, actual locations, particle counts or health risks. X-ray mode is an artistic transparent rendering, not diagnostic imaging.

## Integrate into an existing Vite / React project

Copy this folder into `public/anatomy/`. Use an iframe:

```tsx
<iframe
  src="/anatomy/index.html"
  title="MicroGuard Human Anatomy Explorer"
  style={{width: '100%', height: '90vh', border: 0}}
  allow="fullscreen"
/>
```

All paths are relative. No extra React or Three.js package install is required for this iframe route. Keep vendor/, models/, credits.html and attribution files together.

## License and credits

“BodyParts3D - The Database Center for Life Science - CC-BY-SA 2.1 Japan”

“Z-Anatomy - The open source atlas of anatomy - CC-BY-SA 4.0”

Compressed exports: https://github.com/nqwrc/3d-anatomy

Upstream includes kidney and inner-ear assets with non-commercial terms. Model collection and derivatives: CC BY-NC-SA 4.0. Read LICENSE, NOTICE, models/License.txt, and credits.html before reuse. Preserve attribution and share-alike requirements. Viewer code: MIT. Three.js: MIT. Draco: Apache 2.0.

Changes: removed reproductive mesh nodes from visible scenes; retained individual anatomical structure names; stripped unused custom metadata; combined model collections; added synthetic particle overlay and a new viewer UI.

## Validation

All seven system GLBs were decoded and their scene graphs inspected with the bundled Three.js-compatible Draco decoder. Counts, bounding boxes, model exclusions and JavaScript syntax were checked. Interactive browser rendering could not be tested in the creation environment; verify the initial view on your computer before integrating.
