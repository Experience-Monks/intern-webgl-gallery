import { memo, useRef, useState } from 'react';
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
  const [hidden, setHidden] = useState(false);

  return (
    <main className={classnames(styles.Artwork, className)} ref={containerRef}>
      <Head title="Artwork" />
      <div className={styles.webgl}>{isBrowser && <ArtCanvas></ArtCanvas>}</div>
      <div className={classnames(styles.controlsContainer, hidden && styles.hidden)} id="controls-container">
        <h1 className={styles.title}>{data.title}</h1>
        <div className={styles.controls}>
          <div className={classnames(styles.button, styles.createMeshButton)} id="create-mesh">
            {data.buttons.create}
          </div>
          <div className={styles.button} id="animate">
            {data.buttons.animateOn}
          </div>
          <div className={styles.button} id="color-type">
            {data.buttons.colorTypeOn}
          </div>
          <div className={styles.beadTypeButton}>
            {data.buttons.beadType}
            <select id="bead-type">
              {Object.values(data.beadType).map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.button} id="reset-mesh">
            {data.buttons.reset}
          </div>
          <div className={styles.button} id="rotate-toggle">
            {data.buttons.autoRotateOn}
          </div>
          <div className={styles.fileUpload}>
            <input type="file" id="file-upload" hidden />
            <label htmlFor="file-upload"> {data.buttons.fileUpload}</label>
          </div>
        </div>
      </div>
      <div className={styles.hideControls} onClick={() => setHidden(!hidden)} id="hide-controls">
        {hidden ? data.buttons.show : data.buttons.hide}
      </div>
      <div id="loading-bar"></div>
    </main>
  );
}

export default memo(Artwork);
