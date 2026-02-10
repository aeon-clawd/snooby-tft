# 🗄️ Database Setup - SnoobyTFT

## MongoDB Atlas Configuration

### Quick Start

1. **Create MongoDB Atlas account** (if you don't have one)
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Choose Free Tier (M0 - 512 MB)

2. **Create a new cluster**
   - Provider: AWS
   - Region: us-east-1 (closest to Vercel)
   - Cluster Name: `snoobytft`

3. **Create Database User**
   ```
   Username: snooby-admin
   Password: [generate secure password]
   Role: Atlas Admin
   ```

4. **Configure Network Access**
   - Add IP: `0.0.0.0/0` (allow from anywhere - development)
   - **Production:** Use Vercel's IP addresses

5. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

6. **Add to environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and paste your MongoDB URI
   ```

### Environment Variables

Create `.env.local` file in the project root:

```bash
MONGODB_URI=mongodb+srv://snooby-admin:<password>@snoobytft.xxxxx.mongodb.net/snoobytft?retryWrites=true&w=majority&appName=SnoobyTFT
```

**Important:** 
- Never commit `.env.local` to git
- Use `.env.example` as template for team members

### Test Connection

```bash
# Start development server
npm run dev

# In another terminal, test the database connection
npm run db:test
# or
curl http://localhost:3000/api/test-db
```

Expected response:
```json
{
  "success": true,
  "message": "Database connection successful",
  "stats": {
    "totalComps": 0,
    "sampleComp": null
  }
}
```

### Seed Example Data

Populate the database with example TFT compositions:

```bash
npm run seed
```

This will insert 3 example comps:
- Reroll Warwick (S-tier)
- Fast 8 Bruisers (A-tier)
- Invoker Ryze (B-tier, inactive)

## Database Schema

### Comp Model

```typescript
{
  name: string;              // Composition name
  description?: string;      // Brief description
  champions: [{
    name: string;
    cost: number;            // 1-5
    items: string[];
    isCarry: boolean;
    stars?: number;          // 1, 2, or 3
  }];
  synergies: [{
    name: string;
    tier: number;            // Synergy level achieved
    isActive?: boolean;
  }];
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  positioning: [{
    champion: string;
    hex: string;             // "row-col" format (e.g., "3-1")
  }];
  augments: string[];        // Recommended augments
  artifacts: string[];       // Recommended artifacts
  videoUrl?: string;         // YouTube guide
  tacterUrl?: string;        // Tacter.gg guide
  set?: string;              // TFT set version
  patch?: string;            // Game patch
  playstyle?: string;        // "Reroll", "Fast 8", etc.
  difficulty?: string;       // "Easy", "Medium", "Hard"
  isActive: boolean;         // Active in current meta
  createdAt: Date;
  updatedAt: Date;
}
```

### Indexes

Optimized for common queries:
- `tier` - Search by tier
- `champions.name` - Find comps with specific champion
- `synergies.name` - Find comps with specific synergy
- `isActive + tier` - Active comps sorted by tier
- `set + patch` - Filter by game version
- `createdAt` - Sort by date

## Helper Methods

### Instance Methods

```typescript
// Get embeddable YouTube URL
comp.getEmbedVideoUrl(): string | null
```

### Static Methods

```typescript
// Find comps by tier
Comp.findByTier('S'): Promise<IComp[]>

// Find comps containing a champion
Comp.findByChampion('Warwick'): Promise<IComp[]>

// Find comps with a synergy
Comp.findBySynergy('Invoker'): Promise<IComp[]>
```

## Production Considerations

### Security
- [ ] Restrict MongoDB Atlas IP whitelist to Vercel IPs only
- [ ] Use separate database users for read/write operations
- [ ] Enable MongoDB Atlas audit logs

### Performance
- [ ] Monitor index usage in Atlas dashboard
- [ ] Set up connection pooling limits
- [ ] Consider read replicas for high traffic

### Backups
- [ ] MongoDB Atlas Free Tier includes basic backups
- [ ] For production: enable continuous backups
- [ ] Set up backup alerts

## Troubleshooting

### Connection Fails

1. Check IP whitelist in MongoDB Atlas
2. Verify username/password in connection string
3. Ensure password is URL-encoded (special characters)
4. Check cluster is running (not paused)

### Slow Queries

1. Check Atlas performance metrics
2. Verify indexes are being used
3. Use MongoDB Compass to analyze query performance

### Common Errors

```
MongooseError: Operation buffering timed out
→ Check internet connection and MongoDB Atlas status

MongoParseError: Invalid connection string
→ Verify MONGODB_URI format in .env.local

MongoNetworkError: connection refused
→ Check IP whitelist and cluster status
```

## Useful Commands

```bash
# Test database connection
npm run db:test

# Seed database with examples
npm run seed

# Connect to MongoDB with Compass
# Connection string: (same as MONGODB_URI)
```

## Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [Next.js MongoDB Example](https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose)

---

For detailed schema design decisions, see: `/home/ubuntu/Obsidia-notas/Tickets/tk-iy81pckx6057.md`
