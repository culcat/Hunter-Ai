'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Tag,
  Button,
  List,
  Typography,
  Space,
  Avatar,
  Breadcrumb,
  Switch,
  Slider,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import styles from './jobs.module.scss';

const { Title, Text, Paragraph } = Typography;

const allJobs = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer (Next.js / NestJS)',
    company: 'Stels Cloud Tech',
    location: 'Remote (US/EU)',
    salary: '$140,000 - $170,000',
    type: 'Full-time',
    matchScore: 96,
    tags: ['React 19', 'Next.js', 'NestJS', 'TypeScript', 'SQLite'],
    description: 'We are seeking an expert Full Stack Engineer to lead our next-gen developer platform built on Next.js 15, NestJS microservices, and TypeORM.',
    posted: '2 hours ago',
  },
  {
    id: '2',
    title: 'Lead AI Applications Architect',
    company: 'NeuralFlow Systems',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$180,000 - $220,000',
    type: 'Full-time',
    matchScore: 92,
    tags: ['Python', 'LangChain', 'TypeScript', 'Vector DB', 'Docker'],
    description: 'Architect autonomous agent workflows and integration pipelines using Google Antigravity SDK and modern LLM orchestration.',
    posted: '5 hours ago',
  },
  {
    id: '3',
    title: 'Principal Frontend Engineer',
    company: 'Veloce Data',
    location: 'Remote',
    salary: '$150,000 - $185,000',
    type: 'Full-time',
    matchScore: 88,
    tags: ['React', 'TypeScript', 'Ant Design', 'Redux Toolkit'],
    description: 'Build enterprise-grade SaaS dashboards with high-performance UI rendering, SCSS modules, and RTK Query caching.',
    posted: '1 day ago',
  },
  {
    id: '4',
    title: 'Backend Systems Engineer (NestJS / SQLite)',
    company: 'Hunter Data Inc.',
    location: 'Austin, TX (Remote)',
    salary: '$130,000 - $160,000',
    type: 'Contract',
    matchScore: 85,
    tags: ['NestJS', 'TypeORM', 'SQLite', 'Swagger', 'Jest'],
    description: 'Develop high-throughput REST API services with DTO validation, TypeORM migrations, and automated OpenAPI documentation.',
    posted: '2 days ago',
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filteredJobs = allJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRemote = !remoteOnly || j.location.toLowerCase().includes('remote');
    const matchesTech =
      selectedTech.length === 0 || selectedTech.some((t) => j.tags.includes(t));
    return matchesSearch && matchesRemote && matchesTech;
  });

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Dashboard</Link> },
            { title: 'Search Jobs' },
          ]}
          className={styles.breadcrumbMargin}
        />

        {/* Page Title Header */}
        <div className={styles.pageHeader}>
          <Title level={2} className={styles.pageTitle}>
            Career Opportunities & Match Scout
          </Title>
          <Paragraph type="secondary">
            AI-matched engineering roles sorted by your technology stack compatibility.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Filters Sidebar */}
          <Col xs={24} md={7} lg={6}>
            <Card
              title={
                <Space>
                  <FilterOutlined className={styles.iconPrimary} />
                  <span>Role Filters</span>
                </Space>
              }
              className={styles.cardRounded}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Text strong className={styles.fieldLabel}>
                    Search Keyword
                  </Text>
                  <Input
                    placeholder="Role title or company..."
                    prefix={<SearchOutlined />}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                  />
                </div>

                <div>
                  <Text strong className={styles.fieldLabel}>
                    Tech Stack Filter
                  </Text>
                  <Select
                    mode="multiple"
                    placeholder="Select technologies..."
                    style={{ width: '100%' }}
                    value={selectedTech}
                    onChange={setSelectedTech}
                    options={[
                      { label: 'React 19', value: 'React 19' },
                      { label: 'Next.js', value: 'Next.js' },
                      { label: 'NestJS', value: 'NestJS' },
                      { label: 'TypeScript', value: 'TypeScript' },
                      { label: 'SQLite', value: 'SQLite' },
                      { label: 'Python', value: 'Python' },
                    ]}
                  />
                </div>

                <div>
                  <div className={styles.remoteSwitchRow}>
                    <Text strong>Remote Roles Only</Text>
                    <Switch checked={remoteOnly} onChange={setRemoteOnly} />
                  </div>
                </div>

                <div>
                  <Text strong className={styles.fieldLabel}>
                    Min Salary Expectation
                  </Text>
                  <Slider defaultValue={120} min={80} max={250} step={10} tooltip={{ formatter: (v) => `$${v}k` }} />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Job Listings List */}
          <Col xs={24} md={17} lg={18}>
            <Card
              title={
                <Space>
                  <span>Showing {filteredJobs.length} Matched Roles</span>
                  <Tag color="blue">{selectedTech.length > 0 ? `${selectedTech.length} tech filters` : 'All Stack'}</Tag>
                </Space>
              }
              className={styles.cardRounded}
            >
              <List
                itemLayout="vertical"
                size="large"
                dataSource={filteredJobs}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    className={styles.listItem}
                    extra={
                      <Space direction="vertical" align="end" size="middle">
                        <Tag color="green" className={styles.matchScoreTag}>
                          {item.matchScore}% Match Score
                        </Tag>
                        <Text strong className={styles.salaryText}>
                          {item.salary}
                        </Text>
                        <Link href={`/jobs/${item.id}`}>
                          <Button type="primary" size="large" icon={<ArrowRightOutlined />}>
                            View & Apply
                          </Button>
                        </Link>
                      </Space>
                    }
                  >
                    <List.Item.Meta
                      avatar={<Avatar size={48} className={styles.avatarCompany}>{item.company[0]}</Avatar>}
                      title={
                        <Link href={`/jobs/${item.id}`} className={styles.roleTitleLink}>
                          {item.title}
                        </Link>
                      }
                      description={
                        <Space size={16} className={styles.companyMetaRow}>
                          <Text strong>{item.company}</Text>
                          <Text type="secondary">
                            <EnvironmentOutlined /> {item.location}
                          </Text>
                          <Tag color="default">{item.type}</Tag>
                        </Space>
                      }
                    />

                    <Paragraph type="secondary" className={styles.jobDescription}>
                      {item.description}
                    </Paragraph>

                    <Space wrap>
                      {item.tags.map((t) => (
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
        </Row>
      </div>
    </div>
  );
}
