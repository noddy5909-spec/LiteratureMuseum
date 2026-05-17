export type ThemeComment = {
  id: string;
  author: string;
  text: string;
};

export type ThemeEntry = {
  id: string;
  hallId: string;
  workId: string;
  author: string;
  text: string;
  likedBy: string[];
  comments: ThemeComment[];
};

export function createThemeEntry(
  hallId: string,
  workId: string,
  author: string,
  text: string,
): ThemeEntry {
  return {
    id: `theme-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    hallId,
    workId,
    author,
    text,
    likedBy: [],
    comments: [],
  };
}

export function createThemeComment(author: string, text: string): ThemeComment {
  return {
    id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    author,
    text,
  };
}
