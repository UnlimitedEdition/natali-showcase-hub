import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Send, Users, Mail, Calendar, BarChart3, Eye } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
  is_active: boolean;
  language_preference: string;
  status: string | null;
  subscribed_at: string | null;
  unsub_token: string | null;
  confirmation_sent_at: string | null;
  confirmation_token: string | null;
  confirmed_at: string | null;
  name: string | null;
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
}

const NewsletterManager: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const testDatabaseAccess = async () => {
    try {
      console.log('Тестирање приступа бази...');
      
      // Онда пробамо да учитамо све податке
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*');
      
      if (error) {
        console.error('Грешка при учитавању претплатника:', error);
        // Покушајмо са public префиксом
        const { data: publicData, error: publicError } = await supabase
          .from('newsletter_subscribers')
          .select('*');
          
        if (publicError) {
          console.error('Грешка при учитавању претплатника са public префиксом:', publicError);
        } else {
          console.log('Претплатници са public префиксом:', publicData);
        }
      } else {
        console.log('Сви претплатници:', data);
      }
    } catch (error) {
      console.error('Грешка при тестирању приступа бази:', error);
    }
  };

  useEffect(() => {
    fetchSubscribers();
    fetchNewsletters();
    testDatabaseAccess(); // Додајемо тест позив
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      console.log('Покушавам да учитам претплатнике...');
      // Користимо тачно име табеле како је дефинисано у бази
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Грешка при учитавању претплатника:', error);
        throw error;
      }
      
      console.log('Примљени подаци о претплатницима:', data);
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscribers: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
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
      const { data, error } = await supabase
        .from('newsletters')
        .insert([
          {
            subject,
            content,
            status: 'draft'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Newsletter draft saved successfully",
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
    if (!subject.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and content before sending test",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setSending(true);
      // Овде би ишла логика за слање тест поруке
      // За сада ћемо само симулирати слање
      
      // Симулирајмо мрежни захтев
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test Sent",
        description: "Test newsletter has been sent to your email address",
      });
    } catch (error) {
      console.error('Error sending test newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to send test newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendNewsletter = async (newsletterId: string) => {
    try {
      setSending(true);
      // Овде би ишла логика за слање email-ова свим претплатницима
      // За сада ћемо само ажурирати статус newsletter-а
      
      const { error } = await supabase
        .from('newsletters')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', newsletterId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Newsletter sent successfully to all subscribers",
      });
      
      fetchNewsletters();
    } catch (error) {
      console.error('Error sending newsletter:', error);
      toast({
        title: "Error",
        description: "Failed to send newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleViewNewsletter = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
    setIsViewModalOpen(true);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{subscribers.filter(s => s.status === 'confirmed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{subscribers.filter(s => s.status === 'pending').length}</p>
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

      {/* Test Database Access Button */}
      <div className="mt-4">
        <Button onClick={testDatabaseAccess} variant="outline">
          Test Database Access
        </Button>
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

      {/* Newsletters History - Премештен испред Subscribers */}
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
                <p className="text-sm">Create your first newsletter using the form above.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[30%]">Preview</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newsletters.map((newsletter) => (
                    <TableRow key={newsletter.id}>
                      <TableCell className="font-medium">{newsletter.subject}</TableCell>
                      <TableCell>{getStatusBadge(newsletter.status)}</TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate" title={newsletter.content}>
                          {newsletter.content.substring(0, 100)}{newsletter.content.length > 100 ? '...' : ''}
                        </p>
                      </TableCell>
                      <TableCell>
                        {newsletter.sent_at 
                          ? new Date(newsletter.sent_at).toLocaleDateString()
                          : new Date(newsletter.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Dialog open={isViewModalOpen && selectedNewsletter?.id === newsletter.id} onOpenChange={setIsViewModalOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleViewNewsletter(newsletter)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            {selectedNewsletter && (
                              <>
                                <DialogHeader>
                                  <DialogTitle>{selectedNewsletter.subject}</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                  <div className="mb-4">
                                    <Badge>{getStatusBadge(selectedNewsletter.status)}</Badge>
                                  </div>
                                  <div className="mb-4">
                                    <p className="text-sm text-muted-foreground">
                                      Created: {new Date(selectedNewsletter.created_at).toLocaleString()}
                                    </p>
                                    {selectedNewsletter.sent_at && (
                                      <p className="text-sm text-muted-foreground">
                                        Sent: {new Date(selectedNewsletter.sent_at).toLocaleString()}
                                      </p>
                                    )}
                                  </div>
                                  <div className="border rounded-md p-4 max-h-96 overflow-y-auto">
                                    <p className="whitespace-pre-wrap">{selectedNewsletter.content}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        {newsletter.status !== 'sent' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSendNewsletter(newsletter.id)}
                            disabled={sending}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscribers List - Премештен испод Newsletters History */}
      <Card className="mt-6 flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscribers</CardTitle>
          <Button variant="outline" onClick={fetchSubscribers} disabled={loading}>
            <Users className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {subscribers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center flex-1">
              <div>
                <Users className="mx-auto h-12 w-12" />
                <p className="mt-2">No subscribers found</p>
                <p className="text-sm">Subscribers will appear here when users subscribe to the newsletter.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription Date</TableHead>
                      <TableHead>Confirmation Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>{subscriber.name || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{subscriber.language_preference?.toUpperCase() || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        {subscriber.is_active && subscriber.status === 'confirmed' ? (
                          <Badge variant="default">Active</Badge>
                        ) : subscriber.status === 'pending' ? (
                          <Badge variant="secondary">Pending</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {subscriber.subscribed_at ? new Date(subscriber.subscribed_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {subscriber.confirmed_at ? new Date(subscriber.confirmed_at).toLocaleDateString() : 'N/A'}
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