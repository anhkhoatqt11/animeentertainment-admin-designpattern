# PlantUML Documentation - Proxy Design Pattern

This directory contains PlantUML diagrams that visualize the Proxy design pattern implementation for image caching and lazy loading in the AnimeList component.

## 📊 Diagram Files

### 1. ProxyPatternClassDiagram.puml
**Complete class structure showing all classes and their relationships**

- **Purpose**: Shows the class structure and relationships of the Proxy Pattern implementation
- **Shows**: All classes, interfaces, React components, and cache management
- **Use case**: Understanding the complete system class structure
- **Key elements**:
  - `ImageInterface`: The subject interface defining the contract
  - `RealImage`: The real subject that handles actual image loading
  - `ImageProxy`: The proxy that provides caching and lazy initialization
  - `ImageCacheManager`: Utility class for cache management
  - React components integration (`ProxyImage`, `AnimeList`, `AnimeItemCard`)

### 2. ProxyPatternSequenceDiagram.puml
**Interaction flow and timing of image loading operations**

- **Purpose**: Illustrates the sequence of operations during image loading and caching
- **Shows**: Step-by-step process flows for different scenarios
- **Use case**: Understanding system behavior and timing
- **Key flows**:
  - Page Load & Preloading: How images are preloaded when the page loads
  - Lazy Loading on Scroll: Image loading triggered by viewport intersection
  - Predictive Caching: Background loading of next page images

### 3. ProxyPatternComponentStructure.puml
**React component architecture and integration layers**

- **Purpose**: Displays the React component architecture and integration layers
- **Shows**: Component hierarchy, hooks, and package organization
- **Use case**: Understanding React-specific implementation
- **Key elements**:
  - Core Pattern: Basic proxy pattern classes
  - React Integration: Hooks and components
  - Cache Management: High-level cache operations
  - Application Components: Specific UI components

### 4. ProxyPatternCacheFlow.puml
**State diagram showing cache operations and flow control**

- **Purpose**: Shows cache operations and state transitions
- **Shows**: Cache hit/miss scenarios, lazy initialization, error handling
- **Use case**: Understanding caching strategy and performance benefits
- **Key states**:
  - Image request initiation
  - Cache hit/miss scenarios
  - Lazy initialization process
  - Error handling and fallback
  - Cache storage operations

### 5. ProxyPatternArchitecture.puml
**High-level system architecture overview**

- **Purpose**: Complete system architecture showing all layers and interactions
- **Shows**: UI layers, hooks, pattern implementation, utilities, external services
- **Use case**: Understanding overall system design and integration points
- **Architecture layers**:
  - UI Layer: React components for display
  - Hooks Layer: State management and data fetching
  - Proxy Pattern Implementation: Core pattern classes
  - Cache Management: Caching strategies and utilities
  - React Integration: Component and hook integration
  - Utilities: Supporting services (Intersection Observer, Error Handling)

### 6. ProxyPatternStates.puml
**Detailed state machine showing all possible states during image loading lifecycle**
  - Custom hooks
  - Business logic layer
  - Storage integration

### 5. MementoPatternStates.puml
**State machine showing draft lifecycle**

- **Purpose**: Show different states and transitions
- **Shows**: Draft lifecycle from creation to deletion
- **Use case**: Understanding state management
- **Key states**:
  - Empty form
  - Form with data
  - Draft saved
  - Auto-saving
  - Loading draft
  - Error state

## 🔧 How to Use These Diagrams

### Viewing PlantUML Files

1. **Online**: Use [PlantUML Online Server](http://www.plantuml.com/plantuml/uml/)
2. **VS Code**: Install PlantUML extension
3. **Local**: Install PlantUML with Java

### For Different Audiences

**Developers Learning the Pattern:**
1. Start with `MementoPatternClassic.puml`
2. Then review `MementoPatternSequence.puml`
3. Finally examine `MementoPatternStructure.puml`

**React Developers:**
1. Begin with `MementoPatternComponents.puml`
2. Study `MementoPatternSequence.puml` for data flow
3. Reference `MementoPatternStates.puml` for state management

**System Architects:**
1. Review `MementoPatternStructure.puml` for complete overview
2. Examine `MementoPatternComponents.puml` for integration details
3. Study `MementoPatternStates.puml` for lifecycle management

## 📋 Diagram Descriptions

### MementoPatternStructure.puml
```puml
- AnimeFormMemento: Stores state snapshots
- AnimeFormOriginator: Creates and restores mementos
- AnimeFormCaretaker: Manages memento collection
- useDraftManager: React hook bridging UI and pattern
- DraftManager: UI component for draft management
- AddNewAnime: Main form component
- draftSystemUtils: Error recovery utilities
```

### MementoPatternSequence.puml
```puml
Sequences shown:
1. User saves draft → Memento creation → Storage
2. Auto-save timer → Automatic draft creation
3. User loads draft → Memento retrieval → State restoration
4. Error detection → Data validation → Recovery
```

### MementoPatternComponents.puml
```puml
Layers shown:
- UI Layer: React components
- Hook Layer: useDraftManager
- Business Logic: Pattern classes
- Storage Layer: localStorage
- Utilities: Error handling and repair
```

### MementoPatternStates.puml
```puml
States covered:
- EmptyForm → FormWithData → DraftSaved
- Auto-save transitions
- Draft loading process
- Error states and recovery
```

## 🎯 Key Pattern Elements Visualized

### Core Pattern (Gang of Four)
- **Memento**: `AnimeFormMemento` - Immutable state snapshot
- **Originator**: `AnimeFormOriginator` - Creates and uses mementos
- **Caretaker**: `AnimeFormCaretaker` - Manages memento collection

### React Integration
- **Hook**: `useDraftManager` - Provides React-friendly interface
- **Components**: UI elements for draft interaction
- **State Management**: Integration with React state

### Additional Features
- **Persistence**: localStorage integration
- **Auto-save**: Timer-based automatic saving
- **Error Recovery**: Corrupted data handling
- **Utilities**: Debug and repair tools

## 📖 Reading Guide

### Understanding Relationships
- **Solid arrows**: Direct dependencies/usage
- **Dashed arrows**: Creates/manages relationships
- **Notes**: Additional context and explanations

### Color Coding
- **Blue**: Core pattern classes
- **Green**: React components
- **Yellow**: Interfaces and types
- **Gray**: External systems (localStorage)

### Stereotypes Used
- `<<Memento>>`: Core memento class
- `<<Originator>>`: Core originator class
- `<<Caretaker>>`: Core caretaker class

## 🔄 Pattern Benefits Shown

1. **Encapsulation**: State details hidden in memento
2. **Undo/Redo**: Multiple drafts support
3. **Persistence**: localStorage integration
4. **Recovery**: Error handling and repair
5. **Auto-save**: Automatic data protection

## 🚀 Implementation Highlights

- **Type Safety**: Full TypeScript integration
- **Error Handling**: Comprehensive error recovery
- **Performance**: Efficient state management
- **User Experience**: Auto-save and visual indicators
- **Maintainability**: Clean separation of concerns

These diagrams provide a complete visual documentation of the Memento pattern implementation, from the core design pattern to the full React integration with error handling and persistence.
