export interface Resume {
  id: string;
  userId: string;
  title: string;
  content: unknown; // JSON structure placeholder for future builder schema
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
