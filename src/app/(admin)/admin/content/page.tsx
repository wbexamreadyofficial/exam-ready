'use client';

import { FolderOpen, FileText, Image as ImageIcon, Video, Upload, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PageHeader } from '@/components/layout/PageHeader';

const MOCK_FILES = [
  { id: 'f1', name: 'wbcs_2025_prelims_question_paper.pdf', type: 'PDF', category: 'media/pdfs/', size: '4.2 MB', uploadedAt: '2026-08-01' },
  { id: 'f2', name: 'sundarbans_map_diagram.png', type: 'IMAGE', category: 'media/questions/', size: '850 KB', uploadedAt: '2026-08-04' },
  { id: 'f3', name: 'wb_geography_crash_course_ch1.mp4', type: 'VIDEO', category: 'media/videos/', size: '145 MB', uploadedAt: '2026-08-06' },
];

export default function ContentAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Media & Content Repository (S3)"
        description="Manage uploaded study materials, question diagrams, and video lectures stored securely in Amazon S3"
        actions={
          <Button className="font-bold gap-2">
          <Upload className="h-4 w-4" /> Upload New File
        </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>S3 Bucket Path</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FILES.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-semibold text-sm flex items-center gap-2">
                    {f.type === 'PDF' && <FileText className="h-4 w-4 text-red-500" />}
                    {f.type === 'IMAGE' && <ImageIcon className="h-4 w-4 text-blue-500" />}
                    {f.type === 'VIDEO' && <Video className="h-4 w-4 text-purple-500" />}
                    {f.name}
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="text-[10px]">{f.type}</Badge></TableCell>
                  <TableCell className="font-mono text-xs text-[var(--color-muted-foreground)]">{f.category}</TableCell>
                  <TableCell className="text-xs">{f.size}</TableCell>
                  <TableCell className="text-xs text-[var(--color-muted-foreground)]">{f.uploadedAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
