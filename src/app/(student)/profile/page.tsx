'use client';

import { useQuery } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, Award, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usersApi } from '@/lib/api/users';
import { useAuthStore } from '@/store/authStore';
import { generateInitials } from '@/lib/utils';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => usersApi.getProfile(),
  });

  const userData = profile ?? {
    name: user?.name ?? 'WB Aspirant',
    email: user?.email ?? 'student@wbexamready.in',
    role: user?.role ?? 'STUDENT',
    phone: '+91 9876543210',
    district: 'Kolkata, West Bengal',
    targetExams: ['WBCS', 'WBPSC Clerkship', 'SSC CGL'],
    avatar: '',
  };

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-black mb-6">Student Profile</h1>
      <div className="space-y-6">
        <Card className="border-2 border-[var(--color-border)]">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-56" /></div>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Avatar className="h-16 w-16 ring-4 ring-[var(--color-primary)]/20">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-lg font-bold bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
                    {generateInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{userData.name}</h2>
                  <p className="text-sm text-[var(--color-muted-foreground)]">{userData.email}</p>
                  <Badge variant={userData.role === 'ADMIN' ? 'default' : 'secondary'} className="mt-2 font-bold">
                    {userData.role}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Details</CardTitle>
            <CardDescription>Personal information & location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: User, label: 'Full Name', value: userData.name },
              { icon: Mail, label: 'Email Address', value: userData.email },
              { icon: Phone, label: 'Phone Number', value: userData.phone },
              { icon: MapPin, label: 'District / Location', value: userData.district },
            ].map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-muted)]">
                    <Icon className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{field.label}</p>
                    <p className="text-sm font-medium">{field.value}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
              Target Examinations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(userData.targetExams ?? ['WBCS', 'WBPSC Clerkship', 'SSC CGL']).map((ex) => (
              <Badge key={ex} variant="outline" className="px-3 py-1 text-xs font-semibold">
                {ex}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
