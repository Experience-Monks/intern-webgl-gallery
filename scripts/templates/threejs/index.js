import React, { useRef } from 'react';

import dynamic from 'next/dynamic';
import styles from './../gallery.module.scss';


import { withRedux } from '../../../redux/withRedux';

const ArtCanvas = dynamic(() => import('./artwork'), {
  ssr: false
});

export const isBrowser = typeof window !== 'undefined';

function Artwork() {
  const containerRef = useRef();
  // all consts and animates etc
  return (
      //HEAD
      //SECTION
      //ETC
      //SURROUNDING PAGE CODE GOES HERE
      <div id="scene-container" className={styles.canvasWrap}>
        {isBrowser && <ArtCanvas></ArtCanvas>}
      </div>
      //FOOTER
      //MORE?
  );
}

export default withRedux(Artwork);
