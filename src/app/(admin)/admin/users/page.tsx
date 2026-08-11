'use client';

import { useState } from 'react';
import { Search, ShieldAlert, UserCheck, UserX, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const MOCK_USERS = [
  { id: 'u1', name: 'Anindya Sundar', email: 'anindya@example.com', role: 'ADMIN', status: 'ACTIVE', totalExams: 42, registeredAt: '2026-01-10' },
  { id: 'u2', name: 'Priya Chakraborty', email: 'priya@example.com', role: 'STUDENT', status: 'ACTIVE', totalExams: 18, registeredAt: '2026-02-15' },
  { id: 'u3', name: 'Rajesh Mukherjee', email: 'rajesh@example.com', role: 'STUDENT', status: 'INACTIVE', totalExams: 5, registeredAt: '2026-03-01' },
  { id: 'u4', name: 'Suman Mondal', email: 'suman@example.com', role: 'STUDENT', status: 'ACTIVE', totalExams: 29, registeredAt: '2026-03-12' },
  { id: 'u5', name: 'Kavita Ghosh', email: 'kavita@example.com', role: 'STUDENT', status: 'ACTIVE', totalExams: 12, registeredAt: '2026-04-05' },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState(MOCK_USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u)));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">User Management</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Manage registered candidates and admin accounts</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-muted-foreground)]" />
              <Input
                placeholder="Search by candidate name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Exams Attempted</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'} className="text-[10px]">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : 'destructive'} className="text-[10px]">
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-sm">{user.totalExams}</TableCell>
                  <TableCell className="text-xs text-[var(--color-muted-foreground)]">{user.registeredAt}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(user.id)}
                      className={user.status === 'ACTIVE' ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}
                    >
                      {user.status === 'ACTIVE' ? <UserX className="h-4 w-4 mr-1" /> : <UserCheck className="h-4 w-4 mr-1" />}
                      {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>
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
