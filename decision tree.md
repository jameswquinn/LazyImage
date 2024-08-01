```mermaid
graph TD
    A[Start] --> B{Is image in view or critical?}
    B -->|Yes| C{What's the image format?}
    B -->|No| D[Show placeholder]
    C -->|SVG| E[Render SVG object]
    C -->|iframe| F[Render iframe]
    C -->|Other| G{Is WebP supported?}
    G -->|Yes| H[Render picture with WebP source]
    G -->|No| I[Render picture without WebP]
    D --> J[Wait for image to come into view]
    J --> B
    E --> K[Image rendered]
    F --> K
    H --> K
    I --> K
    K --> L{Did image load successfully?}
    L -->|Yes| M[Show high-quality image]
    L -->|No| N{Retry attempts left?}
    N -->|Yes| O[Retry loading]
    N -->|No| P[Show error state]
    O --> B
    M --> Q[End]
    P --> Q

    % Edge Cases
    R{Is src empty or invalid?} --> |Yes| S[Show error placeholder]
    A --> R
    R -->|No| B
    
    T{Browser doesn't support lazy loading?} --> |Yes| U[Use intersection observer fallback]
    B --> T
    T -->|No| B
    
    V{Network connection lost?} --> |Yes| W[Show offline placeholder]
    L --> V
    V -->|No| L
    
    X{Image dimensions unknown?} --> |Yes| Y[Use default or calculated dimensions]
    C --> X
    X -->|No| C
    
    Z{Low memory on device?} --> |Yes| AA[Load low-res version only]
    G --> Z
    Z -->|No| G
    
    AB{CORS issues?} --> |Yes| AC[Show CORS error message]
    L --> AB
    AB -->|No| L

```
