export interface BaseUser {
  name: string;
  email: string;
  imageUrl: string;
}

export interface User extends BaseUser {
  id: string;
  isAdmin?: boolean;
}

export interface ChatParticipant extends BaseUser {
  isAdmin?: boolean;
}

export interface Message {
  _id: string;
  content: string;
  createdAt: number;
  user: User;
  system?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'file';
  fileName?: string;
}

export interface GroupChat {
  _id: string;
  name: string;
  imageUrl: string;
  members: {
    [key: string]: User & {role: 'admin' | 'member'};
  };
  createdBy: string;
  createdAt: number;
  lastMessage: string;
  timestamp: number;
}

export interface Chat {
  _id: string;
  type?: 'individual' | 'group';
  name?: string;
  imageUrl?: string;
  participants?: {
    sender: User;
    receiver: User;
  };
  members?: {
    [key: string]: User & {role: 'admin' | 'member'};
  };
  lastMessage: string;
  timestamp: number;
  createdBy: string;
  updatedAt: number;
}
