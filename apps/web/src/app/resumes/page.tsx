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
import styles from './resumes.module.scss';

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
    <div className={styles.pageContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        <Space direction="vertical" size={24} className={styles.fullWidthSpace}>
          <div>
            <Title level={2} className={styles.pageHeaderTitle}>
              AI Resume Parser & Profile Manager
            </Title>
            <Paragraph className={styles.pageHeaderSub}>
              Upload your PDF resume to automatically extract position, grade, skills, work experience, and education into structured JSON.
            </Paragraph>
          </div>

          <Card className={styles.uploadCard}>
            <Dragger
              customRequest={handlePdfUpload}
              showUploadList={false}
              accept=".pdf"
              className={styles.draggerArea}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined className={styles.uploadIcon} />
              </p>
              <p className={styles.uploadText}>
                Click or drag PDF resume file to this area to parse
              </p>
              <p className={styles.uploadHint}>
                Supports PDF resumes (HH.ru format, LinkedIn PDF export, or standard CVs).
              </p>
            </Dragger>
          </Card>

          <Divider className={styles.dividerDark} />

          <Title level={3} className={styles.sectionTitle}>
            Parsed Candidate Profiles ({resumes?.length || 0})
          </Title>

          <List
            loading={isLoading}
            dataSource={resumes || []}
            renderItem={(item) => (
              <Card
                key={item.id}
                className={item.isPrimary ? styles.resumeCardPrimary : styles.resumeCard}
              >
                <Row align="middle" justify="space-between">
                  <Col xs={24} md={16}>
                    <Space size={12} align="center">
                      <FilePdfOutlined className={styles.pdfIcon} />
                      <div>
                        <Space align="center">
                          <Title level={4} className={styles.resumeTitle}>
                            {item.title}
                          </Title>
                          {item.isPrimary && (
                            <Tag color="blue" icon={<CheckCircleOutlined />}>
                              PRIMARY CV
                            </Tag>
                          )}
                        </Space>
                        <Text className={styles.resumeMeta}>
                          Position: <strong className={styles.highlightText}>{item.parsedData?.position || 'Software Engineer'}</strong> ({item.parsedData?.grade || 'Middle'}) • Experience: {Math.round((item.parsedData?.totalExperienceMonths || 12) / 12)} years • English: {item.parsedData?.englishLevel || 'B2'}
                        </Text>
                      </div>
                    </Space>

                    <div className={styles.skillGroup}>
                      <Space size={6} wrap>
                        {(item.parsedData?.skills || []).map((skill) => (
                          <Tag key={skill} color="geekblue">
                            {skill}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  </Col>

                  <Col xs={24} md={8} className={styles.actionRightCol}>
                    <Space>
                      <Button
                        icon={item.isPrimary ? <StarFilled className={styles.starIconActive} /> : <StarOutlined />}
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
                <InputNumber className={styles.fullWidthInputNumber} min={0} />
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
