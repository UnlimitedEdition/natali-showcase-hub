import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Users, Mail, Phone, Calendar, User, MessageSquare, Trash2, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GuestRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  reason: string;
  message: string;
  created_at: string;
  language_code: string;
  updated_at: string;
}

const GuestRequestsManager: React.FC = () => {
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<GuestRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const fetchGuestRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guest_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGuestRequests(data || []);
    } catch (error) {
      console.error('Error fetching guest requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch guest requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGuestRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('guest_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Guest request deleted successfully"
      });
      
      fetchGuestRequests();
    } catch (error) {
      console.error('Error deleting guest request:', error);
      toast({
        title: "Error",
        description: "Failed to delete guest request",
        variant: "destructive"
      });
    }
  };

  const handleViewRequest = (request: GuestRequest) => {
    setSelectedRequest(request);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    fetchGuestRequests();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header with statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{guestRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {guestRequests.filter(r => {
                    const requestDate = new Date(r.created_at);
                    const now = new Date();
                    return requestDate.getMonth() === now.getMonth() && 
                           requestDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-primary mr-3" />
              <div>
                <p className="text-sm text-muted-foreground">Recent (7 days)</p>
                <p className="text-2xl font-bold">
                  {guestRequests.filter(r => {
                    const requestDate = new Date(r.created_at);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return requestDate >= sevenDaysAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Guest Requests Table */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Guest Requests</span>
            <Button variant="outline" size="sm" onClick={fetchGuestRequests} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {guestRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground flex items-center justify-center flex-1">
              <div>
                <Users className="mx-auto h-12 w-12" />
                <p className="mt-2">No guest requests found</p>
                <p className="text-sm">Guest requests will appear here when users submit them</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guestRequests.map((request) => (
                    <TableRow 
                      key={request.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleViewRequest(request)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{request.first_name} {request.last_name}</p>
                            <p className="text-sm text-muted-foreground">{request.language_code.toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            <span>{request.email}</span>
                          </div>
                          {request.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{request.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.reason}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate" title={request.message}>
                          {request.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(request.created_at).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGuestRequest(request.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* View Request Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Guest Request Details</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{selectedRequest.first_name} {selectedRequest.last_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{selectedRequest.email}</p>
                      </div>
                      {selectedRequest.phone && (
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{selectedRequest.phone}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground">Language</p>
                        <Badge variant="outline">{selectedRequest.language_code.toUpperCase()}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Request Information</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <Badge>{selectedRequest.reason}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Updated</p>
                        <p>{new Date(selectedRequest.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Message</h3>
                  <div className="border rounded-md p-4 bg-muted">
                    <p className="whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestRequestsManager;