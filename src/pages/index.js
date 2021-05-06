import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';

import Link from 'next/link';
import styles from './index.module.scss';

import Head from '../components/Head/Head';
import { withRedux } from '../redux/withRedux';
import { setLandingLoaded } from '../redux/modules/app';

import gallery from '../data/gallery';

function Landing() {
  const containerRef = useRef();
  const dispatch = useDispatch();

  const animateInInit = useCallback(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 });
  }, []);

  const animateIn = useCallback(async () => {
    await gsap.to(containerRef.current, { duration: 0.5, autoAlpha: 1, delay: 0.3 });
    dispatch(setLandingLoaded(true));
  }, [dispatch]);

  useEffect(() => {
    animateInInit();
  }, [animateInInit]);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <main className={styles.Landing}>
      <Head />

      <section className={styles.hero} ref={containerRef}>
        <h1 className={styles.title}>Landing page</h1>

        <h2 className={styles.description}>
          DELETE LATER**To get started, edit <code>pages/index.js</code> and save to reload.
        </h2>

        <div className={styles.row}>
          <a href="/gallery" className={styles.card} target="_blank" rel="noopener noreferrer">
            <h3>Enter gallery button title</h3>
            <p>Maybe a subtitle</p>
          </a>
        </div>
        <p>thumbnails go here ⬇</p>
        <ul className={styles.routes}>
          {Object.values(gallery).map(({ path, title }) => (
            <li key={path}>
              <Link href={path}>
                <a aria-label="Home">{path === '/' ? '' : <>{title}</>}</a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default withRedux(Landing);
