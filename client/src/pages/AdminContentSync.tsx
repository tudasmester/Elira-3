import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Upload, 
  Sync, 
  CheckCircle, 
  AlertCircle, 
  Database, 
  Eye,
  Archive,
  BarChart3,
  RefreshCw,
  FileText,
  Globe
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SyncStatus {
  lastSyncTime: string;
  totalCourses: number;
  publishedCourses: number;
  archivedCourses: number;
  freeCourses: number;
  paidCourses: number;
  highlightedCourses: number;
  universities: number;
  categories: string[];
  levels: string[];
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export default function AdminContentSync() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get synchronization status
  const { data: syncStatus, refetch: refetchStatus } = useQuery<SyncStatus>({
    queryKey: ['/api/admin/sync-status'],
  });

  // Get data validation status
  const { data: validation, refetch: refetchValidation } = useQuery<ValidationResult>({
    queryKey: ['/api/admin/validate-data'],
  });

  // Import courses mutation
  const importCoursesMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/import-courses");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Import sikeres!",
        description: "Kurzusok sikeresen importálva a frontend oldalakról.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      refetchStatus();
      refetchValidation();
    },
    onError: () => {
      toast({
        title: "Import hiba",
        description: "Hiba történt a kurzusok importálása során.",
        variant: "destructive",
      });
    },
  });

  // Sync visibility mutation
  const syncVisibilityMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/sync-visibility");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Szinkronizálás sikeres!",
        description: "Kurzus láthatóság sikeresen szinkronizálva.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      refetchStatus();
    },
    onError: () => {
      toast({
        title: "Szinkronizálás hiba",
        description: "Hiba történt a láthatóság szinkronizálása során.",
        variant: "destructive",
      });
    },
  });

  // Export data mutation
  const exportDataMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("GET", "/api/admin/export-frontend");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Export sikeres!",
        description: "Adatok sikeresen exportálva a frontend számára.",
      });
    },
    onError: () => {
      toast({
        title: "Export hiba",
        description: "Hiba történt az adatok exportálása során.",
        variant: "destructive",
      });
    },
  });

  const isLoading = importCoursesMutation.isPending || 
                   syncVisibilityMutation.isPending || 
                   exportDataMutation.isPending;

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tartalom szinkronizálás</h1>
          <p className="text-muted-foreground">
            Kurzusok importálása, szerkesztése és szinkronizálása a frontend oldalakkal
          </p>
        </div>
        <Button
          onClick={() => {
            refetchStatus();
            refetchValidation();
          }}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Frissítés
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Áttekintés</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
          <TabsTrigger value="sync">Szinkronizálás</TabsTrigger>
          <TabsTrigger value="validation">Validálás</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Összes kurzus</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus?.totalCourses || 0}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">{syncStatus?.publishedCourses || 0} aktív</Badge>
                  <Badge variant="outline">{syncStatus?.archivedCourses || 0} archivált</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingyenes kurzusok</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus?.freeCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {syncStatus?.paidCourses || 0} fizetős kurzus
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Kiemelt kurzusok</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus?.highlightedCourses || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Trending oldalon megjelenő
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Egyetemek</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{syncStatus?.universities || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Partner intézmények
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Categories and Levels */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kategóriák</CardTitle>
                <CardDescription>Elérhető kurzus kategóriák</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {syncStatus?.categories?.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Szintek</CardTitle>
                <CardDescription>Elérhető nehézségi szintek</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {syncStatus?.levels?.map((level) => (
                    <Badge key={level} variant="outline">
                      {level}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Sync Info */}
          {syncStatus?.lastSyncTime && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Utolsó szinkronizálás: {new Date(syncStatus.lastSyncTime).toLocaleString('hu-HU')}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Kurzusok importálása
              </CardTitle>
              <CardDescription>
                Automatikusan importálja a kurzusokat a meglévő frontend oldalakról (/courses, /trending, /careers)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Az import folyamat csak új kurzusokat ad hozzá, a meglévő kurzusokat nem írja felül.
                  Ez biztosítja, hogy a már szerkesztett tartalmak megmaradjanak.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Frontend kurzusok</div>
                    <div className="text-sm text-muted-foreground">
                      Kurzusok importálása a /courses, /trending és /careers oldalakról
                    </div>
                  </div>
                  <Badge variant="secondary">6 új kurzus</Badge>
                </div>
              </div>

              <Button
                onClick={() => importCoursesMutation.mutate()}
                disabled={isLoading}
                className="w-full"
              >
                {importCoursesMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importálás...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Kurzusok importálása
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Tab */}
        <TabsContent value="sync" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sync className="h-5 w-5" />
                  Láthatóság szinkronizálás
                </CardTitle>
                <CardDescription>
                  Automatikusan beállítja a kurzusok trending státuszát és láthatóságát
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => syncVisibilityMutation.mutate()}
                  disabled={isLoading}
                  className="w-full"
                >
                  {syncVisibilityMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Szinkronizálás...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Láthatóság szinkronizálás
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Frontend export
                </CardTitle>
                <CardDescription>
                  Exportálja az aktuális kurzus adatokat a frontend oldalak számára
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => exportDataMutation.mutate()}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {exportDataMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exportálás...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Adatok exportálása
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Valós idejű szinkronizálás</CardTitle>
              <CardDescription>
                Az admin panelen végrehajtott változtatások automatikusan megjelennek a frontend oldalakon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Kurzus létrehozás → azonnali megjelenés a /courses oldalon</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Kiemelt státusz → automatikus megjelenés a /trending oldalon</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Kategória módosítás → frissítés a /careers oldalon</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Archivált kurzusok → automatikus elrejtés</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validation Tab */}
        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Adatok validálása
                {validation?.valid ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Érvényes
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Hibás
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Ellenőrzi az adatok integritását és konzisztenciáját
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {validation?.valid ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Minden adat érvényes és konzisztens. Nincsenek hibák az adatbázisban.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {validation?.errors?.length || 0} hiba található az adatokban. 
                    Kérjük, javítsa ki ezeket a problémákat.
                  </AlertDescription>
                </Alert>
              )}

              {validation?.errors && validation.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Talált hibák:</h4>
                  <div className="space-y-1">
                    {validation.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => refetchValidation()}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Validálás újrafuttatása
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}