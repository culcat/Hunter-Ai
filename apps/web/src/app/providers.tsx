'use client';

import type { ReactNode } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AntdRegistry>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#3b82f6',
              borderRadius: 8,
            },
          }}
        >
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </Provider>
  );
}
