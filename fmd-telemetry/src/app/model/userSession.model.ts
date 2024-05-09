export interface UserSession {
    objectId: string;
    createdAt: { $date: string };
    updatedAt: { $date: string };
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
  