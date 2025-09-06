// Enhanced authentication system with organizer support

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  role: "user" | "organizer" | "admin";
  organizationName?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  isVerified: boolean;
  registeredEvents: string[];
  ownedEvents: string[];
  permissions: string[];
  createdAt: string;
}

export interface AuthUser extends User {
  isOrganizer: boolean;
  canEditEvent: (eventId: string) => boolean;
  canCreateEvent: boolean;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

// Demo users storage with organizer support
const demoUsers: User[] = [
  {
    id: 'demo-user-1',
    username: 'sarah_dev',
    email: 'sarah@example.com',
    fullName: 'Sarah Johnson',
    bio: 'Full-stack developer passionate about AI and sustainability',
    role: 'user',
    isVerified: false,
    registeredEvents: ['maximally-ai-shipathon-2025'],
    ownedEvents: [],
    permissions: ['view_events', 'register_events'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-user-2',
    username: 'alex_builder',
    email: 'alex@example.com',
    fullName: 'Alex Chen',
    bio: 'Mobile app developer and hackathon enthusiast',
    role: 'user',
    isVerified: false,
    registeredEvents: [],
    ownedEvents: [],
    permissions: ['view_events', 'register_events'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-organizer-1',
    username: 'event_master',
    email: 'organizer@techcorp.com',
    fullName: 'Maria Rodriguez',
    bio: 'Event organizer with 5+ years of experience in tech events',
    role: 'organizer',
    organizationName: 'TechCorp Events',
    website: 'https://techcorp.com',
    linkedin: 'maria-rodriguez-events',
    isVerified: true,
    registeredEvents: [],
    ownedEvents: ['maximally-ai-shipathon-2025'],
    permissions: ['view_events', 'create_events', 'edit_events', 'manage_participants', 'manage_judges'],
    createdAt: new Date().toISOString(),
  }
];

class AuthService {
  private storageKey = 'demo-auth-user';

  getCurrentUser(): AuthUser | null {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return null;
    
    const user: User = JSON.parse(stored);
    return this.enhanceUserWithPermissions(user);
  }

  private enhanceUserWithPermissions(user: User): AuthUser {
    return {
      ...user,
      isOrganizer: user.role === 'organizer' || user.role === 'admin',
      canEditEvent: (eventId: string) => {
        return user.role === 'admin' || user.ownedEvents.includes(eventId);
      },
      canCreateEvent: user.role === 'organizer' || user.role === 'admin',
    };
  }

  login(username: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = demoUsers.find(u => u.username === username || u.email === username);
        
        if (user && password === 'demo123') {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
          const authUser = this.enhanceUserWithPermissions(user);
          resolve({ success: true, user: authUser });
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
    role?: "user" | "organizer";
    organizationName?: string;
    website?: string;
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
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
        const role = userData.role || 'user';
        const permissions = role === 'organizer' 
          ? ['view_events', 'create_events', 'edit_events', 'manage_participants', 'manage_judges']
          : ['view_events', 'register_events'];
        
        const newUser: User = {
          id: `user-${Date.now()}`,
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          role,
          organizationName: userData.organizationName,
          website: userData.website,
          isVerified: false,
          registeredEvents: [],
          ownedEvents: [],
          permissions,
          createdAt: new Date().toISOString(),
        };

        demoUsers.push(newUser);
        localStorage.setItem(this.storageKey, JSON.stringify(newUser));
        const authUser = this.enhanceUserWithPermissions(newUser);
        resolve({ success: true, user: authUser });
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  registerForEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const authUser = this.getCurrentUser();
        if (!authUser) {
          resolve({ success: false, error: 'Not logged in' });
          return;
        }

        if (authUser.registeredEvents.includes(eventId)) {
          resolve({ success: false, error: 'Already registered for this event' });
          return;
        }

        authUser.registeredEvents.push(eventId);
        localStorage.setItem(this.storageKey, JSON.stringify(authUser));
        
        // Update the demo users array too
        const userIndex = demoUsers.findIndex(u => u.id === authUser.id);
        if (userIndex !== -1) {
          demoUsers[userIndex] = { ...authUser };
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