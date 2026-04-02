'use client';

import React from 'react';
import { EntityField } from '@/types/config';

type Props = {
  field: EntityField | any;
  value: any;
  onChange: (name: string, value: any) => void;
};

/**
 * A highly reusable form field component that renders the correct
 * input type strictly based on the appConfig schema.
 */
export const DynamicField = ({ field, value, onChange }: Props) => {
  const baseClasses = "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-500 transition-colors";

  switch (field.type) {
    case "text":
      return (
        <input
          type="text"
          placeholder={field.label}
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={baseClasses}
        />
      );

    case "number":
      return (
        <input
          type="number"
          placeholder={field.label}
          value={value || ""}
          onChange={(e) => onChange(field.name, Number(e.target.value))}
          className={baseClasses}
        />
      );

    case "textarea":
      return (
        <textarea
          placeholder={field.label}
          value={value || ""}
          rows={4}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={baseClasses}
        />
      );

    case "file":
      return (
        <div className="mt-1 flex items-center">
          <input
            type="file"
            onChange={(e) => onChange(field.name, e.target.files?.[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-800 dark:file:text-gray-200 dark:hover:file:bg-gray-700"
          />
        </div>
      );
      
    case "select":
      return (
        <select
          value={value || ""}
          onChange={(e) => onChange(field.name, e.target.value)}
          className={baseClasses}
        >
          <option value="" disabled>Select {field.label}</option>
          {field.options?.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );

    case "boolean":
      return (
        <button
          type="button"
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange(field.name, !value)}
          className={`relative mt-1 inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            value ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              value ? "translate-x-8" : "translate-x-1"
            }`}
          />
          <span className={`ml-16 text-sm font-semibold whitespace-nowrap ${value ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`}>
            {value ? "Yes — Handmade ✋" : "No — Not Handmade"}
          </span>
        </button>
      );

    default:
      return null;
  }
};
