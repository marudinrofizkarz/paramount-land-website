"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getAvatarUrl, getUserInitials } from "@/lib/avatar-utils";
import { Edit, User, Mail, AtSign } from "lucide-react";
import ProfileEditForm from "./profile-edit-form";

export default function ProfileViewPage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const avatarUrl = user ? getAvatarUrl(user, 120) : "";
  const initials = user ? getUserInitials(user) : "U";

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Kembali ke View
          </Button>
        </div>
        <ProfileEditForm />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button onClick={() => setIsEditing(true)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informasi Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl} alt={user?.name || ""} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-muted-foreground">{user?.role || "User"}</p>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Nama Lengkap</span>
              </div>
              <p className="text-sm font-medium">{user?.name || "-"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AtSign className="h-4 w-4" />
                <span>Username</span>
              </div>
              <p className="text-sm font-medium">{user?.username || "-"}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-sm font-medium">{user?.email || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
