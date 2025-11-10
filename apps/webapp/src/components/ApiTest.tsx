'use client';

import { useHealthCheck } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

/**
 * Компонент для тестирования связи с backend API
 */
export function ApiTest() {
  const { data, isLoading, isError, error } = useHealthCheck();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Backend API Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking connection...
          </div>
        )}

        {isError && (
          <div className="flex items-center text-destructive">
            <XCircle className="mr-2 h-4 w-4" />
            <div>
              <p className="font-medium">Connection failed</p>
              <p className="text-xs text-muted-foreground">{error?.message}</p>
            </div>
          </div>
        )}

        {data && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-4 w-4" />
            <div>
              <p className="font-medium">Connected</p>
              <p className="text-xs text-muted-foreground">
                {JSON.stringify(data)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
