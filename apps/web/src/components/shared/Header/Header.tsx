'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Button, Tag, Space, Avatar, Modal, Form, Input, message } from 'antd';
import {
  DashboardOutlined,
  SearchOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  ThunderboltOutlined,
  UserOutlined,
  BellOutlined,
  LoginOutlined,
} from '@ant-design/icons';
import { useGetMeQuery, useLoginMutation, useRegisterMutation } from '@/store/api/baseApi';
import styles from './Header.module.scss';

export const Header = () => {
  const pathname = usePathname();
  const { data: user } = useGetMeQuery();
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form] = Form.useForm();

  const handleAuthSubmit = async (values: any) => {
    try {
      if (isRegisterMode) {
        const res = await register({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
        }).unwrap();
        localStorage.setItem('hunter_ai_token', res.accessToken);
        message.success('Successfully registered!');
      } else {
        const res = await login({
          email: values.email,
          password: values.password,
        }).unwrap();
        localStorage.setItem('hunter_ai_token', res.accessToken);
        message.success('Successfully logged in!');
      }
      setAuthModalVisible(false);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.data?.message || 'Authentication failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hunter_ai_token');
    message.info('Logged out');
    window.location.reload();
  };

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
      key: '/resumes',
      icon: <FileTextOutlined />,
      label: <Link href="/resumes">My Resumes</Link>,
    },
    {
      key: '/applications',
      icon: <FolderOpenOutlined />,
      label: <Link href="/applications">Applications</Link>,
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
        selectedKeys={[pathname.startsWith('/jobs/') ? '/jobs' : pathname]}
        items={menuItems}
        className={styles.navMenu}
      />

      <div className={styles.actions}>
        <Button icon={<BellOutlined />} type="text" />

        {user ? (
          <Space size={8}>
            <Avatar icon={<UserOutlined />} className={styles.avatarUser} />
            <span className={styles.userName}>{user.firstName || user.email.split('@')[0]}</span>
            <Button size="small" type="link" onClick={handleLogout}>
              Logout
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => setAuthModalVisible(true)}
          >
            Sign In
          </Button>
        )}
      </div>

      <Modal
        title={isRegisterMode ? 'Create Account' : 'Sign In to Hunter-AI'}
        open={authModalVisible}
        onCancel={() => setAuthModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAuthSubmit}>
          {isRegisterMode && (
            <Form.Item name="firstName" label="First Name">
              <Input placeholder="Alexander" />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Enter a valid email' }]}
          >
            <Input placeholder="alexander@example.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, min: 8, message: 'Password min 8 chars' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large">
            {isRegisterMode ? 'Register Account' : 'Sign In'}
          </Button>

          <div className={styles.authModalFooter}>
            <Button
              type="link"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
            >
              {isRegisterMode ? 'Already have an account? Sign In' : 'Need an account? Register'}
            </Button>
          </div>
        </Form>
      </Modal>
    </header>
  );
};
