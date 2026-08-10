export interface UserSettings {
  id: string;
  userId: string;
  hhCookies?: string;
  hhUserAgent?: string;
  hhAutoApplyEnabled: boolean;
  hhResumeId?: string;
  habrCookies?: string;
  habrUserAgent?: string;
  habrAutoApplyEnabled: boolean;
  habrResumeId?: string;
  defaultCoverLetter?: string;
  dailyAutoApplyLimit: number;
  autoApplyMinMatchScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsDto {
  hhCookies?: string;
  hhUserAgent?: string;
  hhAutoApplyEnabled?: boolean;
  hhResumeId?: string;
  habrCookies?: string;
  habrUserAgent?: string;
  habrAutoApplyEnabled?: boolean;
  habrResumeId?: string;
  defaultCoverLetter?: string;
  dailyAutoApplyLimit?: number;
  autoApplyMinMatchScore?: number;
}

export interface TestCookiesDto {
  platform: 'hh' | 'habr';
  cookies?: string;
  userAgent?: string;
}

export interface TestCookiesResult {
  isValid: boolean;
  platform: 'hh' | 'habr';
  username?: string;
  avatarUrl?: string;
  message: string;
}
