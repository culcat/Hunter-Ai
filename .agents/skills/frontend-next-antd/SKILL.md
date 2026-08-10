---
name: frontend-next-antd
description: Master instructions, architecture standards, component patterns, and styling rules for Frontend development with Next.js, React 19, TypeScript, Ant Design (AntD), Redux Toolkit/RTK Query, SCSS modules, and i18n.
---

# Frontend Agent Skill: Next.js + React 19 + TypeScript + Ant Design

This skill governs all frontend client application development. Follow these rules and architectural guidelines when creating or modifying client-side code.

---

## 🛠 Technology Stack

- **Framework**: Next.js (App Router or Pages Router) + React 19
- **Language**: TypeScript (Strict Mode required)
- **UI Component Library**: Ant Design (`antd` v5+)
- **Styling**: SCSS Modules (`*.module.scss`) + AntD Theme Config
- **State Management**: Redux Toolkit & RTK Query (Global/API), `useState`/`useReducer` (Local)
- **Localization**: `react-i18next` or Next.js i18n

---

## 📁 Directory Structure & Component Organization

```
src/
├── app/                        # Next.js App Router (or pages/ for Pages Router)
│   ├── layout.tsx              # Root Layout with Antd Registry & Redux Provider
│   ├── page.tsx                # Homepage
│   └── (routes)/               # Feature routes
├── components/
│   ├── ui/                     # Primitive reusable UI wrappers (Button, Modal, Card, Switch)
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.scss
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       └── Modal.module.scss
│   └── shared/                 # Business domain components (Header, Sidebar, Feed, Form)
│       ├── Header/
│       │   ├── Header.tsx
│       │   └── Header.module.scss
│       └── UserProfileCard/
│           ├── UserProfileCard.tsx
│           └── UserProfileCard.module.scss
├── hooks/                      # Custom React hooks (useAuth.ts, useDebounce.ts)
├── store/                      # Redux Toolkit store & RTK Query slices
│   ├── store.ts
│   ├── provider.tsx
│   └── api/                    # RTK Query API definitions
│       └── baseApi.ts
├── styles/                     # Global styles, variables, SCSS mixins
│   ├── globals.scss
│   └── variables.scss
├── types/                      # TypeScript interfaces and types
│   └── user.ts
└── i18n/                       # Localization dictionaries
    ├── index.ts
    └── locales/
        ├── en.json
        └── ru.json
```

---

## 🎨 Ant Design (AntD) Integration Guidelines

### 1. Theme Configuration & `ConfigProvider`
Wrap the app in `ConfigProvider` to define theme tokens and custom algorithms consistently across light and dark modes:

```tsx
import { ConfigProvider, theme } from 'antd';

export const AntdProvider = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 8,
        fontFamily: 'Inter, sans-serif',
      },
      components: {
        Button: {
          fontWeight: 600,
        },
        Card: {
          paddingLG: 24,
        },
      },
    }}
  >
    {children}
  </ConfigProvider>
);
```

### 2. Next.js App Router SSR Compatibility (`@ant-design/nextjs-registry`)
Ensure CSS-in-JS style extraction is registered for server-side rendering:

```tsx
// app/layout.tsx
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AntdProvider>{children}</AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
```

### 3. AntD Form Usage & Validation
Always use typed `Form` instances with DTO interfaces for robust user input handling:

```tsx
import { Form, Input, Button } from 'antd';
import styles from './LoginForm.module.scss';

interface LoginFormValues {
  email: string;
  pass: string;
}

export const LoginForm = ({ onSubmit }: { onSubmit: (values: LoginFormValues) => void }) => {
  const [form] = Form.useForm<LoginFormValues>();

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      className={styles.formContainer}
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Enter a valid email address!' },
        ]}
      >
        <Input placeholder="user@example.com" size="large" />
      </Form.Item>

      <Form.Item
        name="pass"
        label="Password"
        rules={[{ required: true, message: 'Password is required!' }]}
      >
        <Input.Password placeholder="••••••••" size="large" />
      </Form.Item>

      <Button type="primary" htmlType="submit" block size="large">
        Sign In
      </Button>
    </Form>
  );
};
```

---

## ⚡ State Management & RTK Query

1. Use **Redux Toolkit** for global app states (auth tokens, user profiles, application settings).
2. Use **RTK Query** for server data fetching, caching, mutation, and invalidation:

```typescript
// store/api/usersApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, CreateUserDto } from '@/types/user';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    createUser: builder.mutation<User, CreateUserDto>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
```

---

## 📜 Key Frontend Coding Standards

- ✅ **Functional Components Only**: Class components are forbidden.
- ✅ **Custom Hooks**: Extract complex state logic, effect listeners, or media queries into custom hooks (`src/hooks/use*.ts`).
- ✅ **SCSS Modules**: Component styles must live in `*.module.scss`. Use BEM naming conventions inside module files if needed.
- ✅ **i18n Translation**: Do not hardcode UI strings directly in JSX. Use translation keys (`t('auth.login_title')`). Write translations to `src/i18n/locales/*.json`.
- ❌ **No `any`**: Explicit interface definitions required for all props, states, and API responses.
- ❌ **No Inline Styles**: `style={{ marginTop: 10 }}` is strictly prohibited. Use SCSS module classes or AntD layout properties.
