'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const mockCategoryData = [
  { name: 'WBCS', count: 4200 },
  { name: 'WBPSC', count: 3500 },
  { name: 'SSC', count: 2900 },
  { name: 'Railway', count: 2100 },
  { name: 'Banking', count: 1800 },
];

const COLORS = ['hsl(43,96%,46%)', 'hsl(142,71%,45%)', 'hsl(217,91%,60%)', 'hsl(280,65%,60%)', 'hsl(0,84%,60%)'];

export default function AnalyticsAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">Platform Analytics</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Category engagement, exam completion rates, and demographic metrics</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exam Attempts by Category</CardTitle>
            <CardDescription>Popular exam categories amongst West Bengal candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(43,96%,46%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Candidate Share by Exam Category</CardTitle>
            <CardDescription>Percentage distribution of active test takers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={mockCategoryData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
