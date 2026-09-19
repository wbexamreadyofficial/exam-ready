'use client';

import { useState } from 'react';
import { Plus, Search, Sparkles, FileUp, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PageHeader } from '@/components/layout/PageHeader';

const MOCK_QUESTIONS = [
  { id: 'q1', text: 'Which committee recommended the inclusion of Fundamental Duties?', subject: 'Polity', difficulty: 'MEDIUM', marks: 1 },
  { id: 'q2', text: 'Who was the first Governor-General of Bengal under Regulating Act 1773?', subject: 'History', difficulty: 'EASY', marks: 1 },
  { id: 'q3', text: 'Sundarbans Mangrove forest was declared a UNESCO World Heritage Site in which year?', subject: 'Geography', difficulty: 'HARD', marks: 1 },
];

export default function QuestionsAdminPage() {
  const [activeTab, setActiveTab] = useState('bank');
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);

  const handleSimulateOcr = () => {
    setOcrProcessing(true);
    setOcrSuccess(false);
    setTimeout(() => {
      setOcrProcessing(false);
      setOcrSuccess(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank & AI/OCR Import"
        description="Manage MCQs, bulk import, and extract questions from PDFs via AI/OCR"
        actions={
          <Button className="font-bold gap-2">
          <Plus className="h-4 w-4" /> Add Single MCQ
        </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="bank">Question Bank</TabsTrigger>
          <TabsTrigger value="ocr" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" /> AI / OCR Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bank">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
                  <Input placeholder="Search question text or subject..." className="pl-9" />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question Text</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_QUESTIONS.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium text-sm max-w-md truncate">{q.text}</TableCell>
                      <TableCell><Badge variant="secondary">{q.subject}</Badge></TableCell>
                      <TableCell><Badge variant={q.difficulty === 'HARD' ? 'destructive' : q.difficulty === 'MEDIUM' ? 'warning' : 'success'}>{q.difficulty}</Badge></TableCell>
                      <TableCell className="text-sm font-semibold">{q.marks} mark</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ocr">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
                Extract Questions from Question Paper PDF / Image
              </CardTitle>
              <CardDescription>Upload a previous year question paper. Backend OCR & AI service will extract options and answer key automatically.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-[var(--color-border)] rounded-2xl p-8 text-center bg-[var(--color-muted)]/20">
                <FileUp className="h-10 w-10 text-[var(--color-primary)] mx-auto mb-3" />
                <p className="font-bold text-base mb-1">Drag & Drop Question Paper PDF or Image</p>
                <p className="text-xs text-[var(--color-muted-foreground)] mb-4">Supports PDF, PNG, JPG (Max 20MB)</p>
                <Button onClick={handleSimulateOcr} loading={ocrProcessing} className="font-bold">
                  {ocrProcessing ? 'Processing OCR & AI Model...' : 'Select File & Simulate Extraction'}
                </Button>
              </div>

              {ocrSuccess && (
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 space-y-3">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-bold">
                    <CheckCircle className="h-5 w-5" />
                    Successfully Extracted 25 Questions from Uploaded Document
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400">Questions are ready for review before publishing to the question bank.</p>
                  <Button size="sm" className="font-bold">Review & Approve Generated MCQs</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
