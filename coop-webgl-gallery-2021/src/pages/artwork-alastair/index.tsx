import { memo, useRef } from 'react';
import classnames from 'classnames';
import dynamic from 'next/dynamic';

import styles from './index.module.scss';

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
      <div className={styles.controlsContainer}>
        <h1>B.E.A.D.</h1>
        <div className={styles.controls}>
          <div className={styles.button} id="create-mesh">
            create mesh
          </div>
          <div className={styles.button} id="reset-mesh">
            reset mesh
          </div>
        </div>
      </div>
    </main>
  );
}

export default memo(Artwork);
