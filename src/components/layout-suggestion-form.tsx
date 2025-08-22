'use client';

import { useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { suggestLayout, type SuggestLayoutOutput } from '@/ai/flows/suggest-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

function LayoutSuggestionFormComponent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<SuggestLayoutOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  const unitType = searchParams.get('unitType') || '';
  const dimensions = searchParams.get('dimensions') || '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const unitDimensions = formData.get('unitDimensions') as string;
    const roomRequirements = formData.get('roomRequirements') as string;
    const stylePreferences = formData.get('stylePreferences') as string;

    startTransition(async () => {
      const res = await suggestLayout({ unitDimensions, roomRequirements, stylePreferences });
      setResult(res);
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
            <CardTitle>Unit Details</CardTitle>
            <CardDescription>Provide details for the layout suggestion.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="unitType">Unit Type</Label>
                <Input id="unitType" name="unitType" defaultValue={unitType} disabled />
            </div>
            <div className="space-y-2">
                <Label htmlFor="unitDimensions">Unit Dimensions</Label>
                <Input
                id="unitDimensions"
                name="unitDimensions"
                placeholder="e.g., 5m x 10m"
                defaultValue={dimensions}
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="roomRequirements">Room Requirements</Label>
                <Input
                id="roomRequirements"
                name="roomRequirements"
                placeholder="e.g., living room, kitchen, bedroom"
                required
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="stylePreferences">Style Preferences (Optional)</Label>
                <Input
                id="stylePreferences"
                name="stylePreferences"
                placeholder="e.g., modern, minimalist"
                />
            </div>
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Generating...' : 'Generate Layout'}
            </Button>
            </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Suggested Layout</CardTitle>
            <CardDescription>The AI-generated layout will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPending && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="aspect-video w-full" />
            </div>
          )}
          {result && (
            <div>
              <p className="text-muted-foreground">{result.layoutDescription}</p>
              {result.layoutImage && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg border">
                  <Image
                    src={result.layoutImage}
                    alt="Suggested Layout"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          )}
          {!isPending && !result && (
             <div className="text-center text-muted-foreground py-12">
                Fill out the form to generate a layout.
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export function LayoutSuggestionForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LayoutSuggestionFormComponent />
        </Suspense>
    )
}
