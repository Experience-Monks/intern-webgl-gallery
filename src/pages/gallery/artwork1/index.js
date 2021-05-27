import React, { useRef, useCallback, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import styles from './../gallery.module.scss';

import Head from '../../../components/Head/Head';

import { withRedux } from '../../../redux/withRedux';
import { setLandingLoaded } from '../../../redux/modules/app';

const ArtCanvas = dynamic(() => import('./artwork'), {
  ssr: false
});

export const isBrowser = typeof window !== 'undefined';
function Artwork() {
  const containerRef = useRef();
  const containerRef2 = useRef();
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
      <Head title="Amna's" />
      <div id="scene-container" className={styles.amna}>
        {isBrowser && <ArtCanvas></ArtCanvas>}
      </div>
      <section id = "title" className={styles.ml12} ref={containerRef}>
        A Thousand Splendid Suns
      </section>
      <audio autoplay loop src='../../assets/piano.ogg' type="audio/ogg">
      </audio>
      <section id = "quote" className={styles.ml12quote} ref={containerRef2}>
      </section>
    </main>
  );
}

export default withRedux(Artwork);
