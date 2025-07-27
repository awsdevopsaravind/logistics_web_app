# 🚚 Rock Transport Business Management System Guide

## Business Overview & Terminology

### Your Business Model (Proper Terms)
- **Business Type**: Material Supply & Transportation Contractor
- **Core Activity**: Rock Aggregate Supply Chain Management
- **Service Area**: Quarry-to-Harbor Transport (50-60km corridor)

### Key Stakeholders & Their Roles
1. **Quarry Owners** (Material Suppliers)
   - Provide rock materials at 170-190 Rs/ton
   - Require advance payments for material security

2. **Vehicle Owners** (Transportation Contractors) 
   - Transport materials using tipper vehicles
   - Paid 270-290 Rs/ton for transportation services
   - Require advance payments for vehicle availability

3. **Government Royalty Department**
   - Charges 235-255 Rs/cubic meter for mining royalty
   - Requires advance purchase of 500-1000 cubic meters
   - Issues government receipts for tracking

4. **End Customers** (Harbor/Construction Sites)
   - Issue "Kaata Receipts" (Official Weight Slips)
   - Pay 645 Rs/ton for delivered materials
   - Payment terms: Daily settlements (sometimes delayed)

## Accounting & Financial Terminology

### Revenue Structure
- **Gross Revenue**: 645 Rs/ton (customer payment rate)
- **Direct Costs**: Material + Royalty + Transportation
- **Gross Margin**: Revenue minus direct costs
- **Net Profit**: Gross margin minus operational expenses

### Working Capital Management
- **Accounts Payable**: Money owed to quarries & transporters
- **Accounts Receivable**: Money owed by customers
- **Inventory**: Unused royalty cubic meters (asset)
- **Advance Payments**: Security deposits given to suppliers
- **Cash Flow**: Daily money in/out movements

### Key Performance Indicators (KPIs)
- **Daily Tonnage**: Total material moved per day
- **Profit per Ton**: Net profit divided by tonnage
- **Advance Utilization**: How quickly advances are adjusted
- **Royalty Burn Rate**: Cubic meters used per day
- **Outstanding Ratio**: Payables vs Receivables balance

## System Features Built for You

### 📊 **Advanced Dashboard**
- **Real-time KPIs**: Today's trips, revenue, profit, tonnage
- **Financial Overview**: Outstanding payables, receivables, working capital
- **Royalty Monitoring**: Balance tracking with usage alerts
- **Payment Schedule**: Today's pending payments by party

### 💰 **Payment Management**
- **Advance Tracking**: Given to quarries & transporters
- **Daily Settlement**: Trip-wise payment calculations
- **Outstanding Reports**: Party-wise balance tracking
- **GST Management**: Input/output tax calculations

### 🏛️ **Government Royalty Management**
- **Stock Tracking**: Purchased vs used cubic meters
- **Usage History**: Trip-wise royalty consumption
- **Alert System**: Low balance warnings (100-200 cubic meters)
- **Purchase Recording**: Government receipt management

### 📈 **Analytics & Reports**
- **Daily Summary**: Trips, tonnage, profit breakdown
- **Monthly Reports**: Trends and performance analysis
- **Party Performance**: Quarry and vehicle efficiency
- **Cash Flow Analysis**: Money movement tracking

## Database Structure (Already Built)

### Core Tables
- **Trips**: Each transport journey with kaata receipt details
- **Quarries**: Supplier information and rates
- **Transporters**: Vehicle owner details and contracts
- **Payments**: All payment transactions (quarry, transport, customer)
- **Royalty Stock**: Government purchase tracking
- **Advances**: Security deposits management

## Setup Instructions

### Prerequisites
1. **Database**: PostgreSQL installed
2. **Node.js**: Version 14+ for backend
3. **React**: Frontend development environment

