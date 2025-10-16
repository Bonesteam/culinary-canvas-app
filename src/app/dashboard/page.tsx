'use client';

import { useMongoDB } from '@/context/MongoDBContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Coins, History, ShoppingCart, Eye, Download, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading: isUserLoading } = useMongoDB();
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch meal plans
      fetch(`/api/meal-plans?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => setOrders(data.mealPlans || []))
        .catch(console.error);

      // Fetch transactions
      fetch(`/api/transactions?userId=${user.uid}`)
        .then(res => res.json())
        .then(data => setPurchases(data.transactions || []))
        .catch(console.error);
    }
    setIsLoading(false);
  }, [user]);

  if (isUserLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  const handleDownloadPdf = (planContent: string, planType: string, planDate: string) => {
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Culinary Canvas - Meal Plan', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`${planType} - ${planDate}`, 105, 30, { align: 'center' });

    // Split the content into lines to handle wrapping
    const splitContent = doc.splitTextToSize(planContent, 180);
    doc.setFontSize(12);
    doc.text(splitContent, 15, 50);

    doc.save(`culinary-canvas-plan-${planDate}.pdf`);
  };
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <div className="container py-8 md:py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-headline font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your culinary command center.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Profile</CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-4">
             <Avatar className="h-16 w-16">
                <AvatarImage src={user?.photoURL} alt={user?.displayName} />
                <AvatarFallback>{user?.displayName ? getInitials(user.displayName) : '..'}</AvatarFallback>
            </Avatar>
            <div className="truncate">
                <p className="text-lg font-semibold truncate">{user?.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user?.tokenBalance?.toLocaleString() ?? 0} Tokens
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to spend on your next meal plan.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Meal Plan History
            </CardTitle>
            <CardDescription>A record of all your generated or requested meal plans.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders && orders.length > 0 ? (
                  orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Badge
                          variant={order.type === 'AI Plan' ? 'secondary' : 'default'}
                        >
                          {order.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.creationDate), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {order.cost} Tokens
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="View Plan">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{order.type} - {format(new Date(order.creationDate), 'PP')}</DialogTitle>
                            </DialogHeader>
                            <div className="prose prose-sm max-w-none whitespace-pre-wrap max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
                              {order.content}
                            </div>
                          </DialogContent>
                        </Dialog>
                        {order.type === 'Chef Plan' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Download PDF" 
                              onClick={() => handleDownloadPdf(order.content, order.type, format(new Date(order.creationDate), 'yyyy-MM-dd'))}
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No meal plans created yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Purchase History
            </CardTitle>
            <CardDescription>A log of all your token purchases.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases && purchases.length > 0 ? (
                  purchases.map((purchase: any) => (
                    <TableRow key={purchase._id}>
                      <TableCell>
                        {format(new Date(purchase.date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {purchase.details}
                      </TableCell>
                      <TableCell className="font-medium">
                        +{purchase.tokens.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {new Intl.NumberFormat(
                          purchase.currency === 'GBP' ? 'en-GB' : 'de-DE',
                          { style: 'currency', currency: purchase.currency }
                        ).format(purchase.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No purchases yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
    return (
      <div className="container py-8 md:py-12">
        <header className="mb-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </header>
  
        <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">My Profile</CardTitle>
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                </CardContent>
            </Card>
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/3 mt-2" />
            </CardContent>
          </Card>
        </div>
  
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Meal Plan History
              </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Cost</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                            <TableCell className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                             <TableCell className="flex justify-end gap-2">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Purchase History
              </CardTitle>
            </CardHeader>
            <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                </TableRow>
                <TableRow>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }