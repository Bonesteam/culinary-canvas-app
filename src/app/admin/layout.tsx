'use client';

import { useMongoDB } from '@/context/MongoDBContext';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AdminUserData {
  role?: 'admin';
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading: isUserLoading } = useMongoDB();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
