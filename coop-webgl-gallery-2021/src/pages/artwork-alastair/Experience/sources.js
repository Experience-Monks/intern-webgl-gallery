const path_start = `../../assets/static-alastair/`;

export default [
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
    name: 'handModel',
    type: 'objModel',
    path: `${path_start}models/hand/hand.obj`
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
