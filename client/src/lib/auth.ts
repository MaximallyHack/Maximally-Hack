// Demo authentication system - all simulated, no real backend

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  registeredEvents: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// Demo users storage (simulates a database)
const demoUsers: User[] = [
  {
    id: 'demo-user-1',
    username: 'sarah_dev',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    bio: 'Full-stack developer passionate about AI and sustainability',
    registeredEvents: ['maximally-ai-shipathon-2025'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-user-2',
    username: 'alex_builder',
    email: 'alex@example.com',
    fullName: 'Alex Chen',
    bio: 'Mobile app developer and hackathon enthusiast',
    registeredEvents: [],
    createdAt: new Date().toISOString(),
  }
];

class AuthService {
  private storageKey = 'demo-auth-user';

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = demoUsers.find(u => u.username === username || u.email === username);
        
        if (user && password === 'demo123') {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
          resolve({ success: true, user });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000); // Simulate network delay
    });
  }

  register(userData: {
    username: string;
    email: string;
    fullName: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = demoUsers.find(u => 
          u.username === userData.username || u.email === userData.email
        );

        if (existingUser) {
          resolve({ success: false, error: 'Username or email already exists' });
          return;
        }

        // Create new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          registeredEvents: [],
          createdAt: new Date().toISOString(),
        };

        demoUsers.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(newUser));
        resolve({ success: true, user: newUser });
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  registerForEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.getCurrentUser();
        if (!user) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        if (user.registeredEvents.includes(eventId)) {
          resolve({ success: false, error: 'Already registered for this event' });
          return;
        }

        user.registeredEvents.push(eventId);
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        
        // Update the demo users array too
        const userIndex = demoUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          demoUsers[userIndex] = user;
        }

        resolve({ success: true });
      }, 500);
    });
  }

  unregisterFromEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.getCurrentUser();
        if (!user) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        user.registeredEvents = user.registeredEvents.filter(id => id !== eventId);
        localStorage.setItem(this.storageKey, JSON.stringify(user));
        
        // Update the demo users array too
        const userIndex = demoUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          demoUsers[userIndex] = user;
        }

        resolve({ success: true });
      }, 500);
    });
  }

  updateProfile(updates: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = this.getCurrentUser();
        if (!user) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        const updatedUser = { ...user, ...updates };
        localStorage.setItem(this.storageKey, JSON.stringify(updatedUser));
        
        // Update the demo users array too
        const userIndex = demoUsers.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          demoUsers[userIndex] = updatedUser;
        }

        resolve({ success: true, user: updatedUser });
      }, 500);
    });
  }
}

export const authService = new AuthService();

// Demo credentials for easy testing
export const demoCredentials = [
  { username: 'sarah_dev', password: 'demo123', name: 'Sarah Johnson' },
  { username: 'alex_builder', password: 'demo123', name: 'Alex Chen' },
  { username: 'demo@example.com', password: 'demo123', name: 'Demo User' }
];