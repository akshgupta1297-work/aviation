export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    code: number;
    message: string;
    data: {
        user: {
            userType: string;
            firstName: string;
            lastName: string;
            email: string;
            adminId: string;
            avatar?: string;
            role: string;
            id: string;
        };
        token: string;
    };
}