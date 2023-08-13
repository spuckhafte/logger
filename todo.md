## Impletment Redis caching (13/08/23)
- data will be cached according to a socket session
- if a socket disconnects, all the cached data referenced through it will be lost
- i.e, if a person reloads... all the caching will be lost and server will fetch fresh data from og db
- till a socket caching persist => server will fetch data from the cache, and any change made to og db will also reflect in the cache to keep both ofem in sync
- note: when changing routes, cache will persist as the frontend is using non-reloading routes => socket will not reset
