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
// import { UserCog } from "lucide-react";

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "Administrator",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(mockUser);

  const updateUserInfo = (updatedInfo: Partial<typeof user>) => {
    setUser({ ...user, ...updatedInfo });
  };

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
              <PersonalInfoForm user={user} updateUserInfo={updateUserInfo} />
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
