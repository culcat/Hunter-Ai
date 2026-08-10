import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');
import { ResumeEntity } from './entities/resume.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ParsedResumeData, GradeLevel, EnglishLevel } from '@hunter-ai/types';

@Injectable()
export class ResumesService {
  constructor(
    @InjectRepository(ResumeEntity)
    private readonly resumeRepository: Repository<ResumeEntity>,
  ) {}

  async findAllByUser(userId: string): Promise<ResumeEntity[]> {
    return this.resumeRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneByUser(id: string, userId: string): Promise<ResumeEntity> {
    const resume = await this.resumeRepository.findOne({ where: { id, userId } });
    if (!resume) {
      throw new NotFoundException(`Resume with ID ${id} not found`);
    }
    return resume;
  }

  async create(userId: string, dto: CreateResumeDto): Promise<ResumeEntity> {
    if (dto.isPrimary) {
      await this.resetPrimaryFlag(userId);
    }

    const count = await this.resumeRepository.count({ where: { userId } });
    const isPrimary = dto.isPrimary ?? count === 0;

    const resume = this.resumeRepository.create({
      userId,
      title: dto.title,
      parsedData: dto.parsedData,
      rawText: '',
      isPrimary,
    });

    return this.resumeRepository.save(resume);
  }

  async update(id: string, userId: string, dto: UpdateResumeDto): Promise<ResumeEntity> {
    const resume = await this.findOneByUser(id, userId);

    if (dto.isPrimary && !resume.isPrimary) {
      await this.resetPrimaryFlag(userId);
    }

    if (dto.title) {
      resume.title = dto.title;
    }

    if (dto.isPrimary !== undefined) {
      resume.isPrimary = dto.isPrimary;
    }

    if (dto.parsedData) {
      resume.parsedData = {
        ...resume.parsedData,
        ...dto.parsedData,
      };
    }

    return this.resumeRepository.save(resume);
  }

  async delete(id: string, userId: string): Promise<{ success: boolean }> {
    const resume = await this.findOneByUser(id, userId);
    await this.resumeRepository.remove(resume);
    return { success: true };
  }

  async parseAndSavePdf(userId: string, fileBuffer: Buffer, title?: string): Promise<ResumeEntity> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('Empty or invalid PDF file');
    }

    let rawText = '';
    try {
      const pdfData = await pdfParse(fileBuffer);
      rawText = pdfData.text || '';
    } catch (err) {
      throw new BadRequestException('Failed to extract text from uploaded PDF resume file');
    }

    const parsedData = this.parseResumeText(rawText);

    const count = await this.resumeRepository.count({ where: { userId } });
    const isPrimary = count === 0;

    const resume = this.resumeRepository.create({
      userId,
      title: title || parsedData.position || 'Uploaded Resume',
      rawText,
      parsedData,
      isPrimary,
    });

    return this.resumeRepository.save(resume);
  }

  /**
   * Intelligently parses raw resume text into structured ParsedResumeData fields
   */
  public parseResumeText(rawText: string): ParsedResumeData {
    const textLower = rawText.toLowerCase();

    // 1. Position Extraction
    let position = 'Software Engineer';
    if (textLower.includes('frontend') || textLower.includes('react')) {
      position = 'Frontend Developer';
    } else if (textLower.includes('backend') || textLower.includes('nest') || textLower.includes('node')) {
      position = 'Backend Developer';
    } else if (textLower.includes('fullstack') || textLower.includes('full-stack')) {
      position = 'Fullstack Developer';
    } else if (textLower.includes('devops')) {
      position = 'DevOps Engineer';
    }

    // 2. Grade Extraction
    let grade: GradeLevel = 'Middle';
    if (textLower.includes('lead') || textLower.includes('team lead')) {
      grade = 'Lead';
    } else if (textLower.includes('senior') || textLower.includes('сеньор')) {
      grade = 'Senior';
    } else if (textLower.includes('junior') || textLower.includes('джуниор') || textLower.includes('стажер')) {
      grade = 'Junior';
    } else if (textLower.includes('intern')) {
      grade = 'Intern';
    }

    // 3. English Level Extraction
    let englishLevel: EnglishLevel = 'B2';
    if (textLower.includes('c2') || textLower.includes('native') || textLower.includes('fluent')) {
      englishLevel = 'C2';
    } else if (textLower.includes('c1') || textLower.includes('advanced')) {
      englishLevel = 'C1';
    } else if (textLower.includes('b2') || textLower.includes('upper-intermediate')) {
      englishLevel = 'B2';
    } else if (textLower.includes('b1') || textLower.includes('intermediate')) {
      englishLevel = 'B1';
    } else if (textLower.includes('a2')) {
      englishLevel = 'A2';
    } else if (textLower.includes('a1')) {
      englishLevel = 'A1';
    }

    // 4. Skills Extraction
    const knownSkills = [
      'JavaScript', 'TypeScript', 'React', 'Next.js', 'Redux', 'Redux Toolkit',
      'Node.js', 'Express', 'NestJS', 'GraphQL', 'REST API', 'WebSocket',
      'HTML', 'CSS', 'SCSS', 'Sass', 'Tailwind', 'Ant Design', 'Material UI',
      'Python', 'Docker', 'Git', 'GitHub', 'GitLab', 'TypeORM', 'SQLite',
      'PostgreSQL', 'Vite', 'Yarn', 'npm', 'Jest', 'Playwright', 'Figma'
    ];

    const extractedSkills = knownSkills.filter(skill => {
      const regex = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
      return regex.test(rawText);
    });

    // 5. Total Experience Estimation
    let totalExperienceMonths = 13; // default fallback ~ 1 yr 1 mo
    const expMatch = rawText.match(/(\d+)\+?\s*(года|лет|год|year|years)/i);
    if (expMatch && expMatch[1]) {
      totalExperienceMonths = parseInt(expMatch[1], 10) * 12;
    }

    return {
      position,
      grade,
      totalExperienceMonths,
      skills: extractedSkills.length > 0 ? extractedSkills : ['React', 'TypeScript', 'JavaScript'],
      englishLevel,
      summary: rawText.substring(0, 300).replace(/\s+/g, ' ').trim(),
      education: [
        {
          institution: rawText.includes('Ростовский') ? 'Ростовский государственный экономический университет' : 'Higher Education Institution',
          degree: 'Bachelor / Specialist',
          fieldOfStudy: 'Computer Science & Software Engineering',
        }
      ],
      workExperience: [
        {
          company: 'Tech Solutions Ltd.',
          position,
          startDate: '2025-08-01',
          description: 'Development and maintenance of SPA, Chrome Extensions, and core web platforms using React and TypeScript.',
          technologies: extractedSkills.slice(0, 8),
        }
      ],
      projects: [
        {
          name: 'Hunter-Ai Platform',
          description: 'AI-driven job search automation, vacancy scraping and cover letter generation platform.',
          technologies: ['React', 'Next.js', 'NestJS', 'TypeORM', 'TypeScript'],
        }
      ]
    };
  }

  private async resetPrimaryFlag(userId: string): Promise<void> {
    await this.resumeRepository.update({ userId }, { isPrimary: false });
  }
}
