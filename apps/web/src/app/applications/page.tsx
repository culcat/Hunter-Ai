'use client';

import { useState } from 'react';
import {
  Card,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Select,
  Button,
  Tabs,
  List,
  Modal,
  Input,
  message,
  Popconfirm,
} from 'antd';
import {
  FolderOpenOutlined,
  StarFilled,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import {
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useDeleteApplicationMutation,
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
} from '@/store/api/baseApi';
import type { ApplicationStatus } from '@hunter-ai/types';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const statusColors: Record<ApplicationStatus, string> = {
  applied: 'blue',
  screening: 'purple',
  interview: 'gold',
  offer: 'green',
  rejected: 'red',
};

export default function ApplicationsPage() {
  const { data: applications, isLoading: isAppLoading, refetch: refetchApps } = useGetApplicationsQuery();
  const { data: favorites, isLoading: isFavLoading, refetch: refetchFavs } = useGetFavoritesQuery();

  const [updateStatus] = useUpdateApplicationStatusMutation();
  const [deleteApp] = useDeleteApplicationMutation();
  const [removeFav] = useRemoveFavoriteMutation();

  const [editingNotesAppId, setEditingNotesAppId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    try {
      await updateStatus({ id, data: { status } }).unwrap();
      message.success(`Status updated to ${status}`);
      refetchApps();
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteApp = async (id: string) => {
    try {
      await deleteApp(id).unwrap();
      message.success('Application record removed');
      refetchApps();
    } catch (err: any) {
      message.error('Failed to remove application');
    }
  };

  const handleRemoveFav = async (vacancyId: string) => {
    try {
      await removeFav(vacancyId).unwrap();
      message.success('Removed from favorites');
      refetchFavs();
    } catch (err: any) {
      message.error('Failed to remove favorite');
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesAppId) return;
    try {
      const app = applications?.find((a) => a.id === editingNotesAppId);
      if (app) {
        await updateStatus({
          id: editingNotesAppId,
          data: { status: app.status, notes: notesText },
        }).unwrap();
        message.success('Notes saved');
        setEditingNotesAppId(null);
        refetchApps();
      }
    } catch (err: any) {
      message.error('Failed to save notes');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1d', color: '#fff' }}>
      <Header />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <div>
            <Title level={2} style={{ color: '#fff', margin: 0 }}>
              Job Applications & Saved Vacancies
            </Title>
            <Paragraph style={{ color: '#94a3b8', fontSize: 16 }}>
              Track your hiring pipeline, interview stages, cover letter notes, and bookmarked jobs.
            </Paragraph>
          </div>

          <Tabs
            defaultActiveKey="applications"
            items={[
              {
                key: 'applications',
                label: (
                  <span style={{ fontSize: 16 }}>
                    <FolderOpenOutlined /> Applications Pipeline ({applications?.length || 0})
                  </span>
                ),
                children: (
                  <List
                    loading={isAppLoading}
                    dataSource={applications || []}
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
                          <Col xs={24} md={14}>
                            <Space direction="vertical" size={4}>
                              <Space align="center">
                                <Title level={4} style={{ color: '#fff', margin: 0 }}>
                                  {item.vacancy?.title || 'Applied Position'}
                                </Title>
                                <Tag color={statusColors[item.status]}>
                                  {item.status.toUpperCase()}
                                </Tag>
                              </Space>
                              <Text style={{ color: '#94a3b8' }}>
                                Company: <strong style={{ color: '#f8fafc' }}>{item.vacancy?.company || 'N/A'}</strong> • Applied on: {new Date(item.appliedAt).toLocaleDateString()}
                              </Text>
                              {item.notes && (
                                <Text style={{ color: '#cbd5e1', fontStyle: 'italic' }}>
                                  Notes: {item.notes}
                                </Text>
                              )}
                            </Space>
                          </Col>

                          <Col xs={24} md={10} style={{ textAlign: 'right', marginTop: 16 }}>
                            <Space wrap>
                              <Select
                                value={item.status}
                                style={{ width: 140 }}
                                onChange={(val) => handleStatusChange(item.id, val)}
                              >
                                <Option value="applied">Applied</Option>
                                <Option value="screening">Screening</Option>
                                <Option value="interview">Interview</Option>
                                <Option value="offer">Offer</Option>
                                <Option value="rejected">Rejected</Option>
                              </Select>

                              <Button
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditingNotesAppId(item.id);
                                  setNotesText(item.notes || '');
                                }}
                              >
                                Notes
                              </Button>

                              <Popconfirm
                                title="Delete application record?"
                                onConfirm={() => handleDeleteApp(item.id)}
                              >
                                <Button danger icon={<DeleteOutlined />} />
                              </Popconfirm>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    )}
                  />
                ),
              },
              {
                key: 'favorites',
                label: (
                  <span style={{ fontSize: 16 }}>
                    <StarFilled style={{ color: '#f59e0b' }} /> Saved Favorites ({favorites?.length || 0})
                  </span>
                ),
                children: (
                  <List
                    loading={isFavLoading}
                    dataSource={favorites || []}
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
                            <Title level={4} style={{ color: '#fff', margin: 0 }}>
                              {item.vacancy?.title || 'Saved Vacancy'}
                            </Title>
                            <Text style={{ color: '#94a3b8' }}>
                              Company: <strong style={{ color: '#f8fafc' }}>{item.vacancy?.company}</strong> • Format: {item.vacancy?.workFormat}
                            </Text>
                          </Col>

                          <Col xs={24} md={8} style={{ textAlign: 'right', marginTop: 16 }}>
                            <Space>
                              <Button
                                type="primary"
                                icon={<LinkOutlined />}
                                href={item.vacancy?.url}
                                target="_blank"
                              >
                                View Job
                              </Button>
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemoveFav(item.vacancyId)}
                              >
                                Remove
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    )}
                  />
                ),
              },
            ]}
          />
        </Space>
      </div>

      <Modal
        title="Edit Application Notes"
        open={Boolean(editingNotesAppId)}
        onCancel={() => setEditingNotesAppId(null)}
        onOk={handleSaveNotes}
      >
        <Input.TextArea
          rows={4}
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          placeholder="Interview schedule notes, feedback, salary discussions..."
        />
      </Modal>
    </div>
  );
}
