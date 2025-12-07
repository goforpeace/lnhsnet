"use client"

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Building2, Mail, Users, Loader2 } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase"
import { collection, query } from "firebase/firestore"
import type { Project, ContactInquiry } from "@/lib/types"
import { format, getMonth, parseISO } from 'date-fns';

const chartConfig = {
  inquiries: {
    label: "Inquiries",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardHomePage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "projects")) : null),
    [firestore]
  );
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);
  
  const inquiriesQuery = useMemoFirebase(
    () => (firestore && user ? query(collection(firestore, "contact_form_submissions")) : null),
    [firestore, user]
  );
  const { data: inquiries, isLoading: inquiriesLoading } = useCollection<ContactInquiry>(inquiriesQuery);

  const totalProjects = projects?.length ?? 0
  const ongoingProjects = projects?.filter(p => p.status === "Ongoing").length ?? 0;
  const totalInquiries = inquiries?.length ?? 0;

  const { uniqueClients, monthlyInquiries } = useMemo(() => {
    if (!inquiries) {
      return { uniqueClients: 0, monthlyInquiries: [] };
    }

    const clientEmails = new Set<string>();
    inquiries.forEach(inquiry => clientEmails.add(inquiry.email.toLowerCase()));

    const monthlyCounts = Array(12).fill(0);
    inquiries.forEach(inquiry => {
      // Firebase Timestamps need to be converted to JS Dates.
      // The 'submissionDate' can be a server timestamp which is null initially.
      if (inquiry.submissionDate) {
        const date = inquiry.submissionDate.toDate();
        const month = getMonth(date); // 0-11
        monthlyCounts[month]++;
      }
    });

    const chartData = monthlyCounts.map((count, index) => ({
      month: format(new Date(0, index), 'MMMM'),
      inquiries: count,
    }));


    return { 
        uniqueClients: clientEmails.size,
        monthlyInquiries: chartData,
    };
  }, [inquiries]);


  return (
    <div className="space-y-8">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {projectsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">{totalProjects}</div>}
            <p className="text-xs text-muted-foreground">
              {ongoingProjects} projects currently ongoing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">+{totalInquiries}</div>}
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {inquiriesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-2xl font-bold">+{uniqueClients}</div>}
            <p className="text-xs text-muted-foreground">
              Unique contacts from inquiries
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inquiries Overview</CardTitle>
          <CardDescription>Monthly contact form submissions for the current year</CardDescription>
        </CardHeader>
        <CardContent>
            {inquiriesLoading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={monthlyInquiries}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <YAxis allowDecimals={false}/>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={4} />
                    </BarChart>
                </ChartContainer>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
