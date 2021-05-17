import React, { useRef, useCallback, useEffect, Component } from 'react';
import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';

import styles from './../gallery.module.scss';

import Head from '../../../components/Head/Head';

import { withRedux } from '../../../redux/withRedux';
import { setLandingLoaded } from '../../../redux/modules/app';
import Art from './artwork';

class ArtCanvas extends Component {
  componentDidMount() {
    Art(this.scene);
  }
  render() {
    return (
      <>
        <div ref={(element) => (this.scene = element)} />
      </>
    );
  }
}

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

  return (
    <main className={styles.Landing}>
      <Head title="ARTWORK TITLE HERE" />
      <ArtCanvas />
      <section className={styles.hero} ref={containerRef}>
        PAGE INFO ETC GOES HERE
      </section>
    </main>
  );
}

export default withRedux(Artwork);
