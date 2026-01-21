"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function ProjectUpload({ userId, onUploadSuccess }: { userId: string, onUploadSuccess: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !title) return alert("Please enter a title first!");

    setUploading(true);
    try {
      const filePath = `projects/${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
      
      const { error: dbError } = await supabase.from("projects").insert({
        user_id: userId,
        title: title,
        image_url: data.publicUrl
      });

      if (dbError) throw dbError;
      setTitle("");
      onUploadSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-200">
      <input 
        type="text" 
        placeholder="Project Name (e.g. E-commerce Dashboard)" 
        className="w-full mb-3 p-2 text-sm rounded-lg border border-gray-200 outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label className="block w-full py-2 bg-blue-600 text-white text-center rounded-xl font-bold text-xs cursor-pointer hover:bg-blue-700 transition">
        {uploading ? "Uploading Proof..." : "📸 Upload Proof of Work"}
        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
      </label>
    </div>
  );
}