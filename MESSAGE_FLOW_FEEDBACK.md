### Message Flow Review & Improvement Suggestions

#### 1. High-level Flow
- **Room discovery**: `useGetRooms` (`/user/get-rooms`) feeds `ChatListPage`, which displays conversations and navigates to `/chat/:roomId` with routing state (roomId, otherUserId, avatars, etc.).
- **Room resolution**: `useGetRoomId` (`/user/get-room-id`) is used from profile to create or retrieve a room before navigating to the chat screen.
- **Joining a chat**: `useJoinChat` emits `joinChat` with the current user id when `MessagePage` mounts.
- **Message sending**: `useSendMessage` emits `sendMessage` over a socket with an ack callback + 5s timeout; `MessagePage` adds an optimistic message to local state, then removes it on failure.
- **Message receiving**:
  - `useFetchMessages(roomId)` requests history via `fetchMessages` and listens for `recentMessages` + `receiveMessage` events, with a 5s polling interval.
  - `useReceiveMessages(roomId)` also listens to `receiveMessage` and appends to its own `messages` array.
  - `MessagePage` merges arrays: `messages = [...fetchedMessages, ...optimisticMessages, ...receivedMessages]`.

#### 2. Main Issues / Risks
- **Double subscription to `receiveMessage`**:
  - Both `useFetchMessages` and `useReceiveMessages` attach `socket.on('receiveMessage', ...)`, which can cause duplication or inconsistent state.
  - `MessagePage` then merges `fetchedMessages` and `receivedMessages`, effectively having two sources for the same real-time messages.

- **Polling and push mixed together**:
  - `useFetchMessages` requests history initially (`socket.emit('fetchMessages', roomId)`) but then also **polls every 5s** using another `fetchMessages` emit.
  - Because you already have `receiveMessage` for real-time updates, this interval can re-send the same history and complicate ordering / duplication.

- **Message ordering and identity**:
  - `messages = [...fetchedMessages, ...optimisticMessages, ...receivedMessages]` creates a simple concatenation with no sort or deduplication.
  - If the same message appears in history and via `receiveMessage`, you can display duplicates.
  - Optimistic messages are removed by object identity (`msg !== newMessage`), which is fragile if the array is reshaped elsewhere.

- **Socket lifecycle and error handling**:
  - `useSendMessage` reads `socket.connected` once; if the connection drops and reconnects, `isConnected` may become stale for the hook instance.
  - `useJoinChat` only sends `joinChat` on mount; after reconnection, the server may no longer consider the user joined to the room.

- **Coupling between transport and UI**:
  - `useFetchMessages` mixes socket wiring, polling, and view-specific concerns (e.g. logging, console noise). It’s harder to test and reuse.
  - Message normalization (ensuring each message has a consistent shape: `id`, `room_id`, `sender_id`, `content`, `created_at`) is scattered across components instead of centralized in the hook.

#### 3. Suggested Improvements

**A. Consolidate message sources per room**
- Replace the `useFetchMessages` + `useReceiveMessages` split with a single hook, e.g. `useRoomMessages(roomId)`:
  - On mount:
    - Emit `fetchMessages` once to load history.
    - Listen to `recentMessages` and initialize `messages` state.
    - Listen to `receiveMessage` and append new messages for that room.
  - On unmount:
    - Remove both listeners.
  - Return `{ messages, loading }`.
- Remove the interval-based polling; rely on `receiveMessage` for live updates and `fetchMessages` only for initial history or explicit refresh.

**B. Normalize and dedupe messages**
- Inside the consolidated hook, ensure:
  - Each message has a stable `id` (fall back to `timestamp + sender_id` if needed).
  - New messages are merged with `messages` using a dedupe strategy (e.g. key by `id`).
  - Messages are always sorted by `created_at` ascending before returning to the UI.
- In `MessagePage`, keep the data shape simple:
  - Let the hook return `messages` that already include history + live updates.
  - Keep `optimisticMessages` but reconcile them when the acked message comes back:
    - Add a client-generated temporary id (e.g. `tempId`) to optimistic messages and strip them when the server version (real id) is received.

**C. Join/leave semantics and reconnection**
- Extract a `useChatPresence(roomId, userId)` hook:
  - On mount / when `roomId` changes: emit `joinRoom` (if your backend supports rooms) or `joinChat` with `(userId, roomId)`.
  - On unmount: emit `leaveRoom` or similar if the backend tracks presence.
  - Listen for `connect` and `reconnect` on the socket and re-emit join messages so the server restores subscriptions after network glitches.
- This keeps `MessagePage` free of low-level socket concerns.

**D. Improve `useSendMessage` ergonomics**
- Accept a full message payload and optionally return the created message:
  ```js
  const sendMessage = async ({ content, roomId, receiverId }) => {
    // validate
    // send over socket with ack
    // return { id, room_id, sender_id, content, created_at, ... }
  };
  ```
- Inside `MessagePage`:
  - Add an optimistic message with a `tempId`.
  - When `sendMessage` resolves, replace the optimistic message with the authoritative one from the server (match on `tempId`).
  - On error, mark the message as failed in UI (e.g. small warning icon) instead of fully removing it, or offer a retry.

**E. Reduce duplication in room fetching**
- `useGetRooms` currently just fetches `/user/get-rooms` once and exposes `refreshRooms`.
  - Consider:
    - Normalizing room data (ensure each room has `room_id`, `recipient_id`, `recipient_profile_username`, `recipient_profile_image`, `last_message`, `last_message_timestamp`).
    - Sorting rooms by `last_message_timestamp` descending in the hook so `ChatListPage` is just mapping and styling.
    - Optionally wiring `receiveMessage` into rooms list to update `last_message` and `unread` counts in real time.

**F. UI/UX polish**
- Add a small “connecting…” state in `MessagePage` when `!isConnected` to distinguish between no messages and not yet connected.
- Disable the send button when `!isConnected` or show a tooltip “Reconnecting…”.
- In `ChatListPage`, show a skeleton state rather than a full-screen spinner so the navbar and layout remain stable during loading (similar to what you did for the home feeds).

#### 4. Summary
- The overall flow (rooms → roomId → join → send/receive) is sound, but you can simplify and harden it by:
  - Consolidating message history and live updates into one hook per room.
  - Removing redundant listeners and polling.
  - Normalizing/deduping messages at the hook level.
  - Centralizing socket presence + reconnection logic.
- These changes will make the message system easier to reason about, reduce bugs like duplicate messages, and give you a cleaner surface for iterating on the chat UI (typing indicators, read receipts, etc.).


