export interface Endpoints {
    _id: string;
    _created_at: { $date: string };
    _updated_at: { $date: string };
    ACL: any;
    name: string;
    fmd_id: string;
    session: number;
  }
  