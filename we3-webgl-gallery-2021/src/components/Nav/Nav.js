import React from 'react';
import classnames from 'classnames';
import checkProps from '@jam3/react-check-extra-props';
import Link from 'next/link';

import styles from './Nav.module.scss';

import jam3LogoSrc from '../../assets/images/jamlogoanim.gif';

import routes from '../../data/routes';
import galleryworks from '../../data/gallery';
function Nav() {
  return (
    <nav className={classnames(styles.Nav)}>
      <div className={styles.wrapper}>
        <ul className={styles.routes}>
          {Object.values(routes).map(({ path, title }) => (
            <li key={path}>
              <Link href={path}>
                <a aria-label="Home">
                  {path === '/' ? <img className={styles.threeLogo} src={jam3LogoSrc} alt="Jam3" /> : <>{title}</>}
                </a>
              </Link>
            </li>
          ))}
          {Object.values(galleryworks).map(({ path, title }) => (
            <li key={path}>
              <Link href={path}>
                <a aria-label="Home">{title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

Nav.propTypes = checkProps({});

Nav.defaultProps = {};

export default Nav;
