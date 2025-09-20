import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface GuestRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
  created_at: string;
}

interface GuestRequestsManagerProps {
  guestRequests: GuestRequest[];
}

const GuestRequestsManager: React.FC<GuestRequestsManagerProps> = ({ guestRequests }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold">Guest Requests</h2>
      <div className="flex-1 overflow-y-auto py-4">
        {guestRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex items-center justify-center h-full">
            <div>
              <Users className="mx-auto h-12 w-12" />
              <p className="mt-2">No guest requests found</p>
              <p className="text-sm">Guest requests will appear here when users submit them</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {guestRequests.map((request) => (
              <Card key={request.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-lg">{request.first_name} {request.last_name}</h3>
                          <span className="text-sm text-muted-foreground">({request.email})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {request.reason}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-muted-foreground">{request.message}</p>
                        {request.phone && (
                          <p className="text-sm">Phone: {request.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestRequestsManager;