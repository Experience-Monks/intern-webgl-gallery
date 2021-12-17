import { memo, useRef } from 'react';
import classnames from 'classnames';
import dynamic from 'next/dynamic';

import styles from './index.module.scss';

import data from '../../webgl/artwork-alastair/data.json';

import Head from '@/components/Head/Head';

type Props = {
  className: string;
};

export const isBrowser = typeof window !== 'undefined';

const ArtCanvas = dynamic(() => import('./artwork'), {
  ssr: false
});

function Artwork({ className }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <main className={classnames(styles.Artwork, className)} ref={containerRef}>
      <Head title="Artwork" />
      <div className={styles.webgl}>{isBrowser && <ArtCanvas></ArtCanvas>}</div>
      <div className={styles.controlsContainer} id="controls-container">
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.controls}>
          <div className={styles.button} id="create-mesh">
            {data.buttons.create}
          </div>
          <div className={styles.button} id="create-mug">
            {data.buttons.coffeeMug}
          </div>
          <div className={styles.button} id="create-mandalorian">
            {data.buttons.mandalorian}
          </div>
          <div className={classnames(styles.button, styles.resetButton)} id="reset-mesh">
            {data.buttons.reset}
          </div>
          <div className={classnames(styles.button, styles.rotateToggleButton)} id="rotate-toggle">
            {data.buttons.autoRotateOn}
          </div>
          <div className={styles.fileUpload}>{data.buttons.fileUpload}</div>
        </div>
      </div>
      <div id="loading-bar"></div>
    </main>
  );
}

export default memo(Artwork);
