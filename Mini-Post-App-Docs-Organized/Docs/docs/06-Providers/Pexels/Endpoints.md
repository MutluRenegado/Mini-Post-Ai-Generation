# Pexels Endpoints — Mini Post App

Status: **Verified Backend API Routes**  
Runtime Source Location: [src/app/api/admin/pexels/](file:///d:/Library/workspace/KKK/MINIPOSTAPP/mini-post-app-master/src/app/api/admin/pexels/)

---

## Protected Server API Routes

1. `GET /api/admin/pexels/status`: Safe connection & rate-limit status check.
2. `GET /api/admin/pexels/search`: Search photos by query and orientation filters.
3. `GET /api/admin/pexels/photos/[id]`: Retrieve single photo by asset ID.
4. `GET /api/admin/pexels/collections`: List featured Pexels collections.
5. `GET /api/admin/pexels/collections/[id]`: Retrieve photos in a specified collection.
6. `POST /api/admin/pexels/import`: Selectively import selected photos into Image Library (max 20 per request).
