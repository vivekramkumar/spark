export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          age: number;
          bio: string;
          location: string;
          photos: string[];
          interests: string[];
          level: number;
          xp: number;
          games_won: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          age: number;
          bio?: string;
          location?: string;
          photos?: string[];
          interests?: string[];
          level?: number;
          xp?: number;
          games_won?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          bio?: string;
          location?: string;
          photos?: string[];
          interests?: string[];
          level?: number;
          xp?: number;
          games_won?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}