with open('app/scene.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add lastSelectedKey
old_var = "lastIsolate='',layoutKey=''"
new_var = "lastIsolate='',lastSelectedKey='',layoutKey=''"
assert old_var in content, 'old_var not found'
content = content.replace(old_var, new_var, 1)

# 2. Add xrayUniform and shader support
old_mat = """  const materialFor=(system:string)=>{
   const m=new T.MeshStandardMaterial({color:SYSTEMS.find(s=>s.id===system)?.color??'#aebbb8',metalness:.08,roughness:.53,side:T.DoubleSide,transparent:system==='integumentary',opacity:system==='integumentary'?.1:1,depthWrite:system!=='integumentary'});
   m.onBeforeCompile=shader=>{
    shader.uniforms.partState={value:partTexture};shader.uniforms.selectionState={value:selectionTexture};shader.uniforms.stateWidth={value:width};
    shader.vertexShader='attribute float partIndex; uniform sampler2D partState; uniform sampler2D selectionState; uniform float stateWidth; varying float partVisible; varying float partSelected;\\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\\nvec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5); vec4 state = texture2D(partState, stateUv); transformed += state.xyz; partVisible = state.w; partSelected = texture2D(selectionState, stateUv).r;');
    shader.fragmentShader='varying float partVisible; varying float partSelected;\\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\\nif (partVisible < 0.5) discard;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\\ndiffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0, 0.98, 0.92), partSelected * 0.95);');
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\\ntotalEmissiveRadiance += vec3(0.0, 0.82, 0.92) * partSelected * 0.75;');
   };materials.push(m);return m;
  };"""

new_mat = """  const xrayUniform={value:0};
  const materialFor=(system:string)=>{
   const m=new T.MeshStandardMaterial({color:SYSTEMS.find(s=>s.id===system)?.color??'#aebbb8',metalness:.08,roughness:.53,side:T.DoubleSide,transparent:system==='integumentary',opacity:system==='integumentary'?.1:1,depthWrite:system!=='integumentary'});
   m.onBeforeCompile=shader=>{
    shader.uniforms.partState={value:partTexture};shader.uniforms.selectionState={value:selectionTexture};shader.uniforms.stateWidth={value:width};shader.uniforms.xrayMode=xrayUniform;
    shader.vertexShader='attribute float partIndex; uniform sampler2D partState; uniform sampler2D selectionState; uniform float stateWidth; varying float partVisible; varying float partSelected;\\n'+shader.vertexShader;
    shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\\nvec2 stateUv = vec2((partIndex + 0.5) / stateWidth, 0.5); vec4 state = texture2D(partState, stateUv); transformed += state.xyz; partVisible = state.w; partSelected = texture2D(selectionState, stateUv).r;');
    shader.fragmentShader='uniform float xrayMode; varying float partVisible; varying float partSelected;\\nfloat bayer4(vec2 p){vec2 f=mod(p,4.0);int x=int(f.x);int y=int(f.y);if(y==0){if(x==0)return 0.0625;if(x==1)return 0.5625;if(x==2)return 0.1875;return 0.6875;}if(y==1){if(x==0)return 0.8125;if(x==1)return 0.3125;if(x==2)return 0.9375;return 0.4375;}if(y==2){if(x==0)return 0.25;if(x==1)return 0.75;if(x==2)return 0.125;return 0.625;}if(x==0)return 1.0;if(x==1)return 0.5;if(x==2)return 0.875;return 0.375;}\\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\\nif (partVisible < 0.5) discard;\\nif (xrayMode > 0.5 && partSelected < 0.5) { if (bayer4(gl_FragCoord.xy) > 0.28) discard; }');
    shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\\nif (xrayMode > 0.5 && partSelected < 0.5) { diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.52, 0.64, 0.74), 0.65); } else { diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.0, 0.98, 0.92), partSelected * 0.95); }');
    shader.fragmentShader=shader.fragmentShader.replace('#include <emissivemap_fragment>','#include <emissivemap_fragment>\\ntotalEmissiveRadiance += vec3(0.0, 0.85, 0.95) * partSelected * 0.9;');
   };materials.push(m);return m;
  };"""

assert old_mat in content, 'old_mat not found'
content = content.replace(old_mat, new_mat, 1)

# 3. Add autoFocus and xray handling to animation loop
old_anim_hook = """lastState=s;lastExtent=amount;dirty=true;
   }
   if(s.view!==lastView||s.reset!==lastReset){fit(s.view,amount);lastView=s.view;lastReset=s.reset;}"""

new_anim_hook = """lastState=s;lastExtent=amount;dirty=true;
   }
   if(xrayUniform.value !== (s.xray ? 1 : 0)){ xrayUniform.value = s.xray ? 1 : 0; dirty = true; }
   const currentSelectedKey = s.selected.join(',');
   if(currentSelectedKey !== lastSelectedKey){
    if(s.selected.length > 0 && !s.isolate && s.autoFocus !== false){
     const box = new T.Box3();
     atlas.parts.forEach((p, i) => { if(s.selected.includes(p.id)) box.union(bounds[i].clone().translate(new T.Vector3(data[i*4], data[i*4+1], data[i*4+2]))); });
     if(!box.isEmpty()){
      const center = box.getCenter(new T.Vector3()), size = box.getSize(new T.Vector3());
      controls.target.set(center.x, center.y, center.z);
      const camOffset = camera.position.clone().sub(controls.target);
      const idealDist = Math.max(0.4, Math.min(2.0, Math.max(size.x, size.y, size.z) * 3.5));
      if(camOffset.length() > idealDist * 1.5){ camOffset.setLength(idealDist); camera.position.copy(controls.target).add(camOffset); }
      controls.update(); dirty = true;
     }
    } else if(lastSelectedKey && s.selected.length === 0 && !s.isolate){
     controls.target.set(0, 0.68, 0); fit(s.view, amount); dirty = true;
    }
    lastSelectedKey = currentSelectedKey;
   }
   if(s.view!==lastView||s.reset!==lastReset){fit(s.view,amount);lastView=s.view;lastReset=s.reset;}"""

assert old_anim_hook in content, 'old_anim_hook not found'
content = content.replace(old_anim_hook, new_anim_hook, 1)

with open('app/scene.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print('scene.tsx updated successfully!')
