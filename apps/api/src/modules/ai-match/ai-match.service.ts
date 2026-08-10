import { Injectable, NotFoundException } from '@nestjs/common';
import { ResumesService } from '../resumes/resumes.service';
import { VacanciesService } from '../vacancies/vacancies.service';
import { AiMatchResult } from '@hunter-ai/types';

@Injectable()
export class AiMatchService {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly vacanciesService: VacanciesService,
  ) {}

  async evaluateMatch(userId: string, resumeId: string, vacancyId: string): Promise<AiMatchResult> {
    const resume = await this.resumesService.findOneByUser(resumeId, userId);
    const vacancy = await this.vacanciesService.findOne(vacancyId);

    if (!resume || !vacancy) {
      throw new NotFoundException('Resume or Vacancy not found');
    }

    const candidateSkills = (resume.parsedData.skills || []).map(s => s.toLowerCase());
    const vacancySkills = (vacancy.skills || []).map(s => s.toLowerCase());

    // 1. Skill Match Calculation
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    vacancySkills.forEach((vSkill, idx) => {
      const originalSkill = vacancy.skills[idx];
      if (candidateSkills.some(cSkill => cSkill.includes(vSkill) || vSkill.includes(cSkill))) {
        matchingSkills.push(originalSkill);
      } else {
        missingSkills.push(originalSkill);
      }
    });

    const skillScore = vacancySkills.length > 0
      ? (matchingSkills.length / vacancySkills.length) * 60
      : 50;

    // 2. Grade & Experience Alignment
    let gradeScore = 20;
    const weaknesses: string[] = [];
    const strengths: string[] = [];

    if (matchingSkills.length > 0) {
      strengths.push(`Matches ${matchingSkills.length} key required tech skills: ${matchingSkills.join(', ')}`);
    }

    if (resume.parsedData.grade === vacancy.grade) {
      gradeScore += 20;
      strengths.push(`Perfect grade match for ${vacancy.grade} level position.`);
    } else if (
      (resume.parsedData.grade === 'Senior' && vacancy.grade === 'Middle') ||
      (resume.parsedData.grade === 'Middle' && vacancy.grade === 'Junior')
    ) {
      gradeScore += 15;
      strengths.push(`Candidate experience (${resume.parsedData.grade}) exceeds minimum requirement (${vacancy.grade}).`);
    } else {
      gradeScore += 10;
      weaknesses.push(`Grade mismatch: Candidate is ${resume.parsedData.grade}, but vacancy requires ${vacancy.grade}.`);
    }

    if (missingSkills.length > 0) {
      weaknesses.push(`Missing requirements: ${missingSkills.slice(0, 4).join(', ')}`);
    }

    const totalScore = Math.min(100, Math.round(skillScore + gradeScore));

    let recommendation = 'High match! Highly recommended to apply.';
    if (totalScore < 60) {
      recommendation = 'Moderate match. Consider highlighting complementary project experience in cover letter.';
    } else if (totalScore < 40) {
      recommendation = 'Low match. Additional skill development recommended before applying.';
    }

    return {
      resumeId,
      vacancyId,
      score: totalScore,
      strengths,
      weaknesses,
      missingSkills,
      recommendation,
    };
  }
}
