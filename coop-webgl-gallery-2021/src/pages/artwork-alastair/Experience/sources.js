const path_start = `../../assets/static-alastair/`;

export default [
  //===== TEXTURES =====
  {
    name: 'cliffAlbedo',
    type: 'texture',
    path: `${path_start}textures/cliff/cliff_Albedo.jpg`
  },
  {
    name: 'cliffDisplacement',
    type: 'texture',
    path: `${path_start}textures/cliff/cliff_Displacement.jpg`
  },
  {
    name: 'cliffNormal',
    type: 'texture',
    path: `${path_start}textures/cliff/cliff_Normal.jpg`
  },
  {
    name: 'cliffRoughness',
    type: 'texture',
    path: `${path_start}textures/cliff/cliff_Roughness.jpg`
  },
  {
    name: 'beadParticle',
    type: 'texture',
    path: `${path_start}textures/beads/disc.png`
  },
  {
    name: 'lensflare0_Alpha',
    type: 'texture',
    path: `${path_start}textures/lensflare/lensflare0_alpha.png`
  },
  {
    name: 'lensflare0',
    type: 'texture',
    path: `${path_start}textures/lensflare/lensflare0.png`
  },
  {
    name: 'lensflare1',
    type: 'texture',
    path: `${path_start}textures/lensflare/lensflare1.png`
  },
  //===== MODELS =====
  {
    name: 'handModel',
    type: 'objModel',
    path: `${path_start}models/hand/hand.obj`
  },
  {
    name: 'studioLights',
    type: 'fbxModel',
    path: `${path_start}models/studio_lights.fbx`
  },
  //===== TEST MODELS =====
  {
    name: 'coffeeMugModel',
    type: 'objModel',
    path: `${path_start}models/coffeeMug1_free_obj/coffeeMug.obj`
  },
  {
    name: 'mandalorianModel',
    type: 'objModel',
    path: `${path_start}models/mandalorian.obj`
  },
  {
    name: 'skullModel',
    type: 'objModel',
    path: `${path_start}models/skull.obj`
  },
  {
    name: 'teapotModel',
    type: 'objModel',
    path: `${path_start}models/teapot.obj`
  },
  {
    name: 'maleHeadModel',
    type: 'objModel',
    path: `${path_start}models/male_head.obj`
  },
  {
    name: 'tvModel',
    type: 'objModel',
    path: `${path_start}models/tv.obj`
  },
  //===== ENVIRONMENT MAPS =====
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      `${path_start}textures/envMap/0/px.jpg`,
      `${path_start}textures/envMap/0/nx.jpg`,
      `${path_start}textures/envMap/0/py.jpg`,
      `${path_start}textures/envMap/0/ny.jpg`,
      `${path_start}textures/envMap/0/pz.jpg`,
      `${path_start}textures/envMap/0/nz.jpg`
    ]
  }
];
