import React from 'react';
import { useSelector } from 'react-redux';

import styles from '../index.module.scss';

import Head from '../../components/Head/Head';

import { withRedux } from '../../redux/withRedux';

function About() {
  const appLoaded = useSelector((state) => state.app.loaded);

  return (
    <main className="About">
      <Head title="About" />

      <div className={styles.hero}>
        <h1 className={styles.title}>About</h1>
        <p> Welcome to the intern Gallery</p>
      </div>
    </main>
  );
}

export default withRedux(About);

/* {appLoaded ? 'landing loaded' : 'landing is not loaded'}*/
