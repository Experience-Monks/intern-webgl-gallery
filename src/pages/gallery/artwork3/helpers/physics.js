function animateIfAsleep(scene, fns, toggles, bodySets, meshSets, destPosSets, camera, DEBUG, NUM_SETS, animateToDest) {
  if (
    toggles.every((toggle) => {
      const t = toggle.animated;
      return t;
    })
  ) {
    return;
  }
  let bodies;
  for (let set = 0; set < NUM_SETS; set++) {
    bodies = bodySets[set];
    if (bodies.every(fns.isAsleep) && !toggles[set].animated) {
      if (DEBUG) {
        console.log('all bodies are asleep');
      }
      animateToDest(scene, meshSets[set], destPosSets[set], camera);
      toggles[set].animated = true;
    }
  }
}

function updateOimoPhysics(
  world,
  scene,
  fns,
  toggles,
  bodySets,
  meshSets,
  destPosSets,
  camera,
  DEBUG,
  NUM_SETS,
  animateToDest
) {
  if (world == null) return;
  world.step();
  animateIfAsleep(scene, fns, toggles, bodySets, meshSets, destPosSets, camera, DEBUG, NUM_SETS, animateToDest);

  let mesh, body, bodies, meshes, i;

  for (let set = 0; set < NUM_SETS; set++) {
    i = bodySets[set].length;
    bodies = bodySets[set];
    meshes = meshSets[set];

    while (i--) {
      body = bodies[i];
      mesh = meshes[i];

      if (!body.sleeping) {
        mesh.position.copy(body.getPosition());
        mesh.quaternion.copy(body.getQuaternion());
      }
    }
  }
}

function initWalls(scene, world, grounds, createStaticBox) {
  const sideBoxSize = [50, 800, 800];
  const leftBoxPos = [400, 0, 0];
  const rightBoxPos = [-400, 0, 0];
  const horizBoxSize = [800, 800, 50];
  const topBoxPos = [0, 0, -400];
  const botBoxPos = [0, 0, 400];

  let sideBoxRight = createStaticBox(scene, sideBoxSize, leftBoxPos, [0, 0, 0], 0xffffff);
  let sideBoxLeft = createStaticBox(scene, sideBoxSize, rightBoxPos, [0, 0, 0], 0xffffff);
  let sideBoxTop = createStaticBox(scene, horizBoxSize, topBoxPos, [0, 0, 0], 0xffffff);
  let sideBoxBot = createStaticBox(scene, horizBoxSize, botBoxPos, [0, 0, 0], 0xffffff);
  world.add({
    size: sideBoxSize,
    pos: leftBoxPos,
    world: world,
    friction: 0.5
  });
  world.add({
    size: sideBoxSize,
    pos: rightBoxPos,
    world: world,
    friction: 0.5
  });
  world.add({
    size: horizBoxSize,
    pos: topBoxPos,
    world: world,
    friction: 0.5
  });
  world.add({
    size: horizBoxSize,
    pos: botBoxPos,
    world: world,
    friction: 0.5
  });
  grounds.concat([sideBoxRight, sideBoxLeft, sideBoxBot, sideBoxTop]);
}

export { initWalls, updateOimoPhysics };
