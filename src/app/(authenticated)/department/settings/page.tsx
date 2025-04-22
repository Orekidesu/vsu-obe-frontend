"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PersonalInfoForm } from "@/components/commons/settings/personal-info-form";
import { ChangePasswordForm } from "@/components/commons/settings/change-password-form";
import { useEffect } from "react";
import useUser from "@/hooks/shared/useUser";
import { Skeleton } from "@/components/ui/skeleton";

const defaultUser = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const [formattedUser, setFormattedUser] = useState(defaultUser);
  const { user, isLoading } = useUser();

  // Transform API user data format to our component format
  useEffect(() => {
    if (user) {
      setFormattedUser({
        firstName: user.First_Name || "",
        lastName: user.Last_Name || "",
        email: user.Email || "",
        role: user.Role || "",
      });
    }
  }, [user]);

  console.log(user);

  const updateUserInfo = (updatedInfo: Partial<typeof formattedUser>) => {
    setFormattedUser({ ...formattedUser, ...updatedInfo });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-[400px]" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-4xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalInfoForm
                user={formattedUser}
                updateUserInfo={updateUserInfo}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
