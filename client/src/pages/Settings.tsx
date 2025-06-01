import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth.tsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Moon, 
  Sun,
  Camera,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock
} from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import ProfileImageUpload from '@/components/ProfileImageUpload';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImageUrl?: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  courseReminders: boolean;
  promotionalEmails: boolean;
  weeklyProgress: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "private";
  showProgress: boolean;
  showCertificates: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState<UserProfile>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profileImageUrl: user?.profileImageUrl || ""
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    courseReminders: true,
    promotionalEmails: false,
    weeklyProgress: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "public",
    showProgress: true,
    showCertificates: true
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UserProfile) => {
      const response = await apiRequest("PUT", "/api/auth/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Profil frissítve",
        description: "Az adatai sikeresen frissítve lettek",
      });
    },
    onError: () => {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült frissíteni a profilt",
        variant: "destructive",
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      const response = await apiRequest("PUT", "/api/auth/password", data);
      return response.json();
    },
    onSuccess: () => {
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Jelszó megváltoztatva",
        description: "Az új jelszó sikeresen beállítva",
      });
    },
    onError: () => {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült megváltoztatni a jelszót",
        variant: "destructive",
      });
    },
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: { notifications: NotificationSettings; privacy: PrivacySettings }) => {
      const response = await apiRequest("PUT", "/api/auth/settings", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Beállítások mentve",
        description: "A preferenciái sikeresen frissítve lettek",
      });
    },
    onError: () => {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült menteni a beállításokat",
        variant: "destructive",
      });
    },
  });

  const handleProfileUpdate = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Hiba",
        description: "Az új jelszavak nem egyeznek",
        variant: "destructive",
      });
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Hiba",
        description: "A jelszónak legalább 6 karakter hosszúnak kell lennie",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate(passwordData);
  };

  const handleSettingsUpdate = () => {
    updateSettingsMutation.mutate({ notifications, privacy });
  };

  // Logout functionality
  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.invalidateQueries();
      toast({
        title: "Sikeres kijelentkezés",
        description: "Viszlát!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Hiba történt",
        description: "Kérjük, próbálja újra",
        variant: "destructive",
      });
    }
  };

  const getUserInitials = () => {
    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Beállítások</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Kezelje fiókját és preferenciáit
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              Vissza a műszerfalhoz
            </Button>
          </Link>
        </motion.div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Értesítések</TabsTrigger>
            <TabsTrigger value="privacy">Adatvédelem</TabsTrigger>
            <TabsTrigger value="account">Fiók</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Személyes adatok
                </CardTitle>
                <CardDescription>
                  Frissítse személyes információit és profilképét
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <ProfileImageUpload
                  currentImageUrl={profileData.profileImageUrl}
                  userName={`${profileData.firstName} ${profileData.lastName}`}
                  onImageUpdate={(imageUrl) => {
                    setProfileData({...profileData, profileImageUrl: imageUrl});
                  }}
                />

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Keresztnév</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      placeholder="Keresztnév"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Vezetéknév</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      placeholder="Vezetéknév"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email cím</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="pl-10"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefonszám</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="pl-10"
                        placeholder="+36 70 123 4567"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleProfileUpdate}
                  disabled={updateProfileMutation.isPending}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Mentés..." : "Profil mentése"}
                </Button>
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Jelszó megváltoztatása
                </CardTitle>
                <CardDescription>
                  Biztonsági okokból rendszeresen változtassa meg jelszavát
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Jelenlegi jelszó</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="pl-10 pr-10"
                      placeholder="Jelenlegi jelszó"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Új jelszó</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Új jelszó"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Új jelszó megerősítése</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Új jelszó megerősítése"
                  />
                </div>

                <Button 
                  onClick={handlePasswordChange}
                  disabled={changePasswordMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {changePasswordMutation.isPending ? "Mentés..." : "Jelszó megváltoztatása"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Értesítési beállítások
                </CardTitle>
                <CardDescription>
                  Válassza ki, milyen értesítéseket szeretne kapni
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email értesítések</Label>
                    <p className="text-sm text-gray-500">
                      Kapjon email értesítéseket a fontos eseményekről
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, emailNotifications: checked})
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Kurzus emlékeztetők</Label>
                    <p className="text-sm text-gray-500">
                      Emlékeztetők a folyamatban lévő kurzusokról
                    </p>
                  </div>
                  <Switch
                    checked={notifications.courseReminders}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, courseReminders: checked})
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Promóciós emailek</Label>
                    <p className="text-sm text-gray-500">
                      Információk új kurzusokról és kedvezményekről
                    </p>
                  </div>
                  <Switch
                    checked={notifications.promotionalEmails}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, promotionalEmails: checked})
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Heti haladási jelentés</Label>
                    <p className="text-sm text-gray-500">
                      Heti összefoglaló a tanulási eredményeiről
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyProgress}
                    onCheckedChange={(checked) => 
                      setNotifications({...notifications, weeklyProgress: checked})
                    }
                  />
                </div>

                <Button 
                  onClick={handleSettingsUpdate}
                  disabled={updateSettingsMutation.isPending}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSettingsMutation.isPending ? "Mentés..." : "Beállítások mentése"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Adatvédelmi beállítások
                </CardTitle>
                <CardDescription>
                  Kezelje, hogy mások mit láthatnak a profiljából
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Profil láthatósága</Label>
                    <p className="text-sm text-gray-500">
                      Mások láthatják-e a profilját
                    </p>
                  </div>
                  <Switch
                    checked={privacy.profileVisibility === "public"}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, profileVisibility: checked ? "public" : "private"})
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Haladás megjelenítése</Label>
                    <p className="text-sm text-gray-500">
                      Mások láthatják a tanulási előrehaladását
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showProgress}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, showProgress: checked})
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Bizonyítványok megjelenítése</Label>
                    <p className="text-sm text-gray-500">
                      Mások láthatják a megszerzett bizonyítványait
                    </p>
                  </div>
                  <Switch
                    checked={privacy.showCertificates}
                    onCheckedChange={(checked) => 
                      setPrivacy({...privacy, showCertificates: checked})
                    }
                  />
                </div>

                <Button 
                  onClick={handleSettingsUpdate}
                  disabled={updateSettingsMutation.isPending}
                  className="w-full md:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSettingsMutation.isPending ? "Mentés..." : "Beállítások mentése"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Előfizetés kezelése
                </CardTitle>
                <CardDescription>
                  Tekintse meg és kezelje előfizetését
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Jelenlegi előfizetés</h4>
                    <p className="text-sm text-gray-600">
                      {user.subscriptionType === 'free' ? 'Ingyenes csomag' : 
                       user.subscriptionType === 'plus' ? 'Plus csomag' : 'Premium csomag'}
                    </p>
                  </div>
                  <Link href="/subscription">
                    <Button variant="outline">
                      Előfizetés módosítása
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Megjelenés
                </CardTitle>
                <CardDescription>
                  Testreszabja az alkalmazás megjelenését
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Sötét mód</Label>
                    <p className="text-sm text-gray-500">
                      Váltás sötét témára
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                    />
                    <Moon className="h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                  <Trash2 className="h-5 w-5 mr-2" />
                  Veszélyes zóna
                </CardTitle>
                <CardDescription>
                  Fiók törlése és kijelentkezés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Kijelentkezés</h4>
                    <p className="text-sm text-gray-600">
                      Kijelentkezés az összes eszközről
                    </p>
                  </div>
                  <Button variant="outline" onClick={logout}>
                    Kijelentkezés
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-red-600">Fiók törlése</h4>
                    <p className="text-sm text-gray-600">
                      Véglegesen törli fiókját és minden adatát
                    </p>
                  </div>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Fiók törlése
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}