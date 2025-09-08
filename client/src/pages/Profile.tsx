import { useAuth } from "@/contexts/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "wouter";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";

type ProfileData = {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  location?: string;
  github?: string;
  linkedin?: string;
  skills: string[];
  interests: string[];
  bio?: string;
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const { handle } = useParams<{ handle: string }>();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileData | null>(null);

  // ✅ Correct: check own profile
  const isOwnProfile = user && profile && user.id === profile.id;

  // ✅ Fetch profile by username (or id if handle is uuid)
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);

      const isUuid = /^[0-9a-fA-F-]{36}$/.test(handle);
      console.log("isuuid", isUuid);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, avatar_url, email, phone, location, github, linkedin, skills, interests, bio"
        )
        .or(isUuid ? `id.eq.${handle}` : `username.eq.${handle}`)
        .maybeSingle();
      console.log("fetched profile data:", data, "error:", error);

      if (error) {
        console.error("Supabase profile fetch error:", error);
        setProfile(null);
        setForm(null);
      } else if (data) {
        setProfile(data);
        setForm(data);
        console.log(data)
      }
      

      setLoading(false);
    }
    if (handle) fetchProfile();
  }, [handle]);

  // ✅ Save profile changes
  async function handleSave() {
    if (!form || !user || !isOwnProfile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        phone: form.phone,
        location: form.location,
        github: form.github,
        linkedin: form.linkedin,
        skills: form.skills,
        interests: form.interests,
        bio: form.bio,
      })
      .eq("id", user.id);

    if (!error) {
      setProfile(form);
      setEditing(false);
    }
  }

  // ✅ Upload new avatar
  async function handleAvatarChange() {
    if (!isOwnProfile) return;
    const file = await selectFile();
    if (file) {
      const url = await uploadAvatar(file);
      if (url) {
        setProfile((prev) => (prev ? { ...prev, avatar_url: url } : prev));
        setForm((prev) => (prev ? { ...prev, avatar_url: url } : prev));
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 flex justify-center">
      <Card className="p-8 w-full max-w-lg text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name} />
          <AvatarFallback>
            {profile.full_name?.[0]?.toUpperCase() ||
              profile.username?.[0]?.toUpperCase() ||
              "U"}
          </AvatarFallback>
        </Avatar>

        {isOwnProfile && (
          <Button onClick={handleAvatarChange} className="mb-4">
            Change Avatar
          </Button>
        )}

        {!editing ? (
          <>
            <h1 className="text-2xl font-bold">
              {profile.full_name || "Unnamed User"}
            </h1>
            <p className="text-muted">@{profile.username}</p>
            {profile.bio && <p className="mt-3">{profile.bio}</p>}

            <div className="mt-4 text-left space-y-2">
              {profile.location && <p>📍 {profile.location}</p>}
              {profile.phone && <p>📱 {profile.phone}</p>}
              {profile.github && (
                <p>
                  🐙 <a href={profile.github}>{profile.github}</a>
                </p>
              )}
              {profile.linkedin && (
                <p>
                  💼 <a href={profile.linkedin}>{profile.linkedin}</a>
                </p>
              )}
              {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                <p>🛠 Skills: {profile.skills.join(", ")}</p>
              )}
              {Array.isArray(profile.interests) && profile.interests.length > 0 && (
                <p>🎯 Interests: {profile.interests.join(", ")}</p>
              )}
            </div>

            {isOwnProfile && (
              <div className="mt-6 space-y-3">
                <Button onClick={() => setEditing(true)} className="w-full">
                  Edit Profile
                </Button>
                <Button
                  onClick={signOut}
                  className="bg-red-500 text-white w-full"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </>
        ) : (
          <>
            <Input
              placeholder="Full Name"
              value={form?.full_name || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, full_name: e.target.value }))
              }
              className="mb-2"
            />
            <Input
              placeholder="Phone"
              value={form?.phone || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, phone: e.target.value }))
              }
              className="mb-2"
            />
            <Input
              placeholder="Location"
              value={form?.location || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, location: e.target.value }))
              }
              className="mb-2"
            />
            <Input
              placeholder="GitHub"
              value={form?.github || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, github: e.target.value }))
              }
              className="mb-2"
            />
            <Input
              placeholder="LinkedIn"
              value={form?.linkedin || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, linkedin: e.target.value }))
              }
              className="mb-2"
            />
            <Input
              placeholder="Skills (comma separated)"
              value={form?.skills?.join(", ") || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f!,
                  skills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              className="mb-2"
            />
            <Input
              placeholder="Interests (comma separated)"
              value={form?.interests?.join(", ") || ""}
              onChange={(e) =>
                setForm((f) => ({
                  ...f!,
                  interests: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                }))
              }
              className="mb-2"
            />
            <Textarea
              placeholder="Bio"
              value={form?.bio || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f!, bio: e.target.value }))
              }
              className="mb-4"
            />

            <div className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditing(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// helper file picker
async function selectFile(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0] || null;
      resolve(file);
    };
    input.click();
  });
}

// Upload avatar to Supabase storage
async function uploadAvatar(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
}
