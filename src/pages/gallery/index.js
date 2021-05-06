import React from 'react';
import { useSelector } from 'react-redux';

import styles from '../index.module.scss';

import Head from '../../components/Head/Head';

import { withRedux } from '../../redux/withRedux';

function Gallery() {
  const appLoaded = useSelector((state) => state.app.loaded);

  return (
    <main className="Gallery">
      <Head title="Gallery" />

      <div className={styles.hero}>
        <h1 className={styles.title}>Gallery pieces</h1>
        <p>{appLoaded ? 'landing loaded' : 'landing is not loaded'}</p>
        <p>Gallery page</p>
      </div>
    </main>
  );
}

export default withRedux(Gallery);
