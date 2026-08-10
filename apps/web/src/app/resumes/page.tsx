'use client';

import { useState } from 'react';
import {
  Card,
  Upload,
  Button,
  Tag,
  Typography,
  Space,
  Form,
  Input,
  Select,
  InputNumber,
  List,
  Modal,
  message,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  InboxOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import {
  useGetResumesQuery,
  useUploadResumePdfMutation,
  useUpdateResumeMutation,
  useDeleteResumeMutation,
} from '@/store/api/baseApi';
import type { Resume, GradeLevel, EnglishLevel } from '@hunter-ai/types';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Option } = Select;

export default function ResumesPage() {
  const { data: resumes, isLoading, refetch } = useGetResumesQuery();
  const [uploadPdf] = useUploadResumePdfMutation();
  const [updateResume] = useUpdateResumeMutation();
  const [deleteResume] = useDeleteResumeMutation();

  const [editingResume, setEditingResume] = useState<Resume | null>(null);
  const [form] = Form.useForm();

  const handlePdfUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadPdf(formData).unwrap();
      message.success('PDF Resume uploaded & parsed into structured JSON!');
      onSuccess('ok');
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to parse uploaded PDF resume');
      onError(err);
    }
  };

  const handleEditClick = (resume: Resume) => {
    setEditingResume(resume);
    form.setFieldsValue({
      title: resume.title,
      position: resume.parsedData?.position,
      grade: resume.parsedData?.grade,
      totalExperienceMonths: resume.parsedData?.totalExperienceMonths,
      englishLevel: resume.parsedData?.englishLevel,
      skills: resume.parsedData?.skills?.join(', '),
      summary: resume.parsedData?.summary,
    });
  };

  const handleSaveEdit = async (values: any) => {
    if (!editingResume) return;

    try {
      const skillsArray = values.skills
        ? values.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

      await updateResume({
        id: editingResume.id,
        data: {
          title: values.title,
          parsedData: {
            position: values.position,
            grade: values.grade as GradeLevel,
            totalExperienceMonths: Number(values.totalExperienceMonths),
            englishLevel: values.englishLevel as EnglishLevel,
            skills: skillsArray,
            summary: values.summary,
          },
        },
      }).unwrap();

      message.success('Resume updated successfully!');
      setEditingResume(null);
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update resume');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteResume(id).unwrap();
      message.success('Resume deleted');
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete resume');
    }
  };

  const handleTogglePrimary = async (resume: Resume) => {
    try {
      await updateResume({
        id: resume.id,
        data: { isPrimary: !resume.isPrimary },
      }).unwrap();
      message.success(resume.isPrimary ? 'Set as non-primary' : 'Set as primary candidate resume');
      refetch();
    } catch (err: any) {
      message.error('Failed to toggle primary status');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#fff' }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ color: '#fff', margin: 0 }}>
              AI Resume Parser & Profile Manager
            </Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: 16 }}>
              Upload your PDF resume to automatically extract position, grade, skills, work experience, and education into structured JSON.
            </Paragraph>
          </div>

          <Card style={{ background: '#131b2e', borderColor: '#1e293b' }}>
            <Dragger
              customRequest={handlePdfUpload}
              showUploadList={false}
              accept=".pdf"
              style={{ background: '#0f172a', borderColor: '#334155', padding: 24 }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 48, color: '#3b82f6' }} />
              </p>
              <p className="ant-upload-text" style={{ color: '#f8fafc', fontSize: 18, fontWeight: 600 }}>
                Click or drag PDF resume file to this area to parse
              </p>
              <p className="ant-upload-hint" style={{ color: '#64748b' }}>
                Supports PDF resumes (HH.ru format, LinkedIn PDF export, or standard CVs).
              </p>
            </Dragger>
          </Card>

          <Divider style={{ borderColor: '#1e293b' }} />

          <Title level={3} style={{ color: '#fff' }}>
            Parsed Candidate Profiles ({resumes?.length || 0})
          </Title>

          <List
            loading={isLoading}
            dataSource={resumes || []}
            renderItem={(item) => (
              <Card
                key={item.id}
                style={{
                  background: '#131b2e',
                  borderColor: item.isPrimary ? '#3b82f6' : '#1e293b',
                  marginBottom: 16,
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col xs={24} md={16}>
                    <Space size={12} align="center">
                      <FilePdfOutlined style={{ fontSize: 32, color: '#ef4444' }} />
                      <div>
                        <Space align="center">
                          <Title level={4} style={{ color: '#fff', margin: 0 }}>
                            {item.title}
                          </Title>
                          {item.isPrimary && (
                            <Tag color="blue" icon={<CheckCircleOutlined />}>
                              PRIMARY CV
                            </Tag>
                          )}
                        </Space>
                        <Text style={{ color: '#94a3b8', display: 'block' }}>
                          Position: <strong style={{ color: '#f8fafc' }}>{item.parsedData?.position || 'Software Engineer'}</strong> ({item.parsedData?.grade || 'Middle'}) • Experience: {Math.round((item.parsedData?.totalExperienceMonths || 12) / 12)} years • English: {item.parsedData?.englishLevel || 'B2'}
                        </Text>
                      </div>
                    </Space>

                    <div style={{ marginTop: 12 }}>
                      <Space size={6} wrap>
                        {(item.parsedData?.skills || []).map((skill) => (
                          <Tag key={skill} color="geekblue">
                            {skill}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </Col>

                  <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
                    <Space>
                      <Button
                        icon={item.isPrimary ? <StarFilled style={{ color: '#f59e0b' }} /> : <StarOutlined />}
                        onClick={() => handleTogglePrimary(item)}
                      >
                        {item.isPrimary ? 'Primary' : 'Make Primary'}
                      </Button>

                      <Button icon={<EditOutlined />} onClick={() => handleEditClick(item)}>
                        Edit Fields
                      </Button>

                      <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)} />
                    </Space>
                  </Col>
                </Row>
              </Card>
            )}
          />
        </Space>
      </div>

      <Modal
        title="Edit Parsed Resume Data"
        open={Boolean(editingResume)}
        onCancel={() => setEditingResume(null)}
        onOk={() => form.submit()}
        okText="Save Changes"
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveEdit}>
          <Form.Item name="title" label="Resume Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="position" label="Desired Position" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="grade" label="Grade Level" rules={[{ required: true }]}>
                <Select>
                  <Option value="Intern">Intern</Option>
                  <Option value="Junior">Junior</Option>
                  <Option value="Middle">Middle</Option>
                  <Option value="Senior">Senior</Option>
                  <Option value="Lead">Lead</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="totalExperienceMonths" label="Total Experience (Months)">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="englishLevel" label="English Proficiency">
                <Select>
                  <Option value="A1">A1</Option>
                  <Option value="A2">A2</Option>
                  <Option value="B1">B1</Option>
                  <Option value="B2">B2</Option>
                  <Option value="C1">C1</Option>
                  <Option value="C2">C2</Option>
                  <Option value="Native">Native</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="skills" label="Skills (Comma separated)">
            <Input placeholder="React, TypeScript, Next.js, Redux, SCSS, NestJS" />
          </Form.Item>

          <Form.Item name="summary" label="Summary / About Me">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
