"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { AddProjectForm } from "./add-project-form";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

// Mock data - replace with real data from your API
const projects = [
  {
    id: 1,
    name: "Serene Meadows Residence",
    location: "Jakarta Selatan",
    status: "active",
    units: 24,
    price: "Rp 850M - 1.2B",
    completion: "85%",
  },
  {
    id: 2,
    name: "Green Valley Estate",
    location: "Bekasi",
    status: "planning",
    units: 48,
    price: "Rp 650M - 950M",
    completion: "15%",
  },
  {
    id: 3,
    name: "Sunset Heights",
    location: "Tangerang",
    status: "completed",
    units: 36,
    price: "Rp 1.1B - 1.5B",
    completion: "100%",
  },
  {
    id: 4,
    name: "Ocean View Residences",
    location: "Bandung",
    status: "construction",
    units: 72,
    price: "Rp 750M - 1.1B",
    completion: "60%",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "planning":
      return "bg-blue-100 text-blue-800";
    case "construction":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

interface ProjectData {
  name: string;
  slug: string;
  location: string;
  mainImage: File | null;
  galleryImages: File[];
  startingPrice: string;
  brochureFile: File | null;
  youtubeLink: string;
  advantages: string[];
}

export function ProjectsTable() {
  const [projectsList, setProjectsList] = useState(projects);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Property Projects</CardTitle>
            <Button asChild>
              <Link href="/dashboard/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectsList.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{project.units} Units</p>
                    <p className="text-xs text-muted-foreground">
                      {project.price}
                    </p>
                  </div>

                  <div className="text-center">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.completion} Complete
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
