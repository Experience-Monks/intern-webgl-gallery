import React, { useRef, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './index.module.scss';

import Head from '../components/Head/Head';
import { withRedux } from '../redux/withRedux';
import { setLandingLoaded } from '../redux/modules/app';

import gallery from '../data/gallery';

const P5Wrapper = dynamic(import('react-p5-wrapper'), {
  ssr: false,
  loading: () => <div className="sketch-holder">Loading...</div>
});

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
      <style jsx>
        {`
          .sketch {
            font-family: 'Girassol', cursive;
          }
        `}
      </style>

      <P5Wrapper className={styles.sketch} sketch={require(`./landing`).default(600, 600)} />
      <section className={styles.hero} ref={containerRef}>
        <div className={styles.row}>
          <h1 className={styles.title}>WE3 Creative Gallery</h1>
        </div>
        <div className={styles.row}>
          <ul className={styles.routes}>
            {Object.values(gallery).map(({ path, title }) => (
              <li key={path}>
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
