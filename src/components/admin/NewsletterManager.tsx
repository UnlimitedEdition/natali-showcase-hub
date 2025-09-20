import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, Users, Mail, Calendar, BarChart3 } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  is_confirmed: boolean;
  language_code: string;
  status: string;
  subscribed_at: string;
  unsub_token: string;
}

interface Newsletter {
  id: string;
  email: string;
  created_at: string;
  is_confirmed: boolean;
  language_code: string;
  status: string;
  subscribed_at: string;
  unsub_token: string;
}

const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSubscribers();
    fetchNewsletters();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    try {
      // Користимо исту табелу за садржај newsletter-а јер немамо посебну табелу
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error) {
      console.error('Error fetching newsletters:', error);
      toast({
        title: "Error",
        description: "Failed to fetch newsletters",
        variant: "destructive"
      });
    }
  };

  const handleCreateNewsletter = async () => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and content",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      // Претпостављам да постоји посебна табела за newsletter-е
      // Али ако не постоји, онда ћемо користити постојећу структуру
      toast({
        title: "Info",
        description: "Newsletter functionality would be implemented here. In a full implementation, this would save to a newsletters table.",
      });
      
      setSubject('');
      setContent('');
      fetchNewsletters();
    } catch (error) {
      console.error('Error creating newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to save newsletter draft",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    toast({
      title: "Info",
      description: "Test email functionality would be implemented here"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
                <p className="text-2xl font-bold">{subscribers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">{subscribers.filter(s => s.is_confirmed).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Newsletters Sent</p>
                <p className="text-2xl font-bold">{newsletters.filter(n => n.status === 'sent').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Newsletter */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Create Newsletter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter newsletter subject"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter newsletter content"
              rows={8}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleCreateNewsletter} disabled={loading}>
              {loading ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button variant="secondary" onClick={handleSendTest} disabled={sending}>
              {sending ? 'Sending...' : 'Send Test'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscribers List */}
      <Card className="mt-6 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {subscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center flex-1">
              <div>
                <Users className="mx-auto h-12 w-12" />
                <p className="mt-2">No subscribers found</p>
                <p className="text-sm">In a full implementation, newsletters would be saved to a separate table and displayed here.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.language_code.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        {subscriber.is_confirmed ? (
                          <Badge variant="default">Confirmed</Badge>
                      ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Newsletters History */}
      <Card className="mt-6 flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Newsletters History</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {newsletters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center flex-1">
              <div>
                <Mail className="mx-auto h-12 w-12" />
                <p className="mt-2">No newsletters found</p>
                <p className="text-sm">In a full implementation, newsletters would be saved to a separate table and displayed here.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletters.map((newsletter) => (
                    <TableRow key={newsletter.id}>
                      <TableCell className="font-medium">{newsletter.email}</TableCell>
                      <TableCell>{getStatusBadge(newsletter.status)}</TableCell>
                      <TableCell>
                        {new Date(newsletter.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManager;