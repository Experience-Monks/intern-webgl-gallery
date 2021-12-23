import { memo, useRef } from 'react';
import classnames from 'classnames';
import dynamic from 'next/dynamic';

import styles from './index.module.scss';

import Head from '../../components/Head/Head';

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
      {/* <h1 className={styles.title}>Angela's Page</h1> */}
      <div className={styles.Piece}>{isBrowser && <ArtCanvas></ArtCanvas>}</div>
    </main>
  );
}

export default memo(Artwork);
