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
      matches: {
        Row: {
          id: string;
          user1_id: string;
          user2_id: string;
          status: 'pending' | 'matched' | 'unmatched';
          created_at: string;
          updated_at: string;
          last_message_time: string;
          last_message: string;
          user1_unread_count: number;
          user2_unread_count: number;
          game_streak: number;
        };
        Insert: {
          id?: string;
          user1_id: string;
          user2_id: string;
          status?: 'pending' | 'matched' | 'unmatched';
          created_at?: string;
          updated_at?: string;
          last_message_time?: string;
          last_message?: string;
          user1_unread_count?: number;
          user2_unread_count?: number;
          game_streak?: number;
        };
        Update: {
          id?: string;
          user1_id?: string;
          user2_id?: string;
          status?: 'pending' | 'matched' | 'unmatched';
          created_at?: string;
          updated_at?: string;
          last_message_time?: string;
          last_message?: string;
          user1_unread_count?: number;
          user2_unread_count?: number;
          game_streak?: number;
        };
      };
      messages: {
        Row: {
          id: string;
          match_id: string;
          sender_id: string;
          type: 'text' | 'game-invite';
          content: string;
          game_type?: 'truth-or-dare' | 'never-have-i-ever' | 'would-you-rather' | 'rapid-fire' | 'emoji-story';
          game_state?: any;
          game_status?: 'pending' | 'active' | 'paused' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          sender_id: string;
          type: 'text' | 'game-invite';
          content: string;
          game_type?: 'truth-or-dare' | 'never-have-i-ever' | 'would-you-rather' | 'rapid-fire' | 'emoji-story';
          game_state?: any;
          game_status?: 'pending' | 'active' | 'paused' | 'completed';
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          sender_id?: string;
          type?: 'text' | 'game-invite';
          content?: string;
          game_type?: 'truth-or-dare' | 'never-have-i-ever' | 'would-you-rather' | 'rapid-fire' | 'emoji-story';
          game_state?: any;
          game_status?: 'pending' | 'active' | 'paused' | 'completed';
          created_at?: string;
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