declare module "@/lib/userSlice" {
    export interface User {
      id: string;
      name: string;
      email: string;
    }
  
    export function addUser(user: User): {
      type: string;
      payload: User;
    };
  
    export function removeUser(): {
      type: string;
    };
  
    export default function reducer(state: User | null, action: any): User | null;
  }
