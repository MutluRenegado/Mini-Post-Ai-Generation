# VisualReferenceResolver & Resolver Modes

Supported Modes:
1. `REFERENCE_ENRICHMENT` (Default): Returns safe metadata enrichment to improve external prompts. NEVER substitutes a library photo as a generated image.
2. `USER_SELECTION`: Returns ranked references for user review.
3. `EXISTING_ASSET_SELECTION`: Returns an approved existing photograph ONLY when explicitly requested and threshold is met.

Statuses: `MATCH_FOUND`, `PARTIAL_MATCH`, `NO_REFERENCE_MATCH`, `FILTERED_BY_RIGHTS`, `FILTERED_BY_AVAILABILITY`, `INVALID_QUERY`, `RETRIEVAL_ERROR`.
