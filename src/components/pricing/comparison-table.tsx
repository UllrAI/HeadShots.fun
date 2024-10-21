import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from "next-intl/server";

export function ComparisonTable({ pricingData, locale }) {
  const t = useTranslations('PricingPage');
  unstable_setRequestLocale(locale);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('package')}</TableHead>
          {pricingData.map((plan, index) => (
            <TableHead key={index}>{plan.quantity} {t('credits')}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{t('price')}</TableCell>
          {pricingData.map((plan, index) => (
            <TableCell key={index}>${plan.price}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>{t('price_per')}</TableCell>
          {pricingData.map((plan, index) => (
            <TableCell key={index}>${(plan.price / plan.quantity).toFixed(2)}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}