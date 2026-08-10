'use client';

import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { Header } from '@/components/shared/Header/Header';
import en from '@/i18n/locales/en.json';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  return (
    <main>
      <Header />
      <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <Card hoverable>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Title level={2}>{en.welcome}</Title>
            <Paragraph type="secondary">{en.subtitle}</Paragraph>
            <Button type="primary" size="large">
              Get Started
            </Button>
          </Space>
        </Card>
      </div>
    </main>
  );
}
