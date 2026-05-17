export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          grade: string;
          class_num: string;
          student_number: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          grade: string;
          class_num: string;
          student_number: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          grade?: string;
          class_num?: string;
          student_number?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      theme_entries: {
        Row: {
          id: string;
          student_id: string;
          hall_id: string;
          work_id: string;
          author_display: string;
          body: string;
          liked_by: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          hall_id: string;
          work_id: string;
          author_display: string;
          body: string;
          liked_by?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          hall_id?: string;
          work_id?: string;
          author_display?: string;
          body?: string;
          liked_by?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
      theme_comments: {
        Row: {
          id: string;
          theme_id: string;
          student_id: string | null;
          author_display: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          theme_id: string;
          student_id?: string | null;
          author_display: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          theme_id?: string;
          student_id?: string | null;
          author_display?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
