import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function InfoCard({ title, value, detail, icon, link }: { title: string, value: number, detail: string, icon: React.ReactNode, link?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
        {link && (
          <Link href={link} className="mt-2 inline-block">
            <Button variant="secondary">View</Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}