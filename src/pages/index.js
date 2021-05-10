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
        <div className={styles.row}>
          <h1 className={styles.title}>WE3 Creative Gallery</h1>
        </div>
        <div className={styles.row}>
          <ul className={styles.routes}>
            {Object.values(gallery).map(({ path, title }) => (
              <li key={path} className={styles.card}>
                <Link href={path}>
                  <a aria-label="Home">{path === '/' ? '' : <>{title}</>}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

export default withRedux(Landing);
