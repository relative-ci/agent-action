import React from 'react';
import { Typography } from 'antd'

import logoUrl from '../assets/relative-ci--logo.png';
import css from './layout.module.css';

export const Layout = (props) => {
  const { children } = props;

  return (
    <div className={css.root}>
      <header className={css.header}>
        <Typography.Title level={4}>
          <a className={css.headerLink} href="https://relative-ci.com/documentation/examples">
            <img className={css.headerLogo} src={logoUrl} alt="RelativeCI" />
            RelativeCI examples
          </a>
        </Typography.Title>
      </header>
      <main className={css.main}>
        {children}
      </main>
    </div>
  );
};
