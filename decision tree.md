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

    %% Edge Cases
    R{Is src empty or invalid?} --> |Yes| S[Show placeholder or error state]
    T{Network connection lost?} --> |Yes| U[Show offline placeholder]
    V{Image size larger than expected?} --> |Yes| W[Apply max-width/height constraints]
    X{Low memory on device?} --> |Yes| Y[Use low-res image]
    Z{Slow network detected?} --> |Yes| AA[Prioritize low-res image loading]
    AB{User prefers reduced motion?} --> |Yes| AC[Disable loading animations]
    AD{Image format not supported by browser?} --> |Yes| AE[Fall back to supported format]
    
    B --> R
    K --> T
    K --> V
    B --> X
    B --> Z
    A --> AB
    C --> AD

```
