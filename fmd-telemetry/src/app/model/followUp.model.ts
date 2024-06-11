export interface FollowUp {
    objectId: string;
    reasons?: (string | OtherReason)[];
    feedback?: any[];
    createdAt: { $date: string };
    updatedAt: { $date: string };
}

export interface OtherReason {
    other: string; 
}
