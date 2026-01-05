# Complete VibeAPI-Style Webmaster Portal Implementation

## Analysis of VibeAPI Dashboard Structure

After analyzing the VibeAPI dashboard (vibeapi.space/dashboard), here's the complete implementation plan:

## Dashboard Pages & Components

### 1. Overview Page
- **KPI Cards**: 
  - Submasters (Active accounts)
  - API Keys (Active keys)
  - Today's Transactions (Count & Total)
  - Estimated Profit (Calculated from pricing)

- **Metrics Section**:
  - Compute Time (Total seconds used)
  - Compute Revenue (Price × Usage)
  - Token Revenue (From token billing)

- **Pricing Configuration Block**:
  - Default IN Rate (Input tokens price)
  - Default OUT Rate (Output tokens price)
  - Compute Rate (Processing cost per second)

- **Quick Actions**:
  - Invite New Submaster Button
  - Generate API Key Button

### 2. Profit Dashboard
- **Revenue Metrics**:
  - Total Revenue (From all transactions)
  - Total Costs (AI provider costs)
  - Gross Profit (Revenue - Costs)
  - Profit Margin % (Target: 20%)

- **Token Usage Breakdown**:
  - Input Tokens Count
  - Input Costs
  - Output Tokens Count
  - Output Costs
  - Total AI Costs

- **Profit Summary**:
  - Revenue Display
  - Costs Display
  - Net Profit
  - Margin %

- **Profit by Submaster Table**:
  - Submaster name
  - Individual profit
  - Margin %

### 3. Submasters Page
- **Table Columns**:
  - Submaster Name
  - Email
  - Status (Active/Inactive)
  - Revenue Generated
  - Created Date
  - Actions (Edit, Delete, View Details)

- **Invite New Submaster Modal**:
  - Email input
  - Permission role select
  - Commission percentage input

### 4. Transactions Page
- **API Billing Transactions Table**:
  - Date
  - Submaster (Who used it)
  - Type (Compute, Token)
  - Tokens (Input/Output count)
  - Compute (Seconds or units)
  - Compute Cost
  - Total Cost
  - Filters (Date range, Type, Submaster)

- **Credit Transfer History Table**:
  - Date
  - Submaster (Recipient)
  - Amount
  - Balance Change
  - Filters & Pagination

### 5. API Keys Page
- **Active API Keys Table**:
  - Key Name
  - Key (Partial/Masked)
  - Created Date
  - Last Used Date
  - Status (Active/Inactive)
  - Actions (Copy, Regenerate, Revoke)

- **Generate New Key Modal**:
  - Key Name input
  - Expiration date picker
  - Permissions checkboxes

### 6. Usage Monitoring Page
- **Recent Transactions Table**:
  - Timestamp
  - Submaster
  - API Endpoint
  - Tokens Used
  - Cost
  - Response Time
  - Status

- **Charts/Graphs**:
  - Usage over time (Line chart)
  - Cost breakdown pie chart
  - Hourly/Daily transactions bar chart

### 7. Token Pricing Page
- **Price Configuration Forms**:
  - Input Token Price (per 1k tokens)
  - Output Token Price (per 1k tokens)
  - Compute Rate (per second)
  - Minimum Charge

- **Price History Table**:
  - Old Price
  - New Price
  - Changed Date
  - Updated By

- **Calculation Examples**:
  - Show how pricing is applied
  - ROI examples

## Database Models Required

