import React from 'react';
import { Tag } from 'antd';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Hunter-Ai</div>
      <Tag color="processing">Monorepo Active</Tag>
    </header>
  );
};
