'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Typography,
  Space,
  Tag,
  Alert,
  Spin,
  Row,
  Col,
  InputNumber,
  Slider,
  message,
} from 'antd';
import {
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  InfoCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Header } from '@/components/shared/Header/Header';
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
  useTestCookiesMutation,
} from '@/store/api/baseApi';
import styles from './settings.module.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function UserSettingsPage() {
  const { data: settings, isLoading, refetch } = useGetUserSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const [testCookies, { isLoading: isTesting }] = useTestCookiesMutation();

  const [hhForm] = Form.useForm();
  const [habrForm] = Form.useForm();
  const [autoApplyForm] = Form.useForm();

  const [hhStatus, setHhStatus] = useState<{ isValid?: boolean; username?: string; message?: string }>({});
  const [habrStatus, setHabrStatus] = useState<{ isValid?: boolean; username?: string; message?: string }>({});

  useEffect(() => {
    if (settings) {
      hhForm.setFieldsValue({
        hhCookies: settings.hhCookies || '',
        hhUserAgent: settings.hhUserAgent || '',
        hhAutoApplyEnabled: settings.hhAutoApplyEnabled ?? false,
        hhResumeId: settings.hhResumeId || '',
      });

      habrForm.setFieldsValue({
        habrCookies: settings.habrCookies || '',
        habrUserAgent: settings.habrUserAgent || '',
        habrAutoApplyEnabled: settings.habrAutoApplyEnabled ?? false,
        habrResumeId: settings.habrResumeId || '',
      });

      autoApplyForm.setFieldsValue({
        defaultCoverLetter: settings.defaultCoverLetter || '',
        dailyAutoApplyLimit: settings.dailyAutoApplyLimit ?? 20,
        autoApplyMinMatchScore: settings.autoApplyMinMatchScore ?? 70,
      });

      if (settings.hhCookies) {
        setHhStatus({ isValid: true, message: 'Сохранены куки HeadHunter' });
      }
      if (settings.habrCookies) {
        setHabrStatus({ isValid: true, message: 'Сохранены куки Хабр Карьеры' });
      }
    }
  }, [settings, hhForm, habrForm, autoApplyForm]);

  const handleSaveHhSettings = async (values: any) => {
    try {
      await updateSettings({
        hhCookies: values.hhCookies,
        hhUserAgent: values.hhUserAgent,
        hhAutoApplyEnabled: values.hhAutoApplyEnabled,
        hhResumeId: values.hhResumeId,
      }).unwrap();
      message.success('Настройки HeadHunter сохранены!');
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Ошибка при сохранении настроек HH');
    }
  };

  const handleSaveHabrSettings = async (values: any) => {
    try {
      await updateSettings({
        habrCookies: values.habrCookies,
        habrUserAgent: values.habrUserAgent,
        habrAutoApplyEnabled: values.habrAutoApplyEnabled,
        habrResumeId: values.habrResumeId,
      }).unwrap();
      message.success('Настройки Хабр Карьеры сохранены!');
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Ошибка при сохранении настроек Habr');
    }
  };

  const handleSaveAutoApplySettings = async (values: any) => {
    try {
      await updateSettings({
        defaultCoverLetter: values.defaultCoverLetter,
        dailyAutoApplyLimit: values.dailyAutoApplyLimit,
        autoApplyMinMatchScore: values.autoApplyMinMatchScore,
      }).unwrap();
      message.success('Настройки автооткликов сохранены!');
      refetch();
    } catch (err: any) {
      message.error(err?.data?.message || 'Ошибка при сохранении параметров автооткликов');
    }
  };

  const handleTestHhCookies = async () => {
    try {
      const values = hhForm.getFieldsValue();
      const res = await testCookies({
        platform: 'hh',
        cookies: values.hhCookies,
        userAgent: values.hhUserAgent,
      }).unwrap();

      setHhStatus({
        isValid: res.isValid,
        username: res.username,
        message: res.message,
      });

      if (res.isValid) {
        message.success(res.message);
      } else {
        message.warning(res.message);
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Ошибка при проверке кук HeadHunter');
    }
  };

  const handleTestHabrCookies = async () => {
    try {
      const values = habrForm.getFieldsValue();
      const res = await testCookies({
        platform: 'habr',
        cookies: values.habrCookies,
        userAgent: values.habrUserAgent,
      }).unwrap();

      setHabrStatus({
        isValid: res.isValid,
        username: res.username,
        message: res.message,
      });

      if (res.isValid) {
        message.success(res.message);
      } else {
        message.warning(res.message);
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Ошибка при проверке кук Хабр Карьеры');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.settingsContainer}>
        <Header />
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <Spin size="large" />
          <Paragraph style={{ color: '#94a3b8', marginTop: 16 }}>Загрузка настроек авторизации...</Paragraph>
        </div>
      </div>
    );
  }

  const items = [
    {
      key: 'hh',
      label: (
        <span>
          <GlobalOutlined className={styles.tabIcon} />
          HeadHunter (hh.ru)
        </span>
      ),
      children: (
        <div>
          <div className={styles.platformBanner}>
            <div className={styles.platformTitle}>
              <span>HeadHunter Интеграция</span>
              {hhStatus.isValid ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  {hhStatus.username || 'Подключено'}
                </Tag>
              ) : (
                <Tag color="default" icon={<ExclamationCircleOutlined />}>
                  Не авторизован
                </Tag>
              )}
            </div>
            <Text style={{ color: '#94a3b8' }}>
              Используется для парсинга закрытых вакансий и автоматической отправки откликов
            </Text>
          </div>

          <div className={styles.instructionAlert}>
            <div className={styles.instructionTitle}>
              <InfoCircleOutlined /> Как скопировать куки из hh.ru:
            </div>
            <ol className={styles.instructionList}>
              <li>Откройте сайт <span className={styles.codeHint}>https://hh.ru</span> и войдите в свой аккаунт.</li>
              <li>Нажмите <span className={styles.codeHint}>F12</span>, выберите вкладку <strong>Network (Сеть)</strong> или <strong>Application -&gt; Cookies</strong>.</li>
              <li>Скопируйте заголовок <span className={styles.codeHint}>Cookie</span> из любого запроса или массив cookies в формате JSON.</li>
              <li>Вставьте скопированный текст в поле «Cookie (hh.ru)» ниже и нажмите «Проверить куки».</li>
            </ol>
          </div>

          <Form form={hhForm} layout="vertical" onFinish={handleSaveHhSettings}>
            <Form.Item
              name="hhCookies"
              label={<Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Cookie (hh.ru)</Text>}
              help="Формат: name1=val1; name2=val2 или JSON массив"
            >
              <TextArea
                rows={4}
                placeholder="hhtoken=...; _xsrf=...; hhuid=..."
                className={styles.cookieTextarea}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="hhResumeId"
                  label={<Text style={{ color: '#e2e8f0' }}>ID или Ссылка на резюме HH</Text>}
                  help="Например: https://hh.ru/resume/1234567890abcdef"
                >
                  <Input placeholder="https://hh.ru/resume/..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="hhUserAgent"
                  label={<Text style={{ color: '#e2e8f0' }}>Custom User-Agent (Опционально)</Text>}
                >
                  <Input placeholder="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..." />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="hhAutoApplyEnabled" valuePropName="checked">
              <Space>
                <Switch />
                <Text style={{ color: '#f8fafc' }}>
                  Включить автоотклики для HeadHunter (автоматически отправлять резюме при AI-совпадении)
                </Text>
              </Space>
            </Form.Item>

            {hhStatus.message && (
              <Alert
                message={hhStatus.message}
                type={hhStatus.isValid ? 'success' : 'warning'}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <div className={styles.actionRow}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                icon={<SafetyCertificateOutlined />}
              >
                Сохранить куки HH
              </Button>
              <Button
                onClick={handleTestHhCookies}
                loading={isTesting}
                icon={<ThunderboltOutlined />}
              >
                Проверить авторизацию HH
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'habr',
      label: (
        <span>
          <GlobalOutlined className={styles.tabIcon} />
          Хабр Карьера (career.habr.com)
        </span>
      ),
      children: (
        <div>
          <div className={styles.platformBanner}>
            <div className={styles.platformTitle}>
              <span>Хабр Карьера Интеграция</span>
              {habrStatus.isValid ? (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  {habrStatus.username || 'Подключено'}
                </Tag>
              ) : (
                <Tag color="default" icon={<ExclamationCircleOutlined />}>
                  Не авторизован
                </Tag>
              )}
            </div>
            <Text style={{ color: '#94a3b8' }}>
              Используется для прямого отклика на IT-вакансии Хабр Карьеры
            </Text>
          </div>

          <div className={styles.instructionAlert}>
            <div className={styles.instructionTitle}>
              <InfoCircleOutlined /> Как скопировать куки из career.habr.com:
            </div>
            <ol className={styles.instructionList}>
              <li>Откройте сайт <span className={styles.codeHint}>https://career.habr.com</span> и авторизуйтесь.</li>
              <li>Откройте <span className={styles.codeHint}>F12 -&gt; Network</span>, выполните любое действие и скопируйте <span className={styles.codeHint}>Cookie</span>.</li>
              <li>Вставьте строки куков ниже и нажмите «Сохранить» или «Проверить авторизацию».</li>
            </ol>
          </div>

          <Form form={habrForm} layout="vertical" onFinish={handleSaveHabrSettings}>
            <Form.Item
              name="habrCookies"
              label={<Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Cookie (career.habr.com)</Text>}
              help="Формат: _habr_career_session=...; remember_user_token=..."
            >
              <TextArea
                rows={4}
                placeholder="_habr_career_session=...; remember_user_token=..."
                className={styles.cookieTextarea}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="habrResumeId"
                  label={<Text style={{ color: '#e2e8f0' }}>Ссылка или ID профиля Хабр</Text>}
                >
                  <Input placeholder="https://career.habr.com/..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="habrUserAgent"
                  label={<Text style={{ color: '#e2e8f0' }}>Custom User-Agent</Text>}
                >
                  <Input placeholder="Mozilla/5.0..." />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="habrAutoApplyEnabled" valuePropName="checked">
              <Space>
                <Switch />
                <Text style={{ color: '#f8fafc' }}>
                  Включить автоотклики для Хабр Карьеры
                </Text>
              </Space>
            </Form.Item>

            {habrStatus.message && (
              <Alert
                message={habrStatus.message}
                type={habrStatus.isValid ? 'success' : 'warning'}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <div className={styles.actionRow}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                icon={<SafetyCertificateOutlined />}
              >
                Сохранить куки Habr
              </Button>
              <Button
                onClick={handleTestHabrCookies}
                loading={isTesting}
                icon={<ThunderboltOutlined />}
              >
                Проверить авторизацию Habr
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
    {
      key: 'autoapply',
      label: (
        <span>
          <SendOutlined className={styles.tabIcon} />
          Параметры автооткликов
        </span>
      ),
      children: (
        <div>
          <Paragraph style={{ color: '#94a3b8' }}>
            Настройте правила автоматической рассылки резюме при совпадении требований вакансии с вашим AI-профилем.
          </Paragraph>

          <Form form={autoApplyForm} layout="vertical" onFinish={handleSaveAutoApplySettings}>
            <Form.Item
              name="defaultCoverLetter"
              label={<Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Шаблон сопроводительного письма</Text>}
              help="Это письмо будет отправляться при автоматических откликах"
            >
              <TextArea
                rows={6}
                placeholder="Здравствуйте! Меня заинтересовала ваша вакансия. Имею более 4 лет опыта разработки на TypeScript, React и Node.js..."
              />
            </Form.Item>

            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="dailyAutoApplyLimit"
                  label={<Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Дневной лимит откликов</Text>}
                  help="Максимальное число автооткликов в день (защита от бана аккаунта)"
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="autoApplyMinMatchScore"
                  label={<Text style={{ color: '#e2e8f0', fontWeight: 600 }}>Минимальный % AI-совпадения</Text>}
                  help="Откликаться только если совпадение навыков резюме выше этого порога"
                >
                  <Slider
                    min={50}
                    max={95}
                    marks={{
                      50: '50%',
                      70: '70% (Рекомендуемо)',
                      85: '85%',
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className={styles.actionRow}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                icon={<SettingOutlined />}
              >
                Сохранить правила автооткликов
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.settingsContainer}>
      <Header />

      <div className={styles.contentWrapper}>
        <Card className={styles.heroCard} variant="borderless">
          <Space direction="vertical" size={8}>
            <Tag color="#3b82f6" className={styles.heroBadge}>
              PLATFORM CREDENTIALS & AUTOMATION
            </Tag>
            <Title level={2} className={styles.heroTitle}>
              Настройки платформы и Куки (HH & Habr)
            </Title>
            <Paragraph className={styles.heroSubtitle}>
              Управление авторизационными куками, параметрами автооткликов и верификация сессий Playwright.
            </Paragraph>
          </Space>
        </Card>

        <Card className={styles.mainCard} variant="borderless">
          <Tabs defaultActiveKey="hh" items={items} />
        </Card>
      </div>
    </div>
  );
}
