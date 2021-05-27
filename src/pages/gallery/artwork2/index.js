import React, { useRef, useCallback, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import styles from './../gallery.module.scss';

import Head from '../../../components/Head/Head';

import { withRedux } from '../../../redux/withRedux';
import { setLandingLoaded } from '../../../redux/modules/app';
import disposeObjects from '../../../utils/dispose-objects';
import Art from './artwork';

const ArtCanvas = dynamic(() => import('./artwork'), {
  ssr: false
});

export const isBrowser = typeof window !== 'undefined';

function Artwork() {
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

  useEffect(() => {
    return () => {
      if (ArtCanvas && isBrowser) {
        require('../../../utils/dispose-objects');
        disposeObjects(ArtCanvas, this);
      }
    };
  }, []);

  return (
    <main className={styles.Landing}>
      <Head title="MRN" />
      <div id="scene-container" className={styles.canvasWrap}>
        {isBrowser && <ArtCanvas></ArtCanvas>}
      </div>
      <section className={styles.hero} ref={containerRef}></section>
    </main>
  );
}

export default withRedux(Artwork);
