'use client';

import { useState } from 'react';
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
  Modal,
  Drawer,
  Form,
  message,
  Progress,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  StarOutlined,
  AimOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import {
  useGetVacanciesQuery,
  useParseVacanciesMutation,
  useGetResumesQuery,
  useEvaluateMatchMutation,
  useAddFavoriteMutation,
} from '@/store/api/baseApi';
import type { Vacancy, WorkFormat, GradeLevel, AiMatchResult } from '@hunter-ai/types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [workFormat, setWorkFormat] = useState<WorkFormat | undefined>(undefined);
  const [grade, setGrade] = useState<GradeLevel | undefined>(undefined);

  const { data: vacanciesData, isLoading, refetch } = useGetVacanciesQuery({
    searchQuery: searchQuery || undefined,
    workFormat,
    grade,
  });

  const { data: resumes } = useGetResumesQuery();
  const [parseVacancies, { isLoading: isParsing }] = useParseVacanciesMutation();
  const [evaluateMatch, { isLoading: isEvaluating }] = useEvaluateMatchMutation();
  const [addFavorite] = useAddFavoriteMutation();

  const [parseModalVisible, setParseModalVisible] = useState(false);
  const [parseForm] = Form.useForm();

  const [matchDrawerVacancy, setMatchDrawerVacancy] = useState<Vacancy | null>(null);
  const [matchResult, setMatchResult] = useState<AiMatchResult | null>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  const handleParseSubmit = async (values: any) => {
    try {
      await parseVacancies({
        target: values.target,
        source: values.source,
      }).unwrap();
      message.success('Vacancies parsed & ingested successfully!');
      setParseModalVisible(false);
      parseForm.resetFields();
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to parse vacancies');
    }
  };

  const handleEvaluateMatchClick = async (vacancy: Vacancy) => {
    setMatchDrawerVacancy(vacancy);
    const primaryResume = resumes?.find((r) => r.isPrimary) || resumes?.[0];
    if (primaryResume) {
      setSelectedResumeId(primaryResume.id);
      runEvaluate(primaryResume.id, vacancy.id);
    }
  };

  const runEvaluate = async (resumeId: string, vacancyId: string) => {
    try {
      const res = await evaluateMatch({ resumeId, vacancyId }).unwrap();
      setMatchResult(res);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to calculate AI match score');
    }
  };

  const handleAddFav = async (vacancyId: string) => {
    try {
      await addFavorite(vacancyId).unwrap();
      message.success('Added to favorites!');
    } catch (err: any) {
      message.error('Failed to add to favorites');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#fff' }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Title level={2} style={{ color: '#fff', margin: 0 }}>
                AI Vacancy Search & Scraper
              </Title>
              <Paragraph style={{ color: '#94a3b8', fontSize: 16 }}>
                Filter active software engineering roles or parse new postings from HeadHunter, Habr Career, GetMatch & corporate career sites.
              </Paragraph>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setParseModalVisible(true)}
              >
                Parse New Vacancies
              </Button>
            </Col>
          </Row>

          {/* Filter Bar */}
          <Card style={{ background: '#131b2e', borderColor: '#1e293b' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={10}>
                <Input
                  size="large"
                  placeholder="Search position, company, or stack (e.g. React, NestJS)..."
                  prefix={<SearchOutlined style={{ color: '#64748b' }} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
              <Col xs={12} md={7}>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Work Format"
                  allowClear
                  value={workFormat}
                  onChange={(val) => setWorkFormat(val)}
                >
                  <Option value="remote">Remote Work</Option>
                  <Option value="office">Office</Option>
                  <Option value="hybrid">Hybrid</Option>
                </Select>
              </Col>
              <Col xs={12} md={7}>
                <Select
                  size="large"
                  style={{ width: '100%' }}
                  placeholder="Grade Level"
                  allowClear
                  value={grade}
                  onChange={(val) => setGrade(val)}
                >
                  <Option value="Junior">Junior</Option>
                  <Option value="Middle">Middle</Option>
                  <Option value="Senior">Senior</Option>
                  <Option value="Lead">Lead</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Vacancies List */}
          <List
            loading={isLoading}
            dataSource={vacanciesData?.items || []}
            renderItem={(item) => (
              <Card
                key={item.id}
                style={{
                  background: '#131b2e',
                  borderColor: '#1e293b',
                  marginBottom: 16,
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col xs={24} md={16}>
                    <Space direction="vertical" size={6}>
                      <Space align="center" wrap>
                        <Title level={4} style={{ color: '#fff', margin: 0 }}>
                          <Link href={`/jobs/${item.id}`} style={{ color: '#f8fafc' }}>
                            {item.title}
                          </Link>
                        </Title>
                        <Tag color="blue">{item.source.toUpperCase()}</Tag>
                        <Tag color="purple">{item.grade}</Tag>
                        <Tag color="cyan">{item.workFormat.toUpperCase()}</Tag>
                      </Space>

                      <Text style={{ color: '#94a3b8' }}>
                        Company: <strong style={{ color: '#cbd5e1' }}>{item.company}</strong> • Location: <EnvironmentOutlined /> {item.city || item.country || 'Remote'} • Salary: {item.salaryMin ? `${item.salaryMin.toLocaleString()} - ${item.salaryMax?.toLocaleString() || ''} ${item.currency}` : 'Salary not disclosed'}
                      </Text>

                      <Paragraph
                        style={{ color: '#cbd5e1', margin: '4px 0' }}
                        ellipsis={{ rows: 2 }}
                      >
                        {item.description}
                      </Paragraph>

                      <Space size={6} wrap style={{ marginTop: 6 }}>
                        {(item.skills || []).map((tech) => (
                          <Tag key={tech} color="geekblue">
                            {tech}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  </Col>

                  <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
                    <Space direction="vertical" size={12} style={{ width: '100%', alignItems: 'flex-end' }}>
                      <Space>
                        <Button
                          icon={<StarOutlined />}
                          onClick={() => handleAddFav(item.id)}
                        >
                          Save
                        </Button>
                        <Button
                          type="primary"
                          icon={<AimOutlined />}
                          onClick={() => handleEvaluateMatchClick(item)}
                        >
                          AI Match Score
                        </Button>
                      </Space>

                      <Link href={`/jobs/${item.id}`}>
                        <Button type="link" icon={<ArrowRightOutlined />}>
                          View Details & Apply
                        </Button>
                      </Link>
                    </Space>
                  </Col>
                </Row>
              </Card>
            )}
          />
        </Space>
      </div>

      {/* Modal: Parse Vacancies */}
      <Modal
        title="Parse Vacancies via Automated Scraper"
        open={parseModalVisible}
        onCancel={() => setParseModalVisible(false)}
        onOk={() => parseForm.submit()}
        confirmLoading={isParsing}
        okText="Start Scraper"
      >
        <Form form={parseForm} layout="vertical" onFinish={handleParseSubmit}>
          <Form.Item
            name="target"
            label="Target URL or Career Site Keyword"
            rules={[{ required: true, message: 'Please enter target URL' }]}
          >
            <Input placeholder="https://hh.ru/vacancy/1234567 or corporate site URL" />
          </Form.Item>

          <Form.Item name="source" label="Source Parser Engine">
            <Select placeholder="Auto-detect source">
              <Option value="headhunter">HeadHunter (HH.ru API/HTML)</Option>
              <Option value="habr">Habr Career Parser</Option>
              <Option value="getmatch">GetMatch Parser</Option>
              <Option value="custom">Playwright Browser Scraper (Corporate Portals)</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer: AI Match Score Evaluation */}
      <Drawer
        title="AI Match Score Analysis"
        placement="right"
        width={500}
        open={Boolean(matchDrawerVacancy)}
        onClose={() => setMatchDrawerVacancy(null)}
      >
        {matchDrawerVacancy && (
          <Space direction="vertical" size={20} style={{ width: '100%' }}>
            <div>
              <Title level={4} style={{ margin: 0 }}>
                {matchDrawerVacancy.title}
              </Title>
              <Text type="secondary">{matchDrawerVacancy.company}</Text>
            </div>

            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Select Candidate Resume:
              </Text>
              <Select
                style={{ width: '100%' }}
                value={selectedResumeId}
                onChange={(val) => {
                  setSelectedResumeId(val);
                  runEvaluate(val, matchDrawerVacancy.id);
                }}
              >
                {(resumes || []).map((r) => (
                  <Option key={r.id} value={r.id}>
                    {r.title} ({r.parsedData?.position}) {r.isPrimary ? '[PRIMARY]' : ''}
                  </Option>
                ))}
              </Select>
            </div>

            {isEvaluating ? (
              <Paragraph>Evaluating candidate alignment...</Paragraph>
            ) : matchResult ? (
              <Card style={{ background: '#0f172a', borderColor: '#1e293b' }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Progress
                    type="dashboard"
                    percent={matchResult.score}
                    strokeColor={matchResult.score >= 70 ? '#10b981' : '#f59e0b'}
                  />
                  <Title level={4} style={{ color: '#f8fafc', margin: '8px 0' }}>
                    {matchResult.score}% Compatibility Score
                  </Title>
                  <Text style={{ color: '#94a3b8' }}>{matchResult.recommendation}</Text>
                </div>

                <Divider style={{ borderColor: '#334155' }} />

                <Title level={5} style={{ color: '#10b981' }}>
                  <CheckCircleOutlined /> Key Strengths
                </Title>
                <List
                  size="small"
                  dataSource={matchResult.strengths}
                  renderItem={(s) => <List.Item style={{ color: '#cbd5e1' }}>• {s}</List.Item>}
                />

                <Divider style={{ borderColor: '#334155' }} />

                <Title level={5} style={{ color: '#ef4444' }}>
                  <CloseCircleOutlined /> Areas for Improvement
                </Title>
                <List
                  size="small"
                  dataSource={matchResult.weaknesses}
                  renderItem={(w) => <List.Item style={{ color: '#cbd5e1' }}>• {w}</List.Item>}
                />

                {matchResult.missingSkills.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <Text strong style={{ color: '#f8fafc', display: 'block', marginBottom: 6 }}>
                      Missing Required Skills:
                    </Text>
                    <Space wrap>
                      {matchResult.missingSkills.map((sk) => (
                        <Tag key={sk} color="red">
                          {sk}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                )}
              </Card>
            ) : (
              <Paragraph>Please select a resume to calculate score.</Paragraph>
            )}
          </Space>
        )}
      </Drawer>
    </div>
  );
}
