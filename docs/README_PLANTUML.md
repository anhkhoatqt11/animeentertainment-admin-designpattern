# PlantUML Documentation - Memento Design Pattern

This directory contains PlantUML diagrams that visualize the Memento design pattern implementation for the anime form draft system.

## 📊 Diagram Files

### 1. MementoPatternStructure.puml
**Complete system overview showing all classes and their relationships**

- **Purpose**: High-level architecture view
- **Shows**: All classes, interfaces, utilities, and external dependencies
- **Use case**: Understanding the complete system structure
- **Key elements**:
  - Core pattern classes (Memento, Originator, Caretaker)
  - React integration layer (hooks, components)
  - Data types and utilities
  - Storage layer integration

### 2. MementoPatternClassic.puml
**Pure Memento pattern implementation following Gang of Four design**

- **Purpose**: Focus on the core design pattern
- **Shows**: Classic pattern structure without React specifics
- **Use case**: Understanding the fundamental pattern implementation
- **Key elements**:
  - Memento class (state storage)
  - Originator class (state management)
  - Caretaker class (memento management)
  - Pattern responsibilities and benefits

### 3. MementoPatternSequence.puml
**Interaction flow and timing of operations**

- **Purpose**: Show how operations flow through the system
- **Shows**: Step-by-step process flows
- **Use case**: Understanding system behavior and timing
- **Key flows**:
  - Draft save sequence
  - Auto-save mechanism
  - Draft load sequence
  - Error recovery process

### 4. MementoPatternComponents.puml
**React component architecture and integration**

- **Purpose**: Show how pattern integrates with React
- **Shows**: Component hierarchy and data flow
- **Use case**: Understanding React-specific implementation
- **Key elements**:
  - UI components
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
