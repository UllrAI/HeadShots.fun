import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ComparisonTable({ pricingData }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          {pricingData.map((plan, index) => (
            <TableHead key={index}>{plan.quantity} Credits</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Price</TableCell>
          {pricingData.map((plan, index) => (
            <TableCell key={index}>${plan.price}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell>Price per Credit</TableCell>
          {pricingData.map((plan, index) => (
            <TableCell key={index}>${(plan.price / plan.quantity).toFixed(2)}</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}