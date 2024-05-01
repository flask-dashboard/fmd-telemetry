export interface UserSession {
    _id: string;
    _created_at: { $date: string };
    _updated_at: { $date: string };
    ACL: any;
    fmd_id: string;
    session: number;
    endpoints: number;
    blueprints: number;
    monitoring_0: number;
    monitoring_1: number;
    monitoring_2: number;
    monitoring_3: number;
    dashboard_version: string;
    python_version: string;    
    time_initialized: string;
  }
  