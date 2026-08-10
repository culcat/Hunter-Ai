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
  Form,
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
      <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#fff', textAlign: 'center', paddingTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#fff', padding: 40 }}>
        <Header />
        <div style={{ maxWidth: 800, margin: '40px auto' }}>
          <Title level={3} style={{ color: '#fff' }}>
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
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#fff' }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Breadcrumb
          items={[
            { title: <Link href="/">Dashboard</Link> },
            { title: <Link href="/jobs">Jobs</Link> },
            { title: vacancy.title },
          ]}
          style={{ marginBottom: 24 }}
        />

        <Card style={{ background: '#131b2e', borderColor: '#1e293b', marginBottom: 24 }}>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Space align="start" size={16}>
                <Avatar size={64} style={{ backgroundColor: '#3b82f6', fontSize: 28 }}>
                  {vacancy.company.charAt(0).toUpperCase()}
                </Avatar>
                <div>
                  <Title level={2} style={{ color: '#fff', margin: 0 }}>
                    {vacancy.title}
                  </Title>
                  <Space size={16} style={{ marginTop: 8 }}>
                    <Text strong style={{ color: '#f8fafc' }}>
                      {vacancy.company}
                    </Text>
                    <Text style={{ color: '#94a3b8' }}>
                      <EnvironmentOutlined /> {vacancy.city || vacancy.country || 'Remote'}
                    </Text>
                    <Text strong style={{ color: '#10b981' }}>
                      {vacancy.salaryMin
                        ? `${vacancy.salaryMin.toLocaleString()} - ${vacancy.salaryMax?.toLocaleString() || ''} ${vacancy.currency}`
                        : 'Salary Not Disclosed'}
                    </Text>
                  </Space>
                </div>
              </Space>
            </Col>

            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Space direction="vertical" align="end">
                <Tag color="blue" style={{ padding: '6px 12px', fontSize: 14 }}>
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
            <Card style={{ background: '#131b2e', borderColor: '#1e293b' }}>
              <Title level={4} style={{ color: '#fff' }}>
                Job Description
              </Title>
              <Paragraph style={{ color: '#cbd5e1', fontSize: 16, whiteSpace: 'pre-line' }}>
                {vacancy.description}
              </Paragraph>

              <Divider style={{ borderColor: '#1e293b' }} />

              <Title level={4} style={{ color: '#fff' }}>
                Required Tech Stack & Skills
              </Title>
              <Space wrap size={8}>
                {(vacancy.skills || []).map((skill) => (
                  <Tag key={skill} color="geekblue" style={{ fontSize: 14, padding: '4px 10px' }}>
                    {skill}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card style={{ background: '#131b2e', borderColor: '#1e293b' }}>
              <Title level={4} style={{ color: '#fff' }}>
                Job Metadata
              </Title>
              <List size="small" style={{ color: '#cbd5e1' }}>
                <List.Item style={{ borderColor: '#1e293b', color: '#cbd5e1' }}>
                  <strong>Grade:</strong> {vacancy.grade}
                </List.Item>
                <List.Item style={{ borderColor: '#1e293b', color: '#cbd5e1' }}>
                  <strong>Employment Type:</strong> {vacancy.employmentType}
                </List.Item>
                <List.Item style={{ borderColor: '#1e293b', color: '#cbd5e1' }}>
                  <strong>Work Format:</strong> {vacancy.workFormat}
                </List.Item>
                <List.Item style={{ borderColor: '#1e293b', color: '#cbd5e1' }}>
                  <strong>Source:</strong> {vacancy.source}
                </List.Item>
                <List.Item style={{ borderColor: '#1e293b', color: '#cbd5e1' }}>
                  <strong>Original Posting:</strong>{' '}
                  <a href={vacancy.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>
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
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Text strong style={{ display: 'block', marginBottom: 6 }}>
                Select Candidate Resume:
              </Text>
              <Select
                style={{ width: '100%' }}
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
              <Text strong style={{ display: 'block', marginBottom: 6 }}>
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
                    <div style={{ background: '#0f172a', padding: 16, borderRadius: 8 }}>
                      <div style={{ textAlign: 'right', marginBottom: 8 }}>
                        <Button
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyText(variant.content)}
                        >
                          Copy Text
                        </Button>
                      </div>
                      <Paragraph style={{ color: '#f8fafc', whiteSpace: 'pre-line', margin: 0 }}>
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
