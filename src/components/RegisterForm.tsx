"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "", // Added for the Hook Link
    phone_number: "",
    job_title: "",
    bio_description: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) {
          setFormData({
            full_name: data.full_name || "",
            username: data.username || "", // Load existing username
            phone_number: data.phone_number || "",
            job_title: data.job_title || "",
            bio_description: data.bio_description || "",
          });
        }
      }
    }
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication failed");

      let resumeUrl = "";
      if (file) {
        const filePath = `resumes/${user.id}-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
        resumeUrl = data.publicUrl;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        ...(resumeUrl && { resume_url: resumeUrl }),
        status: "approved",
      });

      if (error) {
        if (error.code === '23505') throw new Error("Username is already taken!");
        throw error;
      }
      
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <button onClick={() => router.push('/dashboard')} className="mb-6 text-gray-500 hover:text-blue-600 transition flex items-center gap-2 font-medium">
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Professional Profile</h2>
          <p className="text-gray-500 text-sm">Claim your custom link and update your professional details.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* THE HOOK: CUSTOM USERNAME LINK */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Your Unique Profile Link</label>
            <div className="flex items-center shadow-sm">
              <span className="bg-gray-100 px-4 py-3 rounded-l-xl border border-r-0 border-gray-200 text-gray-500 text-sm font-medium">
                bizconnect.com/u/
              </span>
              <input 
                type="text" 
                placeholder="username"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})} 
                required 
              />
            </div>
            <p className="text-[10px] text-gray-400 pl-1">Lowercase letters and numbers only. This is your public resume URL.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Full Name</label>
              <input type="text" value={formData.full_name} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                onChange={(e) => setFormData({...formData, full_name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Job Title</label>
              <input type="text" value={formData.job_title} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setFormData({...formData, job_title: e.target.value})} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Phone Number</label>
            <input type="text" value={formData.phone_number} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, phone_number: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Bio / Skills</label>
            <textarea value={formData.bio_description} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => setFormData({...formData, bio_description: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Resume (PDF)</label>
            <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 text-center hover:border-blue-200 transition">
              <input type="file" accept=".pdf" className="w-full text-sm text-gray-500"
                onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 transform active:scale-[0.98]">
            {loading ? "Saving Changes..." : "Update Professional Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}