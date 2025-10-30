# Analytics Event Flow Diagrams

These diagrams show the complete user journey and which events are tracked at each step.

## Complete User Journey

```mermaid
graph TD
    A[Landing Page] -->|page_view| B{User Action}
    B -->|Click Hero CTA| C[create_design_hero]
    B -->|Click Header CTA| D[create_design_header]
    B -->|Click Product Card| E[customize_design_click]

    C --> F[Design Creation Flow]
    D --> F
    E --> G[Product Customization Flow]

    F --> H[Checkout Flow]
    G --> H

    H --> I[Payment Success]

    style A fill:#e1f5ff
    style I fill:#c8e6c9
    style F fill:#fff9c4
    style G fill:#fff9c4
    style H fill:#ffe0b2
```

## Design Creation Funnel

```mermaid
graph LR
    A[Enter Prompt] -->|prompt_entered| B[Click Generate]
    B -->|design_generation_start| C{AI Processing}
    C -->|Success| D[design_generation_success]
    C -->|Error| E[design_generation_error]
    D --> F[View Design]
    F --> G[Customize]
    G -->|color_changed| H[Change Color]
    G -->|size_quantity_changed| I[Select Size]
    H --> J[Checkout]
    I --> J

    style A fill:#e3f2fd
    style D fill:#c8e6c9
    style E fill:#ffcdd2
    style J fill:#fff59d
```

## Product Customization Funnel

```mermaid
graph LR
    A[View Product Page] -->|view_item| B[Browse Designs]
    B -->|design_selected| C[Select Design]
    C --> D[Customize]
    D -->|color_changed| E[Choose Color]
    D -->|size_quantity_changed| F[Select Sizes]
    E --> G[Add to Cart]
    F --> G
    G -->|begin_checkout| H[Checkout]

    style A fill:#e1f5ff
    style H fill:#fff59d
```

## Checkout Funnel (3 Steps)

```mermaid
graph TD
    A[Click 'Na blagajno'] -->|begin_checkout| B[Step 1: Order Review]
    B -->|checkout_progress step=1| C{Continue?}
    C -->|Yes| D[Step 2: Contact Info]
    C -->|No - Close Drawer| Z1[checkout_abandoned step=1]

    D -->|checkout_progress step=2| E[Fill Contact Details]
    E --> F{Complete Form?}
    F -->|Yes| G[contact_info_completed]
    F -->|No - Close Drawer| Z2[checkout_abandoned step=2]

    G --> H[Step 3: Payment]
    H -->|checkout_progress step=3| I[add_payment_info]
    I --> J[Enter Payment Details]
    J --> K{Submit Payment?}
    K -->|Yes| L[payment_submitted]
    K -->|No - Close Drawer| Z3[checkout_abandoned step=3]

    L --> M{Payment Success?}
    M -->|Yes| N[purchase]
    M -->|No| O[Error]

    style A fill:#e3f2fd
    style N fill:#c8e6c9
    style Z1 fill:#ffcdd2
    style Z2 fill:#ffcdd2
    style Z3 fill:#ffcdd2
    style O fill:#ffcdd2
```

## Event Timeline Example

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Analytics
    participant Firebase

    User->>App: Visits landing page
    App->>Analytics: page_view
    Analytics->>Firebase: Log event

    User->>App: Clicks "Ustvari Motiv"
    App->>Analytics: create_design_hero
    Analytics->>Firebase: Log event

    User->>App: Enters prompt
    App->>Analytics: prompt_entered
    Analytics->>Firebase: Log event

    User->>App: Clicks generate
    App->>Analytics: design_generation_start
    Analytics->>Firebase: Log event

    Note over App: AI generates design

    App->>Analytics: design_generation_success
    Analytics->>Firebase: Log event

    User->>App: Selects color
    App->>Analytics: color_changed
    Analytics->>Firebase: Log event

    User->>App: Selects sizes
    App->>Analytics: size_quantity_changed
    Analytics->>Firebase: Log event

    User->>App: Clicks "Na blagajno"
    App->>Analytics: begin_checkout
    Analytics->>Firebase: Log event

    User->>App: Fills contact info
    App->>Analytics: contact_info_completed
    Analytics->>Firebase: Log event

    User->>App: Proceeds to payment
    App->>Analytics: add_payment_info
    Analytics->>Firebase: Log event

    User->>App: Submits payment
    App->>Analytics: payment_submitted
    Analytics->>Firebase: Log event

    Note over App: Payment processing

    App->>Analytics: purchase
    Analytics->>Firebase: Log event
```

## Conversion Funnel Metrics

```mermaid
graph TD
    A[Landing Page Visitors: 1000] -->|10%| B[Create/Customize Action: 100]
    B -->|80%| C[Begin Checkout: 80]
    C -->|60%| D[Contact Info Complete: 48]
    D -->|70%| E[Payment Initiated: 34]
    E -->|85%| F[Purchase Complete: 29]

    A -.->|90% drop| X1[Bounced]
    B -.->|20% drop| X2[Left without checkout]
    C -.->|40% drop| X3[Abandoned at step 1]
    D -.->|30% drop| X4[Abandoned at step 2]
    E -.->|15% drop| X5[Payment failed/abandoned]

    style F fill:#4caf50
    style X1 fill:#ffebee
    style X2 fill:#ffebee
    style X3 fill:#ffebee
    style X4 fill:#ffebee
    style X5 fill:#ffebee
```

## Data Flow Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[User Action] --> B[Component]
        B --> C[Track Function]
        C --> D[analytics.ts]
    end

    subgraph "Firebase"
        D --> E[Firebase Analytics SDK]
        E --> F[Firebase Analytics]
        F --> G[Google Analytics 4]
    end

    subgraph "Reporting"
        G --> H[GA4 Dashboard]
        G --> I[Custom Reports]
        G --> J[BigQuery Export]
    end

    style A fill:#e3f2fd
    style D fill:#fff9c4
    style F fill:#c8e6c9
    style H fill:#e1bee7
    style I fill:#e1bee7
    style J fill:#e1bee7
```

## Event Parameters Structure

```mermaid
graph LR
    A[Event] --> B[Event Name]
    A --> C[Parameters]

    C --> D[Standard Params]
    C --> E[Custom Params]

    D --> D1[value]
    D --> D2[currency]
    D --> D3[transaction_id]

    E --> E1[product_id]
    E --> E2[product_name]
    E --> E3[checkout_step]
    E --> E4[user_id]
    E --> E5[prompt_length]
    E --> E6[design_style]

    style A fill:#fff59d
    style D fill:#c8e6c9
    style E fill:#bbdefb
```

---

## How to Use These Diagrams

1. **Planning**: Use these to understand the complete tracking implementation
2. **Debugging**: Follow the flow to identify which events should fire when
3. **Documentation**: Share with stakeholders to explain data collection
4. **Optimization**: Identify bottlenecks in the funnel

## Viewing These Diagrams

These diagrams use Mermaid syntax. To view them:

1. **GitHub**: Renders automatically when viewing on GitHub
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy to https://mermaid.live/
4. **Documentation Sites**: Most support Mermaid natively

## Creating Custom Diagrams

To create your own funnel diagrams based on your data:

1. Export event counts from GA4
2. Calculate conversion rates between steps
3. Use the Conversion Funnel template above
4. Update the numbers with your actual data
