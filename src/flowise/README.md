# Flowise Chat Integration

A React-based chat interface for Flowise, supporting both streaming and non-streaming responses, file uploads, and real-time message updates.

## Features

### Core Functionality

- Streaming and non-streaming message support
- Real-time message updates with token-by-token display
- Error handling with FlowiseError class
- Loading states and initialization management

### File Upload Support

- Image upload support with type and size validation
- RAG (Retrieval-Augmented Generation) file upload support
- Configurable file type and size limits
- Automatic file type detection and validation
- Image preview thumbnails for uploaded images
- Client-side validation:
  - File type checking against configured allowed types
  - File size validation against configured limits
  - Separate handling for image and RAG files
  - Warning messages for invalid files
- Server-side validation in adapter

### State Management

- Centralized state management using Zustand
- Separate stores for chat and Flowise-specific state
- Memoized capabilities to prevent unnecessary re-renders
- Proper initialization flow with ready state tracking

### Message Handling

- Support for both streaming and non-streaming responses
- Proper event handling for different message types:
  - token: Real-time message updates
  - metadata: Message ID and session management
  - start/end: Stream lifecycle management
- JSON response handling for non-streaming mode

### Type Safety

- Full TypeScript support
- Proper type definitions for:
  - Message events and responses
  - Chat capabilities and configurations
  - Upload configurations and validations

## Implementation Details

### Adapter Pattern

The `FlowiseChatAdapter` implements the `ChatAdapter` interface and provides:

- Initialization and configuration management
- Capability detection and mapping
- Message sending with proper streaming/non-streaming handling
- File upload validation and handling

### State Management

- `ChatStore`: Manages general chat state (messages, input, files)
- `FlowiseStore`: Manages Flowise-specific state (config, current message)
- Proper state synchronization between stores

### Component Structure

- `FlowiseChat`: Main container component
- `FlowiseMessageList`: Message display with real-time updates
- `FlowiseChatInputBar`: Input handling and file upload UI
- `FlowiseMessage`: Individual message rendering

### Error Handling

- Custom `FlowiseError` class for better error context
- Proper error state management
- User-friendly error messages
- Recovery from error states

## Usage

1. Configure Flowise:

```typescript
const config = new FlowiseConfigBuilder()
  .withApiKey("your-api-key")
  .withBaseUrl("your-base-url")
  .withChatflowId("your-chatflow-id")
  .build();
```

2. Use the chat component:

```tsx
<FlowiseChat />
```

## Configuration

### Environment Variables

- `VITE_FLOWISE_API_KEY`: Your Flowise API key
- `VITE_FLOWISE_BASE_URL`: Your Flowise instance URL
- `VITE_FLOWISE_CHATFLOW_ID`: Your chatflow ID
