import {readFileSync,writeFileSync} from "node:fs";
let p="components/map/native-map-surface.native.tsx",s=readFileSync(p,"utf8");
let a=s.indexOf('    nextRegion = {'),b=s.indexOf('\n  };',a);
s=s.slice(0,a)+`    void map.current?.getCamera().then((camera) => {
      const zoom = camera.zoom ?? 0;
      const longitudeDelta = Math.min(360, viewport.width * 360 / (256 * Math.pow(2, zoom)));
      setWorldRegion({ ...nextRegion, ...camera.center, longitudeDelta });
      const blend = Math.max(0, Math.min(1, (zoom - googleFadeStartZoom) / (googleFadeEndZoom - googleFadeStartZoom)));
      overviewOpacity.setValue(1 - blend);
      setShowDetailedMap(zoom >= googleFadeStartZoom);
    });
`+s.slice(b);writeFileSync(p,s);
p="components/map/international-world-overview.tsx";s=readFileSync(p,"utf8").replace('Circle, Defs, G, Path, Pattern, Rect','Circle, ClipPath, Defs, G, Path, Rect');
a=s.indexOf('    <Defs>');b=s.indexOf('    {start && end',a);
s=s.slice(0,a)+`    <Defs><ClipPath id="land-clip">{[-720, 0, 720].map((offset) => <Path key={offset} d={WORLD_LAND_PATH} transform={\`translate(\${tx + offset * scale} \${ty}) scale(\${scale})\`} fillRule="evenodd" />)}</ClipPath></Defs>
    <Rect width={width} height={height} fill="#FAFAF7" />
    <G clipPath="url(#land-clip)">
      <Rect width={width} height={height} fill="#F1F2EE" />
      <Path d={Array.from({ length: Math.ceil(height / 7) }, (_, row) => Array.from({ length: Math.ceil(width / 7) }, (_, col) => {
        const x = col * 7 + 3, y = row * 7 + 3, r = dotRadius;
        return \`M\${x-r} \${y}a\${r} \${r} 0 1 0 \${2*r} 0a\${r} \${r} 0 1 0 \${-2*r} 0\`;
      }).join("")).join("")} fill="#7E8788" />
    </G>
`+s.slice(b);writeFileSync(p,s);
