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
  AimOutlined,
  StarOutlined,
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
import styles from './jobs.module.scss';

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
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        <Space direction="vertical" size={24} className={styles.fullWidthSpace}>
          <Row align="middle" justify="space-between">
            <Col xs={24} md={16}>
              <Title level={2} className={styles.pageHeaderTitle}>
                AI Vacancy Search & Scraper
              </Title>
              <Paragraph className={styles.pageHeaderSub}>
                Filter active software engineering roles or parse new postings from HeadHunter, Habr Career, GetMatch & corporate career sites.
              </Paragraph>
            </Col>
            <Col xs={24} md={8} className={styles.rightCol}>
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
          <Card className={styles.filterCard}>
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={10}>
                <Input
                  size="large"
                  placeholder="Search position, company, or stack (e.g. React, NestJS)..."
                  prefix={<SearchOutlined className={styles.searchIcon} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
              <Col xs={12} md={7}>
                <Select
                  size="large"
                  className={styles.fullWidthSelect}
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
                  className={styles.fullWidthSelect}
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
              <Card key={item.id} className={styles.vacancyCard}>
                <Row align="middle" justify="space-between">
                  <Col xs={24} md={16}>
                    <Space direction="vertical" size={6}>
                      <Space align="center" wrap>
                        <Title level={4} className={styles.vacancyTitle}>
                          <Link href={`/jobs/${item.id}`} className={styles.vacancyTitleLink}>
                            {item.title}
                          </Link>
                        </Title>
                        <Tag color="blue">{item.source.toUpperCase()}</Tag>
                        <Tag color="purple">{item.grade}</Tag>
                        <Tag color="cyan">{item.workFormat.toUpperCase()}</Tag>
                      </Space>

                      <Text className={styles.vacancyMeta}>
                        Company: <strong className={styles.companyHighlight}>{item.company}</strong> • Location: <EnvironmentOutlined /> {item.city || item.country || 'Remote'} • Salary: {item.salaryMin ? `${item.salaryMin.toLocaleString()} - ${item.salaryMax?.toLocaleString() || ''} ${item.currency}` : 'Salary not disclosed'}
                      </Text>

                      <Paragraph className={styles.vacancyDesc} ellipsis={{ rows: 2 }}>
                        {item.description}
                      </Paragraph>

                      <Space size={6} wrap className={styles.tagSpace}>
                        {(item.skills || []).map((tech) => (
                          <Tag key={tech} className={styles.techTag}>
                            {tech}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  </Col>

                  <Col xs={24} md={8} className={styles.actionRightCol}>
                    <Space direction="vertical" size={12} className={styles.actionStackEnd}>
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
        title="Парсинг новых вакансий по ключевому слову"
        open={parseModalVisible}
        onCancel={() => setParseModalVisible(false)}
        onOk={() => parseForm.submit()}
        confirmLoading={isParsing}
        okText="Запустить парсинг"
      >
        <Form form={parseForm} layout="vertical" onFinish={handleParseSubmit}>
          <Form.Item
            name="target"
            label="Ключевое слово для поиска вакансий"
            rules={[{ required: true, message: 'Пожалуйста, введите ключевое слово' }]}
            extra="Введите профессию или стек технологий (например, React, NestJS, Python, Frontend, DevOps). Парсер автоматически соберет вакансии с HH.ru, Хабр Карьеры и карьерных порталов."
          >
            <Input size="large" placeholder="Например: React Developer, Python, NestJS, DevOps..." />
          </Form.Item>

          <Form.Item name="source" label="Источник или движок парсинга">
            <Select size="large" placeholder="Все источники (Авто-определение)" allowClear>
              <Option value="headhunter">HeadHunter (HH.ru API)</Option>
              <Option value="habr">Хабр Карьера</Option>
              <Option value="getmatch">GetMatch</Option>
              <Option value="custom">Playwright Browser Scraper (Карьерные сайты IT-компаний)</Option>
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
          <Space direction="vertical" size={20} className={styles.drawerContentSpace}>
            <div>
              <Title level={4} className={styles.drawerTitle}>
                {matchDrawerVacancy.title}
              </Title>
              <Text type="secondary">{matchDrawerVacancy.company}</Text>
            </div>

            <div>
              <Text strong className={styles.fieldLabelBlock}>
                Select Candidate Resume:
              </Text>
              <Select
                className={styles.fullWidthSelect}
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
              <Card className={styles.matchCard}>
                <div className={styles.matchScoreHeader}>
                  <Progress
                    type="dashboard"
                    percent={matchResult.score}
                    strokeColor={matchResult.score >= 70 ? '#10b981' : '#f59e0b'}
                  />
                  <Title level={4} className={styles.matchScoreTitle}>
                    {matchResult.score}% Compatibility Score
                  </Title>
                  <Text className={styles.matchScoreSub}>{matchResult.recommendation}</Text>
                </div>

                <Divider className={styles.dividerDark} />

                <Title level={5} className={styles.greenTitle}>
                  <CheckCircleOutlined /> Key Strengths
                </Title>
                <List
                  size="small"
                  dataSource={matchResult.strengths}
                  renderItem={(s) => <List.Item className={styles.listItemText}>• {s}</List.Item>}
                />

                <Divider className={styles.dividerDark} />

                <Title level={5} className={styles.redTitle}>
                  <CloseCircleOutlined /> Areas for Improvement
                </Title>
                <List
                  size="small"
                  dataSource={matchResult.weaknesses}
                  renderItem={(w) => <List.Item className={styles.listItemText}>• {w}</List.Item>}
                />

                {matchResult.missingSkills.length > 0 && (
                  <div className={styles.missingSkillsContainer}>
                    <Text strong className={styles.fieldLabelBlockSm}>
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
