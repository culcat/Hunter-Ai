'use client';

import { useState, use } from 'react';
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
  Divider,
  List,
  Modal,
  Input,
  Select,
  message,
  Tabs,
  Spin,
} from 'antd';
import {
  EnvironmentOutlined,
  SendOutlined,
  FileTextOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import {
  useGetVacancyQuery,
  useGetResumesQuery,
  useGenerateCoverLetterMutation,
  useCreateApplicationMutation,
} from '@/store/api/baseApi';
import type { CoverLetterVariant } from '@hunter-ai/types';
import styles from './jobDetail.module.scss';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const vacancyId = resolvedParams.id;

  const { data: vacancy, isLoading: isVacancyLoading } = useGetVacancyQuery(vacancyId);
  const { data: resumes } = useGetResumesQuery();
  const [generateCoverLetter, { isLoading: isGeneratingCoverLetter }] = useGenerateCoverLetterMutation();
  const [createApplication, { isLoading: isApplying }] = useCreateApplicationMutation();

  const [coverLetterModalVisible, setCoverLetterModalVisible] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [customNotes, setCustomNotes] = useState('');
  const [coverLetterVariants, setCoverLetterVariants] = useState<CoverLetterVariant[]>([]);
  const [activeVariantContent, setActiveVariantContent] = useState('');

  const handleOpenCoverLetterModal = () => {
    const primary = resumes?.find((r) => r.isPrimary) || resumes?.[0];
    if (primary) {
      setSelectedResumeId(primary.id);
    }
    setCoverLetterModalVisible(true);
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedResumeId) {
      message.error('Please select or upload a resume first');
      return;
    }

    try {
      const res = await generateCoverLetter({
        resumeId: selectedResumeId,
        vacancyId,
        customNotes,
      }).unwrap();

      setCoverLetterVariants(res.variants);
      if (res.variants.length > 0) {
        setActiveVariantContent(res.variants[0].content);
      }
      message.success('Cover letters generated in 3 tailored styles!');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to generate cover letter');
    }
  };

  const handleQuickApply = async () => {
    const primary = resumes?.find((r) => r.isPrimary) || resumes?.[0];
    if (!primary) {
      message.error('Please upload or select a resume in "My Resumes" before applying');
      return;
    }

    try {
      await createApplication({
        vacancyId,
        resumeId: primary.id,
        coverLetter: activeVariantContent || undefined,
        notes: 'Applied via Hunter-AI Quick Apply',
      }).unwrap();

      message.success('Job Application created and saved to Kanban pipeline!');
      setCoverLetterModalVisible(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to create job application');
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Cover letter copied to clipboard!');
  };

  if (isVacancyLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className={styles.notFoundContainer}>
        <Header />
        <div className={styles.notFoundWrapper}>
          <Title level={3} className={styles.notFoundTitle}>
            Vacancy Not Found
          </Title>
          <Link href="/jobs">
            <Button icon={<ArrowLeftOutlined />}>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Dashboard</Link> },
            { title: <Link href="/jobs">Jobs</Link> },
            { title: vacancy.title },
          ]}
          className={styles.breadcrumbMargin}
        />

        <Card className={styles.bannerCard}>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Space align="start" size={16}>
                <Avatar size={64} className={styles.avatarCompany}>
                  {vacancy.company.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Title level={2} className={styles.roleTitle}>
                    {vacancy.title}
                  </Title>
                  <Space size={16} className={styles.metaRow}>
                    <Text strong className={styles.companyName}>
                      {vacancy.company}
                    </Text>
                    <Text className={styles.locationText}>
                      <EnvironmentOutlined /> {vacancy.city || vacancy.country || 'Remote'}
                    </Text>
                    <Text strong className={styles.salaryHighlight}>
                      {vacancy.salaryMin
                        ? `${vacancy.salaryMin.toLocaleString()} - ${vacancy.salaryMax?.toLocaleString() || ''} ${vacancy.currency}`
                        : 'Salary Not Disclosed'}
                    </Text>
                  </Space>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={8} className={styles.actionCol}>
              <Space direction="vertical" align="end">
                <Tag color="blue" className={styles.sourceTag}>
                  {vacancy.source.toUpperCase()} • {vacancy.workFormat.toUpperCase()}
                </Tag>
                <Space>
                  <Button
                    size="large"
                    icon={<FileTextOutlined />}
                    onClick={handleOpenCoverLetterModal}
                  >
                    Cover Letter AI
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<SendOutlined />}
                    loading={isApplying}
                    onClick={handleQuickApply}
                  >
                    Quick Apply
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card className={styles.detailCard}>
              <Title level={4} className={styles.cardSectionTitle}>
                Job Description
              </Title>
              <Paragraph className={styles.jobParagraph}>
                {vacancy.description}
              </Paragraph>

              <Divider className={styles.dividerDark} />

              <Title level={4} className={styles.cardSectionTitle}>
                Required Tech Stack & Skills
              </Title>
              <Space wrap size={8}>
                {(vacancy.skills || []).map((skill) => (
                  <Tag key={skill} color="geekblue" className={styles.techTagLarge}>
                    {skill}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card className={styles.detailCard}>
              <Title level={4} className={styles.cardSectionTitle}>
                Job Metadata
              </Title>
              <List size="small" className={styles.metaList}>
                <List.Item className={styles.metaListItem}>
                  <strong>Grade:</strong> {vacancy.grade}
                </List.Item>
                <List.Item className={styles.metaListItem}>
                  <strong>Employment Type:</strong> {vacancy.employmentType}
                </List.Item>
                <List.Item className={styles.metaListItem}>
                  <strong>Work Format:</strong> {vacancy.workFormat}
                </List.Item>
                <List.Item className={styles.metaListItem}>
                  <strong>Source:</strong> {vacancy.source}
                </List.Item>
                <List.Item className={styles.metaListItem}>
                  <strong>Original Posting:</strong>{' '}
                  <a href={vacancy.url} target="_blank" rel="noreferrer" className={styles.externalLink}>
                    Open External URL
                  </a>
                </List.Item>
              </List>
            </Card>
          </Col>
        </Row>

        {/* Modal: AI Cover Letter Generator */}
        <Modal
          title="AI Cover Letter Generator (Multi-Variant)"
          open={coverLetterModalVisible}
          onCancel={() => setCoverLetterModalVisible(false)}
          width={800}
          footer={[
            <Button key="close" onClick={() => setCoverLetterModalVisible(false)}>
              Close
            </Button>,
            <Button
              key="apply"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={handleQuickApply}
              loading={isApplying}
            >
              Submit Application with Selected Letter
            </Button>,
          ]}
        >
          <Space direction="vertical" size={16} className={styles.fullWidthSpace}>
            <div>
              <Text strong className={styles.fieldLabel}>
                Select Candidate Resume:
              </Text>
              <Select
                className={styles.fullWidthSelect}
                value={selectedResumeId}
                onChange={(val) => setSelectedResumeId(val)}
              >
                {(resumes || []).map((r) => (
                  <Option key={r.id} value={r.id}>
                    {r.title} ({r.parsedData?.position}) {r.isPrimary ? '[PRIMARY]' : ''}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <Text strong className={styles.fieldLabel}>
                Custom Notes / Employer Instructions (Optional):
              </Text>
              <Input
                placeholder="e.g. Please highlight my Chrome Extension experience and micro-frontends..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
              />
            </div>

            <Button
              type="primary"
              block
              loading={isGeneratingCoverLetter}
              onClick={handleGenerateCoverLetter}
            >
              Generate Tailored Cover Letters
            </Button>

            {coverLetterVariants.length > 0 && (
              <Tabs
                defaultActiveKey="0"
                onChange={(key) => {
                  const idx = parseInt(key, 10);
                  setActiveVariantContent(coverLetterVariants[idx].content);
                }}
                items={coverLetterVariants.map((variant, idx) => ({
                  key: String(idx),
                  label: variant.title,
                  children: (
                    <div className={styles.variantBox}>
                      <div className={styles.variantHeader}>
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyText(variant.content)}
                        >
                          Copy Text
                        </Button>
                      </div>
                      <Paragraph className={styles.variantContent}>
                        {variant.content}
                      </Paragraph>
                    </div>
                  ),
                }))}
              />
            )}
          </Space>
        </Modal>
      </div>
    </div>
  );
}
