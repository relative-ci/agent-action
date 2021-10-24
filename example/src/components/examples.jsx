import React from 'react';
import { Card } from 'antd';

import GithubIcon from '../assets/github.inline.svg';
import css from './examples.module.css';

export const Examples = (props) => {
  const { data } = props;

  const repos = data?.organization?.repositories?.edges || [];

  return (
    <div className={css.root}>
      {repos.map(({ node }) => (
        <a className={css.item} href={node.url} key={node.name}>
          <Card key={node.name}>
            <Card.Meta
              avatar={<GithubIcon width={32} />}
              title={node.name}
              description={node.description}
            />
          </Card>
        </a>
      ))}
    </div>
  );
};
