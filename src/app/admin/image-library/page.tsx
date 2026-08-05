import React from 'react';
import { ImageLibraryPage } from '@/modules/image-library';

export const metadata = {
  title: 'Image Library — Admin Studio',
  description: 'Visual Reference Photo & Visual Intelligence Repository Manager',
};

export default function AdminImageLibraryPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col">
      <ImageLibraryPage />
    </div>
  );
}
