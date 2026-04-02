"use client";

import { useState, FormEvent } from "react";
import { appConfig } from "@/config/appConfig";
import { DynamicField } from "@/components/shared/DynamicField";
import { useArtworkStore } from "@/store/useArtworkStore";
import { useStore } from "@/store/useStore";
import toast from "react-hot-toast";

type Props = {
  initialData?: Record<string, any>;
  onSuccess?: () => void;
};

export const ItemForm = ({ initialData = {}, onSuccess }: Props) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const { addArtwork, updateArtwork } = useArtworkStore();
  const user = useStore((state) => state.user);

  const handleChange = (name: string, value: any) => {
    // If it's a file, mock a URL object for immediate display capability natively
    if (value instanceof File) {
      const fileUrl = URL.createObjectURL(value);
      setFormData((prev: any) => ({
        ...prev,
        [name]: fileUrl,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");

    try {
      // Basic Required Field Validation
      for (const field of appConfig.fields) {
        if (field.type === "boolean") continue; // false is a valid value
        if (!formData[field.name] || formData[field.name] === "") {
          throw new Error(`Please provide a value for ${field.label}.`);
        }
      }

      if (formData.id) {
        await updateArtwork(formData.id, formData);
        toast.success("Artwork updated perfectly.");
      } else {
        // Automatically inject user info as artist
        const payload = {
          ...formData,
          artistId: user?.uid || "anonymous",
          artistName: user?.name || "Anonymous Artist",
        };
        await addArtwork(payload as any);
        toast.success("Artwork listed successfully. Now in portfolio.");
        setFormData({}); // Need to clear form if creating new item
      }
      
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving the item.");
      toast.error(err.message || "Something went wrong while saving the item.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border border-gray-200 dark:border-gray-800 rounded-xl space-y-5 bg-white dark:bg-gray-900 shadow-sm">
      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800 pb-3">
        {formData.id ? "Edit" : "Add"} {appConfig.entity.name}
      </h2>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {appConfig.fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <DynamicField
              field={field}
              value={formData[field.name]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={localLoading || !user}
        className="w-full bg-violet-600 disabled:bg-violet-400 text-white font-bold px-4 py-3 rounded-xl hover:bg-violet-700 transition focus:outline-none focus:ring-4 focus:ring-violet-500/20 shadow-lg shadow-violet-500/30 disabled:cursor-not-allowed"
      >
        {!user ? "Please Log In to List" : localLoading ? "Saving..." : (formData.id ? `Update ${appConfig.entity.name}` : `Create ${appConfig.entity.name}`)}
      </button>
    </form>
  );
};
