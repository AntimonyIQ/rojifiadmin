import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Send, AlertTriangle } from 'lucide-react';
import { ISender } from '@/interface/interface';

interface StageTwoDocumentReviewProps {
    selectedSender: ISender | null;
    viewDocument: (document: any) => void;
}

export default function StageTwoDocumentReview({
    selectedSender,
    viewDocument
}: StageTwoDocumentReviewProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Document Review & Validation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedSender?.documents && selectedSender.documents.length > 0 ? (
                        selectedSender.documents.map((doc: any, index: number) => {
                            const smileStatus = doc.smileIdStatus; // 'verified' | 'rejected' | 'pending'
                            return (
                                <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{doc.name || doc.which || 'Document'}</p>
                                                <p className="text-xs text-muted-foreground break-all max-w-xs">{doc.url}</p>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <Badge variant={doc.kycVerified ? 'default' : 'secondary'} className="text-[10px] px-2 py-0.5">
                                                        {doc.kycVerified ? 'KYC Verified' : 'Pending KYC'}
                                                    </Badge>
                                                    {smileStatus && (
                                                        <Badge
                                                            variant={smileStatus === 'verified' ? 'default' : smileStatus === 'rejected' ? 'destructive' : 'secondary'}
                                                            className="text-[10px] px-2 py-0.5"
                                                        >
                                                            Smile ID: {smileStatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                            <Button variant="outline" size="sm" onClick={() => viewDocument(doc)}>
                                                <Eye className="h-4 w-4 mr-1" /> View
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={smileStatus === 'verified'}
                                                onClick={async () => {
                                                    try {
                                                        console.log('Submitting to Smile ID', { senderId: selectedSender?._id, document: doc });
                                                        alert('Document submitted to Smile ID');
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert('Failed to submit to Smile ID');
                                                    }
                                                }}
                                                className={smileStatus === 'verified' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                                            >
                                                <Send className="h-4 w-4 mr-1" /> {smileStatus === 'verified' ? 'Verified' : 'Submit to Smile ID'}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    console.log('Reporting issue with document', doc);
                                                    alert('Issue reported for this document');
                                                }}
                                                className="text-red-600 border-red-300 hover:bg-red-50"
                                            >
                                                <AlertTriangle className="h-4 w-4 mr-1" /> Report Issue
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-sm">No documents uploaded yet.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
