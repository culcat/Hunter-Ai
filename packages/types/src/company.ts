export interface AuthConfig {
  loginUrl?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  username?: string;
  password?: string;
  authType?: 'form' | 'cookie' | 'none';
}

export interface ScrapingConfig {
  itemSelector?: string;
  titleSelector?: string;
  salarySelector?: string;
  locationSelector?: string;
  descriptionSelector?: string;
  linkSelector?: string;
  searchKeyword?: string;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  websiteUrl: string;
  careerUrl: string;
  logoUrl?: string;
  description?: string;
  requiresAuth: boolean;
  authConfig?: AuthConfig;
  scrapingConfig?: ScrapingConfig;
  isActive: boolean;
  lastScrapedAt?: string;
  vacanciesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyDto {
  name: string;
  code: string;
  websiteUrl: string;
  careerUrl: string;
  logoUrl?: string;
  description?: string;
  requiresAuth?: boolean;
  authConfig?: AuthConfig;
  scrapingConfig?: ScrapingConfig;
  isActive?: boolean;
}

export interface UpdateCompanyDto {
  name?: string;
  code?: string;
  websiteUrl?: string;
  careerUrl?: string;
  logoUrl?: string;
  description?: string;
  requiresAuth?: boolean;
  authConfig?: AuthConfig;
  scrapingConfig?: ScrapingConfig;
  isActive?: boolean;
}
