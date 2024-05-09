export interface FollowUp {
    objectId: string;
    reasons: (string | OtherReason)[];
    createdAt: { $date: string };
    updatedAt: { $date: string };
}

export interface OtherReason {
    other: string; 
}
