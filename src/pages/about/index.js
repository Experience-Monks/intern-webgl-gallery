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

      <div className={styles.About}>
        <h1 className={styles.title}>About</h1>
        <p>Welcome to the WE3 Creative Gallery.</p>{' '}
        <p>
          We are Mariana de Queiroz, Amna Azhar, and Mia Tang, the WE3 developer interns for summer 2021. This website
          contains artwork made by each of us using THREE.JS, which we got to learn together as a team.{' '}
        </p>
        <p>
          This is the onboarding project for WE3 developer internship. It is a twofold project that involves working
          with the boilerplate and creating our own artwork, thus being a creator and a curator at the same time. We
          were given 3 weeks to complete the project under the guidance of our wonderful mentors: Amélie Maia and Fabio
          Toste.
        </p>
      </div>
    </main>
  );
}

export default withRedux(About);

/* {appLoaded ? 'landing loaded' : 'landing is not loaded'}*/
