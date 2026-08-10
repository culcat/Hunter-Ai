'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  Row,
  Col,
  Card,
  Tag,
  Button,
  Typography,
  Space,
  Avatar,
  Breadcrumb,
  Progress,
  Divider,
  List,
  message,
} from 'antd';
import {
  EnvironmentOutlined,
  ThunderboltOutlined,
  CheckCircleFilled,
  SendOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import styles from './jobDetail.module.scss';

const { Title, Text, Paragraph } = Typography;

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      message.success('Application submitted successfully via Hunter-AI Scout!');
    }, 1200);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Dashboard</Link> },
            { title: <Link href="/jobs">Jobs</Link> },
            { title: `Role #${resolvedParams.id}` },
          ]}
          className={styles.breadcrumbMargin}
        />

        {/* Main Job Banner Card */}
        <Card className={styles.bannerCard}>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Space align="start" size={16}>
                <Avatar size={64} className={styles.avatarCompany}>
                  S
                </Avatar>
                <div>
                  <Title level={2} className={styles.roleTitle}>
                    Senior Full Stack Engineer (Next.js / NestJS)
                  </Title>
                  <Space size={16} className={styles.metaRow}>
                    <Text strong>Stels Cloud Tech</Text>
                    <Text type="secondary">
                      <EnvironmentOutlined /> Remote (US/EU)
                    </Text>
                    <Text strong className={styles.salaryHighlight}>
                      $140,000 - $170,000 / year
                    </Text>
                  </Space>
                </div>
              </Space>
            </Col>
            <Col xs={24} md={8} className={styles.actionCol}>
              <Space direction="vertical" align="end">
                <Tag color="green" className={styles.matchTag}>
                  96% Match Score
                </Tag>
                <Space>
                  <Button size="large" icon={<FileTextOutlined />}>
                    Tailor Resume
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    loading={isApplying}
                    onClick={handleApply}
                    className={styles.applyButton}
                  >
                    Quick Apply with AI
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {/* Job Details & Requirements */}
          <Col xs={24} lg={16}>
            <Card className={styles.mainCard}>
              <Title level={4}>About the Role</Title>
              <Paragraph className={styles.jobParagraph}>
                Stels Cloud Tech is building the next-generation autonomous cloud infrastructure platform. We are seeking a senior Full Stack Engineer with strong expertise in modern React (React 19 / Next.js App Router) and NestJS backend architecture with SQLite/TypeORM.
              </Paragraph>

              <Divider />

              <Title level={4}>Required Tech Stack</Title>
              <Space wrap size={[8, 12]} className={styles.techTagGroup}>
                {['React 19', 'Next.js 15', 'NestJS', 'TypeScript', 'TypeORM', 'SQLite', 'SCSS Modules', 'Redux Toolkit', 'Swagger / OpenAPI'].map((skill) => (
                  <Tag key={skill} color="processing" className={styles.techTag}>
                    {skill}
                  </Tag>
                ))}
              </Space>

              <Title level={4}>Key Responsibilities</Title>
              <List
                dataSource={[
                  'Design and develop high-performance SSR client web applications using Next.js 15 and Ant Design v5.',
                  'Architect modular NestJS backend services with SQLite database storage and TypeORM entities.',
                  'Enforce strict TypeScript typings, RTK Query API state management, and SCSS module styling.',
                  'Collaborate with AI autonomous subagents to streamline feature releases and E2E testing pipelines.',
                ]}
                renderItem={(item) => (
                  <List.Item className={styles.respItem}>
                    <Space align="start">
                      <CheckCircleFilled className={styles.checkIcon} />
                      <Text className={styles.respText}>{item}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* AI Match Scout Sidebar */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <ThunderboltOutlined className={styles.purpleIcon} />
                  <span>AI Scout Match Breakdown</span>
                </Space>
              }
              className={styles.sidebarCard}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">Technology Compatibility</Text>
                  <Progress percent={98} strokeColor="#10b981" />
                </div>

                <div>
                  <Text type="secondary">Seniority & Experience Fit</Text>
                  <Progress percent={94} strokeColor="#3b82f6" />
                </div>

                <div>
                  <Text type="secondary">Salary Benchmark Alignment</Text>
                  <Progress percent={92} strokeColor="#f59e0b" />
                </div>

                <Divider className={styles.dividerMargin} />

                <div>
                  <Text strong className={styles.edgeTitle}>
                    Competitive Edge Highlights
                  </Text>
                  <List
                    size="small"
                    dataSource={[
                      'Your experience with Next.js 15 + AntD puts you in top 2% of applicants.',
                      'NestJS + SQLite ORM architecture matches job requirements 1:1.',
                    ]}
                    renderItem={(h) => (
                      <List.Item className={styles.edgeItem}>
                        <Text type="secondary" className={styles.edgeText}>
                          • {h}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
