'use client';

import React, { useState, useEffect } from 'react';

export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'vector' | 'logo';
  url: string;
  size: string;
}

export default function AssetLibrary() {
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Brand-Hero-Banner.png', type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', size: '2.4 MB' },
    { id: '2', name: 'Product-Demo-Reel.mp4', type: 'video', url: '#', size: '14.1 MB' },
    { id: '3', name: 'Company-Logo-White.svg', type: 'vector', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500', size: '120 KB' },
  ]);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUploadSim = () => {
    setUploading(true);
    setTimeout(() => {
      const newAsset: Asset = {
        id: Date.now().toString(),
        name: `Generated-Asset-${assets.length + 1}.png`,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=500',
        size: '1.8 MB',
      };
      setAssets([newAsset, ...assets]);
      setUploading(false);
    }, 1200);
  };

  if (!mounted) {
    return <div className="p-6 max-w-5xl mx-auto text-slate-400 font-mono text-sm">Loading Asset Library...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto text-slate-100 font-sans space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
            📂 Asset Library Hub
          </h2>
          <p className="text-sm text-slate-400">
            Centralized media storage for high-res images, videos, and generated assets.
          </p>
        </div>
        <button
          type="button"
          onClick={handleUploadSim}
          disabled={uploading}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl text-sm shadow-lg shadow-cyan-500/20 hover:opacity-90 transition cursor-pointer disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '+ Upload New Asset'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between backdrop-blur-md">
            <div className="h-32 bg-slate-950 rounded-xl mb-3 flex items-center justify-center border border-slate-800/80 overflow-hidden relative group">
              {asset.type === 'image' || asset.type === 'vector' || asset.type === 'logo' ? (
                <img src={asset.url} alt={asset.name} className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition duration-300" />
              ) : (
                <span className="text-3xl">🎥</span>
              )}
              <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-slate-900/80 text-cyan-400 border border-slate-800 rounded-md uppercase font-semibold">
                {asset.type}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white truncate">{asset.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{asset.size}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
