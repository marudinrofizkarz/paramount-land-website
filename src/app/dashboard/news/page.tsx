'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { getAllNews, deleteNews, toggleNewsStatus, NewsItem } from '@/lib/news-actions';
import { IconPlus, IconEdit, IconTrash, IconEye, IconEyeOff, IconSearch } from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

export default function NewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getAllNews();
      if (response.success && response.data) {
        setNews(response.data);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch news',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch news',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await deleteNews(id);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'News deleted successfully',
        });
        fetchNews();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to delete news',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete news',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setTogglingId(id);
      const response = await toggleNewsStatus(id);
      if (response.success) {
        toast({
          title: 'Success',
          description: response.message,
        });
        fetchNews();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to toggle news status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error toggling news status:', error);
      toast({
        title: 'Error',
        description: 'Failed to toggle news status',
        variant: 'destructive',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">News & Updates</h1>
          <p className="text-muted-foreground">Manage news articles and updates</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/news/new">
            <IconPlus className="mr-2 h-4 w-4" />
            Add News
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredNews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No news found</p>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={item.is_published ? 'default' : 'secondary'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {item.icon}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    <p className="text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Created {formatDate(item.created_at)}</span>
                      {item.published_at && (
                        <span>Published {formatDate(item.published_at)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleStatus(item.id)}
                      disabled={togglingId === item.id}
                    >
                      {item.is_published ? (
                        <IconEyeOff className="h-4 w-4" />
                      ) : (
                        <IconEye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                    >
                      <Link href={`/dashboard/news/${item.id}/edit`}>
                        <IconEdit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete News</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this news article? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                          >
                            {deletingId === item.id ? 'Deleting...' : 'Delete'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}