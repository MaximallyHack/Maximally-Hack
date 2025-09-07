import { Link } from "wouter";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, signOut } = useSupabaseAuth();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      {/* Left side - Logo */}
      <Link href="/" className="text-xl font-bold text-sky-600">
        Maximally Hack
      </Link>

      {/* Middle - Nav Links */}
      <div className="flex items-center space-x-6">
        <Link href="/explore" className="hover:text-sky-600">Explore</Link>
        <Link href="/projects" className="hover:text-sky-600">Projects</Link>
        <Link href="/judges" className="hover:text-sky-600">Judges</Link>
        <Link href="/sponsors" className="hover:text-sky-600">Sponsors</Link>
        <Link href="/help" className="hover:text-sky-600">Help</Link>
      </div>

      {/* Right side - Auth */}
      <div className="flex items-center space-x-4">
        {!user ? (
          <>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-9 h-9 cursor-pointer">
                <AvatarImage
                  src={user.user_metadata?.avatar_url || undefined}
                  alt={user.user_metadata?.full_name || user.email || "User"}
                />
                <AvatarFallback>
                  {user.user_metadata?.full_name
                    ? user.user_metadata.full_name[0].toUpperCase()
                    : user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuItem asChild>
                <Link href={`/profile/${user.user_metadata?.username || user.id}`}>
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await signOut();
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
