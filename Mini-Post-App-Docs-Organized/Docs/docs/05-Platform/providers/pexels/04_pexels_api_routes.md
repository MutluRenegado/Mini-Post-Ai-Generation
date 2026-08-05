# Protected Server API Routes

1. `GET /api/admin/pexels/status`: Safe connection & rate-limit check.
2. `GET /api/admin/pexels/search`: Search photos by query and orientation.
3. `GET /api/admin/pexels/photos/[id]`: Retrieve single photo by ID.
4. `GET /api/admin/pexels/collections`: List featured Pexels collections.
5. `GET /api/admin/pexels/collections/[id]`: Retrieve photos in a collection.
6. `POST /api/admin/pexels/import`: Selectively import selected photos into Image Library.
