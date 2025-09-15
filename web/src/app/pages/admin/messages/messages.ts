export interface Message {
  id: number;
  userId: number;
  receiverId: number;
  content: string;
  date: string;
  senderName: string | null;
  receiverName: string | null;
}