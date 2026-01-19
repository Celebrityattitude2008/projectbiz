"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    job_title: "",
    bio_description: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get Current User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please login first");

      let resumeUrl = "";

      // 2. Upload Resume if file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the Public URL
        const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
        resumeUrl = data.publicUrl;
      }

      // 3. Save to Profiles Table
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...formData,
          resume_url: resumeUrl,
          status: "pending",
        });

      if (profileError) throw profileError;

      alert("Application submitted successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold">Step 2: Professional Details</h2>
        
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded"
          onChange={(e) => setFormData({...formData, full_name: e.target.value})}
          required
        />

        <input
          type="text"
          placeholder="Job Title (e.g. Virtual Assistant)"
          className="w-full p-3 border rounded"
          onChange={(e) => setFormData({...formData, job_title: e.target.value})}
          required
        />

        <textarea
          placeholder="Short Bio / Skills"
          className="w-full p-3 border rounded h-32"
          onChange={(e) => setFormData({...formData, bio_description: e.target.value})}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            className="w-full"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}