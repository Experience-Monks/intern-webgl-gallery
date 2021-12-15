import { useRef, useEffect } from 'react';

import Experience from './Experience/Experience';

function Art() {
  const inputEl = useRef(null);

  useEffect(() => {
    console.log('Creating Artwork Alastair');
    const experience = new Experience(inputEl.current, true);

    return () => {
      experience.destroy();
      console.log('Destroying Artwork Alastair');
    };
  }, []);

  return <canvas ref={inputEl}></canvas>;
}

export default Art;
