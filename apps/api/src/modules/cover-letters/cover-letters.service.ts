import { Injectable, NotFoundException } from '@nestjs/common';
import { ResumesService } from '../resumes/resumes.service';
import { VacanciesService } from '../vacancies/vacancies.service';
import { GenerateCoverLetterResponse, CoverLetterVariant } from '@hunter-ai/types';

@Injectable()
export class CoverLettersService {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly vacanciesService: VacanciesService,
  ) {}

  async generate(userId: string, resumeId: string, vacancyId: string, customNotes?: string): Promise<GenerateCoverLetterResponse> {
    const resume = await this.resumesService.findOneByUser(resumeId, userId);
    const vacancy = await this.vacanciesService.findOne(vacancyId);

    if (!resume || !vacancy) {
      throw new NotFoundException('Resume or Vacancy not found');
    }

    const candidatePosition = resume.parsedData.position || 'Software Engineer';
    const topSkills = (resume.parsedData.skills || []).slice(0, 5).join(', ');
    const company = vacancy.company || 'команде';
    const vacancyTitle = vacancy.title;

    const variants: CoverLetterVariant[] = [
      {
        style: 'short_direct',
        title: 'Короткое и лаконичное (Short & Direct)',
        content: `Здравствуйте!

Меня заинтересовала вакансия "${vacancyTitle}" в компания "${company}". Имею успешный опыт работы в качестве ${candidatePosition} с ключевым стеком: ${topSkills}.

В предыдущих проектах я занимался разработкой продуктовых веб-приложений, проектированием клиентской архитектуры и оптимизацией производительности. Уверен, что мой профиль и практические навыки позволят быстро включиться в работу вашей команды.

${customNotes ? `Дополнительно: ${customNotes}\n\n` : ''}Буду рад обсудить детали на интервью!

С уважением,
Александр`,
      },
      {
        style: 'technical_detailed',
        title: 'Техническое и глубокое (Technical & Detailed)',
        content: `Здравствуйте, команда hiring-менеджеров "${company}"!

Пишу вам по поводу позиции "${vacancyTitle}". Тщательно изучив требования к стеку и задачам, я увидел отличное соответствие своему практическому опыту.

Мой стек и ключевые компетенции:
- Основной профиль: ${candidatePosition} (${resume.parsedData.grade})
- Технологии: ${topSkills}
- Опыт работы: более ${Math.round((resume.parsedData.totalExperienceMonths || 12) / 12)} лет в продуктовой и заказной разработке.

На предыдущем месте работы я отвечал за разработку SPA и модулей на React / TypeScript, настройку сборки (Vite, Yarn Workspaces), интеграцию с REST/GraphQL/WebSocket API и оптимизацию UI/UX.

${customNotes ? `Особые пожелания / контекст: ${customNotes}\n\n` : ''}Готов продемонстрировать примеры кода и обсудить технические задачи вашего проекта.

С уважением,
Александр`,
      },
      {
        style: 'product_enthusiastic',
        title: 'Продуктовое и ориентированное на бизнес (Product & Impact Focus)',
        content: `Здравствуйте!

С большим интересом слежу за развитием продуктов компании "${company}" и хочу принести пользу вашей команде в роли "${vacancyTitle}".

Как ${candidatePosition}, я сфокусирован не только на чистоте архитектуры и кода (${topSkills}), но и на создании измеримой ценности для пользователей и бизнеса: сокращении времени ручной работы команды и ускорении поставки фич.

Владею современным стеком технологических инструментов и практиками командной разработки (Git Flow, Scrum, Code Review).

${customNotes ? `Примечания: ${customNotes}\n\n` : ''}Буду рад познакомиться и обсудить, как мои навыки помогут в достижении целей компании "${company}".

С уважением,
Александр`,
      },
    ];

    return {
      resumeId,
      vacancyId,
      variants,
    };
  }
}
