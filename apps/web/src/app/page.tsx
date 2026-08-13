'use client';

import Link from 'next/link';
import {
  Row,
  Col,
  Card,
  Statistic,
  Tag,
  Button,
  List,
  Typography,
  Space,
  Avatar,
  Spin,
} from 'antd';
import {
  AimOutlined,
  SendOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  SearchOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import {
  useGetMeQuery,
  useGetVacanciesQuery,
  useGetResumesQuery,
  useGetApplicationsQuery,
} from '@/store/api/baseApi';
import styles from './page.module.scss';

const { Title, Text, Paragraph } = Typography;

export default function DashboardPage() {
  const { data: user } = useGetMeQuery();
  const { data: vacanciesData, isLoading: isVacanciesLoading } = useGetVacanciesQuery({ limit: 5 });
  const { data: resumes } = useGetResumesQuery();
  const { data: applications } = useGetApplicationsQuery();

  const primaryResume = resumes?.find((r) => r.isPrimary) || resumes?.[0];

  return (
    <div className={styles.dashboardContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        {/* Hero Welcome Banner */}
        <Card className={styles.heroCard} variant="borderless">
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Space direction="vertical" size={8}>
                <Tag color="#3b82f6" className={styles.heroBadge}>
                  AI CAREER SCOUT ACTIVE
                </Tag>
                <Title level={2} className={styles.heroTitle}>
                  Welcome back, {user?.firstName || 'Developer'}!
                </Title>
                <Paragraph className={styles.heroSubtitle}>
                  Hunter-AI analyzed {vacanciesData?.total || 0} active software engineering roles matching your profile. You have {applications?.length || 0} active job applications.
                </Paragraph>
              </Space>
            </Col>
            <Col xs={24} md={8} className={styles.heroActionCol}>
              <Space direction="vertical" size={12} className={styles.fullWidthSpace}>
                <Link href="/jobs">
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<SearchOutlined />}
                    className={styles.heroButton}
                  >
                    Search Vacancies & Filter
                  </Button>
                </Link>

                <Link href="/resumes">
                  <Button
                    size="large"
                    block
                    icon={<FilePdfOutlined />}
                    className={styles.heroOutlineBtn}
                  >
                    Upload / Parse PDF Resume
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Realtime Key Metrics */}
        <Row gutter={[16, 16]} className={styles.statsRow}>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <Statistic
                title={<span className={styles.statTitle}>Active Vacancies</span>}
                value={vacanciesData?.total || 0}
                prefix={<AimOutlined className={styles.iconBlue} />}
                className={styles.statValue}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <Statistic
                title={<span className={styles.statTitle}>My Applications</span>}
                value={applications?.length || 0}
                prefix={<SendOutlined className={styles.iconGreen} />}
                className={styles.statValue}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <Statistic
                title={<span className={styles.statTitle}>Candidate Resumes</span>}
                value={resumes?.length || 0}
                prefix={<FilePdfOutlined className={styles.iconPurple} />}
                className={styles.statValue}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card className={styles.statCard}>
              <Statistic
                title={<span className={styles.statTitle}>Primary Role Grade</span>}
                value={primaryResume?.parsedData?.grade || 'Middle'}
                prefix={<ThunderboltOutlined className={styles.iconYellow} />}
                className={styles.statValue}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Layout */}
        <Row gutter={[24, 24]}>
          {/* Recommended Jobs Column */}
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <ThunderboltOutlined className={styles.iconYellow} />
                  <span className={styles.cardHeaderTitle}>Recent Vacancies</span>
                </Space>
              }
              extra={
                <Link href="/jobs" className={styles.viewAllLink}>
                  View All Roles ({vacanciesData?.total || 0}) <ArrowRightOutlined />
                </Link>
              }
              className={styles.sectionCard}
            >
              {isVacanciesLoading ? (
                <div className={styles.loadingSpinner}>
                  <Spin size="large" />
                </div>
              ) : (
                <List
                  itemLayout="vertical"
                  dataSource={vacanciesData?.items || []}
                  renderItem={(job) => (
                    <List.Item key={job.id} className={styles.jobListItem}>
                      <Row align="middle" justify="space-between">
                        <Col xs={24} sm={16}>
                          <Space size={12} align="start">
                            <Avatar size={48} className={styles.companyAvatar}>
                              {job.company.charAt(0).toUpperCase()}
                            </Avatar>
                            <div>
                              <Title level={5} className={styles.jobTitle}>
                                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                              </Title>
                              <Space size={12} className={styles.jobMeta}>
                                <Text strong className={styles.companyText}>
                                  {job.company}
                                </Text>
                                <Text type="secondary">{job.city || job.country || 'Remote'}</Text>
                                <Text className={styles.salaryText}>
                                  {job.salaryMin
                                    ? `${job.salaryMin.toLocaleString()} ${job.currency}`
                                    : 'Salary negotiable'}
                                </Text>
                              </Space>
                              <Space size={6} wrap className={styles.tagGroup}>
                                {(job.skills || []).map((t) => (
                                  <Tag key={t} className={styles.techTag}>
                                    {t}
                                  </Tag>
                                ))}
                              </Space>
                            </div>
                          </Space>
                        </Col>

                        <Col xs={24} sm={8} className={styles.jobActionCol}>
                          <Link href={`/jobs/${job.id}`}>
                            <Button type="primary" icon={<ArrowRightOutlined />}>
                              View Role
                            </Button>
                          </Link>
                        </Col>
                      </Row>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Col>

          {/* Sidebar Insights Column */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={24} className={styles.fullWidthSpace}>
              <Card
                title={
                  <Space>
                    <CheckCircleFilled className={styles.iconGreen} />
                    <span className={styles.cardHeaderTitle}>Candidate Profile Alignment</span>
                  </Space>
                }
                className={styles.sectionCard}
              >
                {primaryResume ? (
                  <div>
                    <Paragraph className={styles.profileTitle}>
                      Active Resume: {primaryResume.title}
                    </Paragraph>
                    <Paragraph className={styles.profileDesc}>
                      Position: <strong>{primaryResume.parsedData?.position}</strong> ({primaryResume.parsedData?.grade})
                    </Paragraph>
                    <Space wrap className={styles.tagSpace}>
                      {(primaryResume.parsedData?.skills || []).map((sk) => (
                        <Tag key={sk} color="blue">
                          {sk}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                ) : (
                  <div>
                    <Paragraph className={styles.profileDesc}>
                      No primary resume detected. Upload your PDF CV in "My Resumes" to unlock AI match scoring!
                    </Paragraph>
                    <Link href="/resumes">
                      <Button type="primary" icon={<FilePdfOutlined />}>
                        Upload CV
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
}
