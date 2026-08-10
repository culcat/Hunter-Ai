'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Button, Tag, Space, Avatar } from 'antd';
import {
  DashboardOutlined,
  SearchOutlined,
  ThunderboltOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: '/jobs',
      icon: <SearchOutlined />,
      label: <Link href="/jobs">Search Jobs</Link>,
    },
    {
      key: '/insights',
      icon: <ThunderboltOutlined />,
      label: <Link href="/insights">AI Insights</Link>,
    },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand}>
        <span className={styles.logo}>Hunter-AI</span>
        <Tag color="blue" className={styles.badge}>
          CAREER SCOUT
        </Tag>
      </Link>

      <Menu
        mode="horizontal"
        selectedKeys={[pathname === '/jobs/1' ? '/jobs' : pathname]}
        items={menuItems}
        className={styles.navMenu}
      />

      <div className={styles.actions}>
        <Button icon={<BellOutlined />} type="text" />
        <Space size={8}>
          <Avatar icon={<UserOutlined />} className={styles.avatarUser} />
          <span className={styles.userName}>Alex P.</span>
        </Space>
      </div>
    </header>
  );
};
