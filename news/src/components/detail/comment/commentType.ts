export interface CommentType {
    id : number;
    userId: number;
    role: number;
    userName: string;
    status: number;
    content : string;
    createdAt: string;
    parentId: number | null;
}