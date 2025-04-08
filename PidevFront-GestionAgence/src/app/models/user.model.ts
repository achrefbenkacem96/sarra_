export interface User {
    cin: string;
    email: string;
    name: string;
    password: string;
    // Optionally, the image URL can be defined here once returned by the backend
    image?: string;
    location:string;
    showMenu?: boolean;

  }