"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, Home, TrendingUp, Users } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export function DashboardOverview() {
  const { user } = useUser();
  const [greeting, setGreeting] = useState("");

  // Function to get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return "Good Morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good Afternoon";
    } else if (hour >= 17 && hour < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };

  useEffect(() => {
    setGreeting(getTimeBasedGreeting());
  }, []);

  // Get full name from Clerk user data
  const getFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.fullName) {
      return user.fullName;
    } else {
      return "User";
    }
  };

  // Mock data - replace with real data from your API
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      description: "Active property projects",
      icon: Building,
      trend: "+2.5%",
    },
    {
      title: "Total Units",
      value: "156",
      description: "Property units available",
      icon: Home,
      trend: "+12.3%",
    },
    {
      title: "Revenue",
      value: "Rp 2.4B",
      description: "Total revenue this month",
      icon: TrendingUp,
      trend: "+8.1%",
    },
    {
      title: "Customers",
      value: "89",
      description: "Active customers",
      icon: Users,
      trend: "+5.2%",
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          {greeting}, Selamat Datang kembali {getFullName()} 👋
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Improved responsive layout for Recent Activity and Quick Actions */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your property projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">
                    New project "Serene Meadows" added
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">
                    Unit reservation for "Green Valley"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">
                    Payment received for "Sunset Heights"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-900/40 transition-colors">
                    <span className="text-green-600 dark:text-green-400 text-sm">➕</span>
                  </div>
                  <span className="text-sm font-medium">Add New Project</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                    <span className="text-blue-600 dark:text-blue-400 text-sm">📊</span>
                  </div>
                  <span className="text-sm font-medium">View Reports</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/40 transition-colors">
                    <span className="text-purple-600 dark:text-purple-400 text-sm">👥</span>
                  </div>
                  <span className="text-sm font-medium">Manage Customers</span>
                </div>
              </button>
              
              <button className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50 group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-900/20 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-900/40 transition-colors">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">⚙️</span>
                  </div>
                  <span className="text-sm font-medium">Settings</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
