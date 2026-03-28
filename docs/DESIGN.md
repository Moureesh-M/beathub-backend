## Design Choices

### Why reference Songs in the Playlist instead of embedding them?

Songs are referenced from playlists because songs are reusable entities that can appear in many different playlists. A referenced design keeps each song stored in one place, so updates to song metadata such as title, duration, artist, or album can be reflected everywhere without duplicating data.

If songs were embedded directly inside each playlist, the same song could be copied into many playlist documents. That would make updates harder, increase document size, and create a higher risk of stale or inconsistent data when song details change over time.

Referencing is also a better fit for growth. Playlists can become large, and embedding full song objects would make playlist documents heavier to read and write. Using references keeps playlists focused on ordering and membership, while the song collection remains the source of truth for song data.

### Why reference the Artist in the Song model?

Referencing the artist directly from the song makes common queries easier and faster to express. For example, it supports use cases like "find all songs by a given artist" without needing to go through albums first.

This choice also keeps the model flexible. A song may need direct artist-level access for filtering, search, population, analytics, or recommendation features. By storing the artist reference on the song itself, the schema supports those operations more naturally.

Embedding artist data inside songs would duplicate artist information across many song documents. That duplication would make artist updates more expensive and increase the chance of inconsistent data if an artist name or profile data changed.

### References vs. embedding in this project

The general rule in this schema is to use references for data that is shared, updated independently, or queried across collections, and to use embedding only for small pieces of data that belong exclusively to a parent document and are unlikely to be reused elsewhere.

In BeatHub, songs and artists are core entities with their own lifecycle, so referencing them improves consistency, scalability, and query flexibility.
