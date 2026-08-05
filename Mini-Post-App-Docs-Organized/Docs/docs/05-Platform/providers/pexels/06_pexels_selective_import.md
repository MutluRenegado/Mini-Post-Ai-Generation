# Pexels Selective Import

- Selective manual import only. Default maximum 20 photos per request, hard cap 50.
- Local Mode: Writes imported files to `D:\Library\Images Library\01_Incoming`.
- Cloud Mode: Uploads image to Firebase Storage & saves `VisualReference` record.
- Imported initial state: `reviewStatus = 'PENDING'`, `rightsConfirmed = false`, `commercialUseReviewStatus = 'PENDING'`.
