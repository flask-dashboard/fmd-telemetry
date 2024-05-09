export interface Endpoints {
    objectId: string;
    createdAt: { $date: string };
    updatedAt: { $date: string };
    ACL: any;
    name: string;
    fmd_id: string;
    session: number;
  }
  