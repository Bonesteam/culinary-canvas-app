'use client';

import { useMongoDB } from '@/context/MongoDBContext';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminRequestsPage() {
  const { user } = useMongoDB();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch('/api/meal-plans?admin=true')
        .then(res => res.json())
        .then(data => setRequests(data.mealPlans || []))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <div className="container py-8 md:py-12">
      <PageHeader
        title="Chef Requests"
        description="View and manage all incoming meal plan requests from users."
      />
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <>
                  <TableRow>
                    <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                   <TableRow>
                    <TableCell colSpan={5}><Skeleton className="h-8 w-full" /></TableCell>
                  </TableRow>
                </>
              )}
              {requests && requests.length > 0 ? (
                requests.map((request: any) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      {new Date(request.creationDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{request.userId}</TableCell>
                    <TableCell>
                      <Badge variant={request.type === 'AI Plan' ? 'secondary' : 'default'}>
                        {request.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={request.status === 'completed' ? 'outline' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       {request.type === 'Chef Plan' && (
                         <Button asChild variant="ghost" size="sm">
                            <Link href={`/admin/requests/${request._id}`}>
                               <Eye className="mr-2 h-4 w-4"/> View
                            </Link>
                         </Button>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground h-24"
                    >
                      No requests found.
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
