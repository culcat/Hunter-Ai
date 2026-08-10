export type CoverLetterStyle = 'short_direct' | 'technical_detailed' | 'product_enthusiastic';

export interface CoverLetterVariant {
  style: CoverLetterStyle;
  title: string;
  content: string;
}

export interface GenerateCoverLetterDto {
  resumeId: string;
  vacancyId: string;
  customNotes?: string;
}

export interface GenerateCoverLetterResponse {
  resumeId: string;
  vacancyId: string;
  variants: CoverLetterVariant[];
}