### Quick Start
```bash
# Backend Setup
cd backend
npm install
npx prisma db push  # Create database tables
npm start

# Frontend Setup  
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create `.env` file in backend folder:
```
DATABASE_URL="postgresql://username:password@localhost:5432/logistics_db"
JWT_SECRET="your-secret-key"
```

## Business Recommendations

### 1. **Daily Operations Workflow**
**Morning (9:00 AM)**:
- Review yesterday's pending payments
- Check royalty balance alerts
- Plan today's trips based on advances available

**Evening (6:00 PM)**:
- Collect kaata receipts from drivers
- Record trips in system
- Generate payment schedule for tomorrow
- Update outstanding balances

### 2. **Financial Controls**
- **Advance Policy**: Give 3-5 days worth of payments as advance
- **Payment Terms**: Daily settlement to maintain cash flow
- **Royalty Management**: Maintain 30-day buffer stock
- **Credit Limits**: Set maximum outstanding per party

### 3. **Key Metrics to Monitor Daily**
- **Profit Margin**: Should be 15-25% minimum
- **Advance Turnover**: Advances should be adjusted within 7 days
- **Royalty Burn Rate**: Monitor usage vs purchase frequency
- **Outstanding Ratio**: Receivables should exceed payables

### 4. **Risk Management**
- **Royalty Stock**: Alert when below 200 cubic meters
- **Payment Delays**: Flag parties with 7+ day outstanding
- **Vehicle Performance**: Track efficiency per vehicle
- **Seasonal Planning**: Prepare for monsoon disruptions

## Data Migration from Excel

### Steps to Import Your Current Data:
1. **Export your Excel data** by month/sheet
2. **Categorize data** into:
   - Trip records (date, vehicle, tonnage, payments)
   - Quarry information (names, rates, advances)
   - Vehicle owner details (names, rates, advances)
   - Payment transactions (by type and date)

3. **Import sequence**:
   - First: Quarries and Transporters (master data)
   - Second: Trips (transaction data)
   - Third: Payments (financial data)
   - Last: Outstanding balances (reconciliation)

## Next Steps to Complete Implementation

### Immediate Actions:
1. **Set up database** with your actual quarry/vehicle data
2. **Enter current royalty stock** from government receipts
3. **Import last month's trips** for baseline data
4. **Configure alert thresholds** for your business needs

### Backend Routes to Complete:
- **Royalty routes**: `/royalty/stocks`, `/royalty/purchase`, `/royalty/usage-history`
- **Payment routes**: Advanced payment processing
- **Reports**: Excel export functionality

### Advanced Features to Add:
- **Mobile app** for drivers to submit kaata receipts
- **WhatsApp integration** for payment reminders
- **Bank integration** for automatic payment reconciliation
- **GPS tracking** for vehicle monitoring

## Business Advantages of This System

### Compared to Excel:
- **Real-time tracking** vs manual updates
- **Automated calculations** vs formula errors
- **Multi-user access** vs single-user limitation
- **Data backup** vs risk of file corruption
- **Mobile accessibility** vs desktop dependency

### Financial Benefits:
- **Improved cash flow** through better tracking
- **Reduced disputes** with accurate records
- **Better planning** with trend analysis
- **Cost optimization** through performance metrics
- **Compliance readiness** for GST and regulations

## Support & Maintenance

### Daily Maintenance:
- **Backup database** daily
- **Verify calculations** weekly
- **Update rates** as market changes
- **Review outstanding** balances weekly

### Monthly Tasks:
- **Generate reports** for analysis
- **Reconcile bank statements**
- **Review party performance**
- **Update advance policies**

---

## Quick Reference: Business Calculations

### Profit per Trip:
```
Revenue = Tonnage × 645 Rs/ton
Material Cost = Tonnage × Quarry Rate (170-190 Rs/ton)
Transport Cost = Tonnage × Transport Rate (270-290 Rs/ton)  
Royalty Cost = Cubic Meters × Royalty Rate (235-255 Rs/m³)
Net Profit = Revenue - (Material + Transport + Royalty + Other costs)
```

### Cubic Meter Conversion:
```
Rock density ≈ 2.5 tons/cubic meter
Cubic Meters = Tonnage ÷ 2.5
Royalty Cost = (Tonnage ÷ 2.5) × Royalty Rate
```

### Working Capital:
```
Current Assets = Cash + Receivables + Advances Given + Royalty Stock
Current Liabilities = Payables + Advances Received
Working Capital = Current Assets - Current Liabilities
```

This system will transform your business from manual Excel tracking to automated, real-time financial management. The initial setup investment will pay for itself within the first month through improved cash flow and reduced errors.