import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { prisma } from '@/lib/db';

interface DailyCredit {
  date: string;
  added: number;
  used: number;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30', 10);

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const dailyCredits = await prisma.creditTransaction.groupBy({
    by: ['createdAt', 'type'],
    _sum: {
      amount: true,
    },
    where: {
      userId: user.id,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // 创建一个包含所有日期的对象，初始值为0
  const allDates = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    allDates[dateStr] = { date: dateStr, added: 0, used: 0 };
  }

  // 填充实际数据
  dailyCredits.forEach(curr => {
    const date = curr.createdAt.toISOString().split('T')[0];
    if (curr.type === 'USAGE') {
      allDates[date].used += curr._sum.amount || 0;
    } else {
      allDates[date].added += curr._sum.amount || 0;
    }
  });

  const chartData = Object.values(allDates).sort((a: DailyCredit, b: DailyCredit) => a.date.localeCompare(b.date));

  return NextResponse.json(chartData);
}