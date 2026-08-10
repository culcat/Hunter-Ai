'use client';

import React from 'react';
import Link from 'next/link';
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Tag,
  Button,
  List,
  Typography,
  Space,
  Avatar,
} from 'antd';
import {
  AimOutlined,
  SendOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import styles from './page.module.scss';

const { Title, Text, Paragraph } = Typography;

const mockMatchedJobs = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer (Next.js / NestJS)',
    company: 'Stels Cloud Tech',
    location: 'Remote (US/EU)',
    salary: '$140k - $170k',
    matchScore: 96,
    tags: ['React 19', 'Next.js', 'NestJS', 'TypeScript', 'SQLite'],
    posted: '2 hours ago',
  },
  {
    id: '2',
    title: 'Lead AI Applications Architect',
    company: 'NeuralFlow Systems',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$180k - $220k',
    matchScore: 92,
    tags: ['Python', 'LangChain', 'TypeScript', 'Vector DB', 'Docker'],
    posted: '5 hours ago',
  },
  {
    id: '3',
    title: 'Principal Frontend Engineer',
    company: 'Veloce Data',
    location: 'Remote',
    salary: '$150k - $185k',
    matchScore: 88,
    tags: ['React', 'TypeScript', 'Ant Design', 'Redux Toolkit'],
    posted: '1 day ago',
  },
];

const mockAiTips = [
  {
    id: 't1',
    title: 'Resume Alignment Boost (+12% Match Rate)',
    desc: 'Your profile matches 96% of Senior Full Stack roles when highlighting NestJS & SQLite ORM experiences.',
    type: 'success',
  },
  {
    id: 't2',
    title: 'Interview Preparation Readiness',
    desc: 'System Design questions for Next.js SSR vs SSG recommended based on your recent applications.',
    type: 'info',
  },
];

export default function DashboardPage() {
  return (
    <div className={styles.dashboardContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        {/* Hero Welcome Banner */}
        <Card className={styles.heroCard} bordered={false}>
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={8}>
                <Tag color="#3b82f6" className={styles.heroBadge}>
                  AI CAREER SCOUT ACTIVE
                </Tag>
                <Title level={2} className={styles.heroTitle}>
                  Welcome back, Alex!
                </Title>
                <Paragraph className={styles.heroSubtitle}>
                  Hunter-AI analyzed 142 tech roles matching your stack today. You have 3 high-priority interviews pending.
                </Paragraph>
              </Space>
            </Col>
            <Col xs={24} md={8} className={styles.heroActionCol}>
              <Link href="/jobs">
                <Button type="primary" size="large" icon={<SearchOutlined />} className={styles.heroButton}>
                  Explore Job Feed
                </Button>
              </Link>
            </Col>
          </Row>
        </Card>

        {/* Metrics Grid */}
        <Row gutter={[16, 16]} className={styles.gridRow}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className={styles.statCard}>
              <Statistic
                title="Overall Match Score"
                value={94}
                suffix="%"
                prefix={<AimOutlined className={styles.iconPrimary} />}
              />
              <Progress percent={94} showInfo={false} strokeColor="#3b82f6" size="small" className={styles.statProgress} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className={styles.statCard}>
              <Statistic
                title="Applications Sent"
                value={28}
                prefix={<SendOutlined className={styles.iconSuccess} />}
              />
              <Text type="secondary" className={styles.statSubtext}>
                12 responses received (+15%)
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className={styles.statCard}>
              <Statistic
                title="Interview Rate"
                value={42.8}
                suffix="%"
                prefix={<TrophyOutlined className={styles.iconWarning} />}
              />
              <Text type="secondary" className={styles.statSubtext}>
                Top 5% among applicants
              </Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable className={styles.statCard}>
              <Statistic
                title="AI Scout Scans"
                value={142}
                prefix={<ThunderboltOutlined className={styles.iconPurple} />}
              />
              <Text type="secondary" className={styles.statSubtext}>
                Updated 10 mins ago
              </Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          {/* Top Job Matches */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <AimOutlined className={styles.iconPrimary} />
                  <span>Top AI Matched Opportunities</span>
                </Space>
              }
              extra={
                <Link href="/jobs">
                  <Button type="link">View All ({mockMatchedJobs.length})</Button>
                </Link>
              }
              className={styles.statCard}
            >
              <List
                itemLayout="vertical"
                dataSource={mockMatchedJobs}
                renderItem={(job) => (
                  <List.Item
                    key={job.id}
                    extra={
                      <Space direction="vertical" align="end">
                        <Tag color="green" className={styles.matchTag}>
                          {job.matchScore}% Match
                        </Tag>
                        <Text strong className={styles.salaryText}>
                          {job.salary}
                        </Text>
                        <Link href={`/jobs/${job.id}`}>
                          <Button type="primary" size="small">
                            View Role <ArrowRightOutlined />
                          </Button>
                        </Link>
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar className={styles.avatarDark}>{job.company[0]}</Avatar>}
                      title={
                        <Link href={`/jobs/${job.id}`} className={styles.jobTitleLink}>
                          {job.title}
                        </Link>
                      }
                      description={
                        <Space size={12}>
                          <Text strong>{job.company}</Text>
                          <Text type="secondary">{job.location}</Text>
                          <Text type="secondary">
                            <ClockCircleOutlined /> {job.posted}
                          </Text>
                        </Space>
                      }
                    />
                    <Space wrap className={styles.tagGroup}>
                      {job.tags.map((t) => (
                        <Tag key={t} className={styles.techTag}>
                          {t}
                        </Tag>
                      ))}
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* AI Insights Sidebar */}
          <Col xs={24} lg={8}>
            <Card
              title={
                <Space>
                  <ThunderboltOutlined className={styles.iconPurple} />
                  <span>AI Scout Insights</span>
                </Space>
              }
              className={styles.statCard}
            >
              <List
                dataSource={mockAiTips}
                renderItem={(tip) => (
                  <List.Item className={styles.tipItem}>
                    <Space align="start">
                      <CheckCircleFilled className={tip.type === 'success' ? styles.iconSuccess : styles.iconPrimary} />
                      <div>
                        <Text strong className={styles.tipTitle}>
                          {tip.title}
                        </Text>
                        <Text type="secondary" className={styles.tipDesc}>
                          {tip.desc}
                        </Text>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
              <Link href="/insights">
                <Button block type="dashed" className={styles.actionButtonBlock}>
                  Deep AI Skill Analysis
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
