export interface IUser {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    updated_at?: string;
    tasks?: any[];
}

interface DataType {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface UsersResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: DataType[];
}
