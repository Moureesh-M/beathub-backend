Q: Why did you reference Songs in the Playlist instead of embedding them?
A: Referencing Songs in the Playlist ensures that any updates to a Song (such as a title or artist change) are immediately reflected in all playlists containing that song. If Songs were embedded, every playlist would store its own copy, so updating a song’s details would require updating every playlist that contains it—leading to data inconsistency and more complex updates.

Q: Why did you reference the Artist in the Song model?
A: Referencing the Artist directly in the Song model allows for efficient queries like “Find all songs by Daft Punk” without first retrieving all albums by that artist. This direct reference improves query performance and simplifies data access patterns.