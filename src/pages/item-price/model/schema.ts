import dayjs from 'dayjs';
import { z } from 'zod';
import i18n from '@/locales/i18n';

export const searchFormSchema = z
  .object({
    year: z.string().min(1, i18n.t('validation.item-price.selecteYear')),
    month: z.string().min(1, i18n.t('validation.item-price.selectMonth')),
  })
  .superRefine((data, ctx) => {
    const yearMonth = `${data.year}-${data.month}-01`;

    if (!dayjs(yearMonth).isValid() || dayjs(yearMonth).isBefore(dayjs('2023-07-01'))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('validation.item-price.dateRootError'),
        path: ['year'],
      });

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t('validation.item-price.dateRootError'),
        path: ['month'],
      });

      return;
    }
  });

export type SearchFormData = z.infer<typeof searchFormSchema>;
