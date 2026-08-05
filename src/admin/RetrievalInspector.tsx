'use client';

import React, { useState } from 'react';
import type { VisualResolverOutput } from '../intelligence/resolution/resolution.types';

export function RetrievalInspector() {
  const [subject, setSubject] = useState('Letter of Credit');
  const [industry, setIndustry] = useState('Finance');
  const [scene, setScene] = useState('Professional financial meeting');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VisualResolverOutput | null>(null);

  const handleRunRetrieval = async () => {
    setLoading(true);
    try {
      // In web app, invokes VisualReferenceResolver API endpoint or client instance
      const dummyResult: VisualResolverOutput = {
        queryId: `inspector_q_${Date.now()}`,
        retrievalStatus: 'MATCH_FOUND',
        mode: 'REFERENCE_ENRICHMENT',
        references: [
          {
            id: 'ref_lc_trade',
            title: 'International Trade Finance Executive Boardroom',
            sourceType: 'Imported Folder',
            sourceProvider: 'Studio',
            sourceAvailability: 'AVAILABLE',
            originalFileName: 'trade_finance.jpg',
            storagePath: 'originals/trade_finance.jpg',
            thumbnailPath: 'data:image/jpeg;base64,placeholder',
            mimeType: 'image/jpeg',
            fileSizeBytes: 120000,
            checksum: 'sha256_mock',
            perceptualHash: 'phash_mock',
            width: 1920,
            height: 1080,
            aspectRatio: '16:9',
            orientation: 'landscape',
            topic: 'Letter of Credit',
            industry: 'Finance',
            scene: 'Financial Meeting',
            rights: {
              rightsConfirmed: true,
              sourceProvider: 'Studio',
              licenceType: 'Commercial',
              attributionRequired: false,
              commercialUseReviewStatus: 'APPROVED',
            },
            review: { status: 'APPROVED' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            version: 1,
            usageCount: 1,
            retrievalCount: 2,
          },
        ],
        rankingVersion: '2.0.0-metadata-transparent',
        auditId: 'audit_inspector_01',
        explanation: 'Ranked candidate "International Trade Finance Executive Boardroom" with Final Score: 85/100.',
      };
      setResult(dummyResult);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#18181b', color: '#f4f4f5', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#38bdf8' }}>
        🔍 Visual Intelligence Platform — Retrieval Inspector (Phase 2B)
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Subject / Topic</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: '#fff' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Industry</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: '#fff' }}
          />
        </div>
        <div>
          <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>Scene</label>
          <input
            type="text"
            value={scene}
            onChange={(e) => setScene(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: '#fff' }}
          />
        </div>
      </div>

      <button
        onClick={handleRunRetrieval}
        disabled={loading}
        style={{ padding: '10px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        {loading ? 'Executing Retrieval...' : 'Run Transparent Retrieval'}
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#27272a', borderRadius: '6px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#a1a1aa' }}>Retrieval Result: {result.retrievalStatus}</h3>
          <p style={{ fontSize: '13px', color: '#e4e4e7', margin: '8px 0' }}>{result.explanation}</p>
          <div style={{ fontSize: '12px', color: '#71717a' }}>Audit ID: {result.auditId} | Version: {result.rankingVersion}</div>
        </div>
      )}
    </div>
  );
}
