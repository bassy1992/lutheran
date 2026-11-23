
export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceTime {
  day: string;
  time: string;
  description: string;
}

export interface Ministry {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
}
