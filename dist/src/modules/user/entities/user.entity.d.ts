export declare enum Role {
    Viewer = "Viewer",
    Editor = "Editor",
    Owner = "Owner"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    email: string;
    password: string;
}
