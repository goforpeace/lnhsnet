"use client"

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
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase"
import { collection, query } from "firebase/firestore"
import type { Project, ContactInquiry } from "@/lib/types"

const chartData = [
  { month: "January", inquiries: 186 },
  { month: "February", inquiries: 305 },
  { month: "March", inquiries: 237 },
  { month: "April", inquiries: 73 },
  { month: "May", inquiries: 209 },
  { month: "June", inquiries: 214 },
]

const chartConfig = {
  inquiries: {
    label: "Inquiries",
    color: "hsl(var(--primary))",
  },
}

export default function DashboardHomePage() {
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "projects")) : null),
    [firestore]
  );
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);
  
  const inquiriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, "contact_form_submissions")) : null),
    [firestore]
  );
  const { data: inquiries, isLoading: inquiriesLoading } = useCollection<ContactInquiry>(inquiriesQuery);

  const totalProjects = projects?.length ?? 0
  const ongoingProjects = projects?.filter(p => p.status === "Ongoing").length ?? 0;
  const totalInquiries = inquiries?.length ?? 0;

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
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Inquiries Overview</CardTitle>
          <CardDescription>Monthly contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
               <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
