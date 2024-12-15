import { z } from 'zod';

export const searchFormSchema = z.object({
  year: z.string().min(1, '연도를 선택해주세요'),
  month: z.string().min(1, '월을 선택해주세요'),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;
