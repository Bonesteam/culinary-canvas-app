'use client';

import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AdminUserData {
  role?: 'admin';
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading: isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: adminUser, isLoading: isAdminLoading } = useDoc<AdminUserData>(userDocRef);

  const isLoading = isUserLoading || isAdminLoading;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || adminUser?.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return <>{children}</>;
}
