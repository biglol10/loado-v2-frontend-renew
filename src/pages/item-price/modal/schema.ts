import dayjs from 'dayjs';
import { z } from 'zod';

export const searchFormSchema = z
  .object({
    year: z.string().min(1, '연도를 선택해주세요'),
    month: z.string().min(1, '월을 선택해주세요'),
  })
  .superRefine((data, ctx) => {
    const yearMonth = `${data.year}-${data.month}`;

    if (!dayjs(yearMonth).isValid() || dayjs(yearMonth).isBefore(dayjs('2023-06-01'))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '조회 가능한 기간은 2023년 7월 이후입니다.',
      });

      return;
    }
  });

export type SearchFormData = z.infer<typeof searchFormSchema>;
