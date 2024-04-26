export interface FollowUp {
    _id: string;
    fmd_id: string;
    session: number;
    feedback: FeedbackItem[];
    _created_at: { $date: string };
    _updated_at: { $date: string };
}

export interface FeedbackItem {
    key: string;
    other_reason?: string;
}