```javascript
// User (Webmaster) Model
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String,
  credits: Number,
  totalRevenue: Number,
  totalCosts: Number,
  createdAt: Date,
  role: ['admin', 'webmaster']
}

// Submaster Model
{
  _id: ObjectId,
  name: String,
  email: String,
  parentId: ObjectId (Reference to User),
  status: ['active', 'inactive'],
  commissionRate: Number (0-100),
  credits: Number,
  revenue: Number,
  createdAt: Date,
  updatedAt: Date
}

// APIKey Model
{
  _id: ObjectId,
  userId: ObjectId,
  key: String (unique),
  name: String,
  isActive: Boolean,
  lastUsedAt: Date,
  createdAt: Date,
  expiresAt: Date,
  permissions: [String]
}

// Transaction Model
{
  _id: ObjectId,
  submasterId: ObjectId,
  userId: ObjectId,
  type: ['compute', 'token', 'credit_transfer'],
  inputTokens: Number,
  outputTokens: Number,
  computeSeconds: Number,
  cost: Number,
  revenue: Number,
  timestamp: Date,
  endpoint: String,
  responseTime: Number,
  status: ['success', 'failed']
}

// Pricing Model
{
  _id: ObjectId,
  inTokenRate: Number (per 1k),
  outTokenRate: Number (per 1k),
  computeRate: Number (per second),
  updatedAt: Date,
  updatedBy: ObjectId
}

// Profit Model (Calculated/Cached)
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  totalRevenue: Number,
  totalCosts: Number,
  grossProfit: Number,
  margin: Number,
  submasterBreakdown: [{
    submasterId: ObjectId,
    revenue: Number,
    costs: Number,
    profit: Number
  }]
}
```

## Backend API Endpoints

### Overview Endpoints
```
GET /api/dashboard/overview - Get KPI metrics
GET /api/dashboard/stats - Get current stats
```

### Profit Dashboard
```
GET /api/profit/summary - Get profit overview
GET /api/profit/daily - Get daily profit breakdown
GET /api/profit/by-submaster - Profit per submaster
GET /api/profit/costs - Get cost breakdown
```

### Submasters
```
GET /api/submasters - List all submasters
GET /api/submasters/:id - Get submaster details
POST /api/submasters - Create submaster
PUT /api/submasters/:id - Update submaster
DELETE /api/submasters/:id - Delete submaster
POST /api/submasters/:id/invite - Send invite
PUT /api/submasters/:id/commission - Update commission
```

### Transactions
```
GET /api/transactions - List all transactions
GET /api/transactions/billing - API billing transactions
GET /api/transactions/credits - Credit transfer history
GET /api/transactions/summary - Transaction summary
POST /api/transactions/transfer-credits - Transfer credits
```

### API Keys
```
GET /api/keys - List user keys
POST /api/keys - Generate new key
DELETE /api/keys/:id - Revoke key
PUT /api/keys/:id/status - Toggle key status
```

### Analytics
```
GET /api/analytics/usage - Usage by time period
GET /api/analytics/costs - Cost analytics
GET /api/analytics/revenue - Revenue analytics
GET /api/analytics/top-submasters - Top performers
```

### Pricing
```
GET /api/pricing - Get current pricing
PUT /api/pricing - Update pricing (admin only)
GET /api/pricing/history - Pricing change history
POST /api/pricing/calculate - Calculate cost for usage
```

## Frontend Components (React)

### Main Layout
- Sidebar Navigation
- Header with User Profile
- Main Content Area
- Footer

### Reusable Components
- KPI Card (metric display with icon)
- Transaction Table (paginated, filterable)
- Modal Components (for actions)
- Charts (Chart.js/Recharts for graphs)
- Notifications (Toast/Alerts)
- Loading States

## Calculation Logic

### Revenue Calculation
```javascript
revenue = (inputTokens * inTokenRate / 1000) + 
          (outputTokens * outTokenRate / 1000) + 
          (computeSeconds * computeRate)
```

### Profit Calculation
```javascript
profit = totalRevenue - totalCosts
margin = (profit / revenue) * 100
```

### Commission to Submaster
```javascript
subasterCommission = totalRevenue * (commissionRate / 100)
webmasterEarnings = totalRevenue - submasterCommission
```

## Deployment Checklist

- [ ] Database connection configured
- [ ] All models created
- [ ] All API endpoints implemented
- [ ] Frontend pages built
- [ ] Authentication implemented
- [ ] Data validation added
- [ ] Error handling implemented
- [ ] Charts/graphs integrated
- [ ] CSV export functionality (if needed)
- [ ] Email notifications setup
- [ ] Rate limiting configured
- [ ] Security headers added
- [ ] CORS configured
- [ ] Testing completed
- [ ] Documentation finalized

## Next Steps

1. Create remaining backend route files
2. Build complete React frontend
3. Add data visualization (charts)
4. Implement real-time updates (Socket.io)
5. Add export/reporting features
6. Deploy to production
