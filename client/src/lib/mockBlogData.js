export const demoPosts = [
  {
    id: "1",
    title: "My DevOps Journey: From Zero to Cloud Native in 90 Days",
    slug: "devops-journey-zero-to-cloud-native",
    excerpt:
      "Follow my transformation from traditional development to mastering Docker, Kubernetes, CI/CD, and cloud infrastructure automation.",
    content: `## Introduction

Three months ago, I decided to dive deep into DevOps and cloud infrastructure. This is my complete journey, mistakes, wins, and everything I learned.

## Week 1-2: Docker Fundamentals

Started with containerization basics. Here's my first working Dockerfile:

\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

> **Key Learning**: Always use multi-stage builds for production. My image sizes went from 1.2GB to 180MB!

## Week 3-4: Kubernetes Deep Dive

Kubernetes felt overwhelming at first. The breakthrough came when I visualized it as "Docker orchestration on steroids."

### My First Deployment

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: myapp:v1.0
        ports:
        - containerPort: 3000
\`\`\`

## Week 5-8: CI/CD Pipelines

Set up GitHub Actions for automated testing and deployment:

\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build & Push
        run: |
          docker build -t app .
          docker push app:latest
\`\`\`

## Week 9-12: AWS & Terraform

Infrastructure as Code changed everything. Now I can spin up entire environments with one command.

### Lessons Learned

1. **Start small**: Don't try to learn everything at once
2. **Build projects**: Theory is useless without practice
3. **Document everything**: My notes saved me countless hours
4. **Join communities**: DevOps Discord servers are goldmines

## What's Next?

Currently exploring:
- Service meshes (Istio)
- GitOps (ArgoCD)
- Monitoring (Prometheus + Grafana)

---

*This is part 1 of my DevOps Journey series. Stay tuned for deep dives into each topic!*`,
    coverImage:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
    tags: ["devops", "kubernetes", "docker", "aws", "journey"],
    category: "DevOps",
    publishedAt: "2025-12-28",
    updatedAt: "2025-12-28",
    readingTime: "8 min",
    author: "Gokul A",
    authorBio: "Full-Stack Developer exploring DevOps, Cloud & AI",
    featured: true,
    views: 1247,
    likes: 89,
    bookmarks: 34,
    comments: 12,
    series: "DevOps Journey",
    seriesOrder: 1,
    status: "published",
    seoTitle: "DevOps Journey: Zero to Cloud Native in 90 Days | Complete Guide",
    seoDescription: "Follow my 90-day transformation into DevOps. Learn Docker, Kubernetes, CI/CD, AWS, and Terraform with real examples and lessons learned.",
    canonical: "https://yoursite.com/blog/devops-journey-zero-to-cloud-native",
  },
  {
    id: "2",
    title: "Building a Scalable Microservices Architecture with Spring Boot",
    slug: "microservices-spring-boot-architecture",
    excerpt:
      "Design patterns, best practices, and real-world challenges when building microservices at scale using Spring Boot and Spring Cloud.",
    content: `## Why Microservices?

After working with monoliths for years, I finally understand why everyone talks about microservices. Here's what I learned building a production system.

## Architecture Overview

\`\`\`
┌─────────────┐
│   Gateway   │
└──────┬──────┘
       │
   ┌───┴────┬────────┬────────┐
   │        │        │        │
┌──▼──┐ ┌──▼──┐ ┌───▼──┐ ┌──▼──┐
│User │ │Order│ │Product│ │Pay │
└─────┘ └─────┘ └──────┘ └────┘
\`\`\`

## Key Components

### 1. API Gateway (Spring Cloud Gateway)

\`\`\`java
@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("users", r -> r.path("/api/users/**")
                .uri("lb://USER-SERVICE"))
            .route("orders", r -> r.path("/api/orders/**")
                .uri("lb://ORDER-SERVICE"))
            .build();
    }
}
\`\`\`

### 2. Service Discovery (Eureka)

Every service registers itself:

\`\`\`java
@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
\`\`\`

## Challenges & Solutions

### Challenge 1: Distributed Transactions

**Problem**: How to handle transactions across multiple services?

**Solution**: Saga pattern with event-driven architecture

\`\`\`java
@Service
public class OrderSagaOrchestrator {
    public void createOrder(OrderRequest request) {
        // Step 1: Reserve inventory
        inventoryService.reserve(request.getItems());
        
        // Step 2: Process payment
        paymentService.charge(request.getPayment());
        
        // Step 3: Create order
        orderService.create(request);
    }
}
\`\`\`

### Challenge 2: Data Consistency

Used event sourcing and CQRS pattern.

> **Pro Tip**: Don't go full microservices from day one. Start with a modular monolith and extract services as needed.

## Performance Lessons

1. **Cache everything** (Redis saved us)
2. **Async communication** (RabbitMQ/Kafka)
3. **Circuit breakers** (Resilience4j)
4. **Proper monitoring** (ELK stack)

## Metrics After Migration

- **Deployment time**: 45min → 5min
- **Scalability**: Can now scale individual services
- **Team velocity**: 3x faster feature delivery
- **Downtime**: 99.9% → 99.99% uptime

---

*Check out the GitHub repo for complete code examples!*`,
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    tags: ["spring-boot", "microservices", "java", "architecture", "backend"],
    category: "Backend",
    publishedAt: "2025-12-15",
    updatedAt: "2025-12-20",
    readingTime: "12 min",
    author: "Gokul A",
    authorBio: "Full-Stack Developer exploring DevOps, Cloud & AI",
    featured: true,
    views: 2341,
    likes: 156,
    bookmarks: 87,
    comments: 23,
    status: "published",
    seoTitle: "Microservices with Spring Boot: Complete Architecture Guide",
    seoDescription: "Learn to build scalable microservices with Spring Boot. Real patterns, code examples, and lessons from production.",
    canonical: "https://yoursite.com/blog/microservices-spring-boot-architecture",
  },
  {
    id: "3",
    title: "AWS Cloud Cost Optimization: Cut My Bill by 60%",
    slug: "aws-cost-optimization-guide",
    excerpt:
      "Practical strategies that reduced our AWS spending from $5000 to $2000/month without sacrificing performance or reliability.",
    content: `## The Wake-Up Call

Our AWS bill hit $5,000 last month. Here's how I slashed it by 60% in 3 weeks.

## Strategy 1: Right-Sizing EC2 Instances

**Before**: Running t3.xlarge (4 vCPU, 16GB RAM) 24/7
**After**: Auto-scaling t3.medium instances
**Savings**: $890/month

\`\`\`bash
# Use AWS Cost Explorer to analyze usage
aws ce get-cost-and-usage \\
  --time-period Start=2025-11-01,End=2025-12-01 \\
  --granularity MONTHLY \\
  --metrics BlendedCost
\`\`\`

## Strategy 2: S3 Intelligent Tiering

Moved 2TB of old logs to S3 Glacier:

\`\`\`json
{
  "Rules": [{
    "Id": "Archive old logs",
    "Status": "Enabled",
    "Transitions": [{
      "Days": 90,
      "StorageClass": "GLACIER"
    }]
  }]
}
\`\`\`

**Savings**: $400/month

## Strategy 3: Reserved Instances

Committed to 1-year RDS Reserved Instances:
- **Standard price**: $1,200/month
- **Reserved price**: $720/month
- **Savings**: $480/month (40% off)

## Strategy 4: Lambda over EC2

Migrated cron jobs to Lambda:

\`\`\`python
import boto3

def lambda_handler(event, context):
    # Runs daily cleanup
    s3 = boto3.client('s3')
    # Cost: $0.20/month vs $50 EC2
\`\`\`

## The Complete Breakdown

| Service | Before | After | Savings |
|---------|--------|-------|--------|
| EC2 | $1,500 | $610 | $890 |
| RDS | $1,200 | $720 | $480 |
| S3 | $800 | $400 | $400 |
| Other | $1,500 | $1,270 | $230 |
| **Total** | **$5,000** | **$2,000** | **$3,000** |

## Tools I Used

1. **AWS Cost Explorer**: Identify expensive services
2. **CloudWatch**: Monitor actual usage
3. **Trusted Advisor**: Get optimization recommendations
4. **Terraform**: Infrastructure as code for consistency

> **Warning**: Don't optimize prematurely. Monitor first, then optimize based on data.

---

*Want my complete cost optimization checklist? Drop a comment!*`,
    coverImage:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80",
    tags: ["aws", "cloud", "cost-optimization", "devops"],
    category: "Cloud",
    publishedAt: "2025-12-10",
    updatedAt: "2025-12-10",
    readingTime: "7 min",
    author: "Gokul A",
    authorBio: "Full-Stack Developer exploring DevOps, Cloud & AI",
    featured: false,
    views: 3421,
    likes: 234,
    bookmarks: 156,
    comments: 45,
    status: "published",
    seoTitle: "AWS Cost Optimization: Reduce Cloud Spending by 60%",
    seoDescription: "Proven strategies to cut AWS costs. Real examples, code snippets, and savings breakdown from $5K to $2K/month.",
    canonical: "https://yoursite.com/blog/aws-cost-optimization-guide",
  },
  {
    id: "4",
    title: "Stock Trading Algorithm with Python & Machine Learning",
    slug: "stock-trading-algorithm-python-ml",
    excerpt:
      "Built a profitable trading bot using Python, Pandas, and ML. Here's the complete strategy, backtesting results, and lessons learned.",
    content: `## Disclaimer

⚠️ This is for educational purposes. Never invest money you can't afford to lose.

## The Strategy: Moving Average Crossover + ML

### Step 1: Data Collection

\`\`\`python
import yfinance as yf
import pandas as pd

# Fetch historical data
df = yf.download('AAPL', start='2020-01-01', end='2025-12-31')
\`\`\`

### Step 2: Technical Indicators

\`\`\`python
# Calculate moving averages
df['SMA_20'] = df['Close'].rolling(window=20).mean()
df['SMA_50'] = df['Close'].rolling(window=50).mean()
df['RSI'] = calculate_rsi(df['Close'], 14)
\`\`\`

### Step 3: ML Model

\`\`\`python
from sklearn.ensemble import RandomForestClassifier

# Features
X = df[['SMA_20', 'SMA_50', 'RSI', 'Volume']]
y = (df['Close'].shift(-1) > df['Close']).astype(int)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
\`\`\`

## Backtesting Results (2020-2025)

- **Total Return**: 127%
- **Sharpe Ratio**: 1.8
- **Max Drawdown**: -18%
- **Win Rate**: 58%

### Performance Chart

\`\`\`
Strategy vs Buy & Hold:

127% ██████████████████
100% ████████████
 SPY ████████████ (Buy & Hold: 85%)
  0% ─────────────
     2020    2025
\`\`\`

## Key Learnings

1. **Overfitting is real**: Test on unseen data
2. **Transaction costs matter**: 0.1% fee kills profits
3. **Risk management**: Never risk >2% per trade
4. **Emotions**: Automate everything

> **Reality Check**: Past performance ≠ future results. This worked in backtesting but live trading is different.

## Live Trading (Paper)

Currently running this on paper trading:
- **30 days**: +8.2% vs SPY +5.1%
- **Still testing**: Not ready for real money yet

---

*GitHub repo with full code coming soon!*`,
    coverImage:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    tags: ["python", "trading", "machine-learning", "finance"],
    category: "Finance",
    publishedAt: "2025-11-28",
    updatedAt: "2025-12-15",
    readingTime: "10 min",
    author: "Gokul A",
    authorBio: "Full-Stack Developer exploring DevOps, Cloud & AI",
    featured: false,
    views: 4521,
    likes: 312,
    bookmarks: 203,
    comments: 67,
    status: "published",
    seoTitle: "Build a Stock Trading Bot with Python & Machine Learning",
    seoDescription: "Complete guide to building a profitable trading algorithm. Python code, backtesting results, and real lessons learned.",
    canonical: "https://yoursite.com/blog/stock-trading-algorithm-python-ml",
  },
  {
    id: "5",
    title: "Kubernetes Security: Hardening Your Cluster",
    slug: "kubernetes-security-hardening",
    excerpt:
      "Production-ready Kubernetes security practices. RBAC, network policies, secrets management, and compliance automation.",
    content: `## Security is Not Optional

After a near-miss security incident, I overhauled our K8s security. Here's the complete checklist.

## 1. RBAC (Role-Based Access Control)

\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: developer
rules:
- apiGroups: [""]
  resources: ["pods", "services"]
  verbs: ["get", "list", "watch"]
  # No delete or update!
\`\`\`

## 2. Network Policies

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  # Default deny, then whitelist
\`\`\`

## 3. Secrets Management

**Never** store secrets in Git. Use Sealed Secrets:

\`\`\`bash
kubeseal --format yaml < secret.yaml > sealed-secret.yaml
\`\`\`

## 4. Pod Security Standards

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
  containers:
  - name: app
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
\`\`\`

## Security Checklist

- ✅ Enable RBAC
- ✅ Network policies
- ✅ Image scanning (Trivy)
- ✅ Secrets encryption
- ✅ Audit logging
- ✅ Pod security policies
- ✅ Regular updates
- ✅ Backup strategy

---

*Part 2 of DevOps Journey series*`,
    coverImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
    tags: ["kubernetes", "security", "devops", "devsecops"],
    category: "DevOps",
    publishedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readingTime: "9 min",
    author: "Gokul A",
    authorBio: "Full-Stack Developer exploring DevOps, Cloud & AI",
    featured: false,
    views: 892,
    likes: 67,
    bookmarks: 43,
    comments: 8,
    series: "DevOps Journey",
    seriesOrder: 2,
    status: "published",
    seoTitle: "Kubernetes Security Best Practices: Complete Hardening Guide",
    seoDescription: "Production Kubernetes security checklist. RBAC, network policies, secrets management, and compliance automation.",
    canonical: "https://yoursite.com/blog/kubernetes-security-hardening",
  },
  {
    id: "6",
    title: "Building a Real-Time Chat App with WebSockets & Redis",
    slug: "realtime-chat-websockets-redis",
    excerpt:
      "Scale a chat application to handle 10K concurrent users. WebSockets, Redis Pub/Sub, and horizontal scaling strategies.",
    content: `## The Challenge

Build a chat app that can handle thousands of concurrent connections without melting servers.

## Tech Stack

- **Backend**: Node.js + Socket.io
- **Pub/Sub**: Redis
- **Database**: MongoDB
- **Hosting**: AWS ECS

## Architecture

\`\`\`javascript
// Server setup
const io = require('socket.io')(server);
const redis = require('redis');
const pub = redis.createClient();
const sub = redis.createClient();

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    sub.subscribe(roomId);
  });
  
  socket.on('message', (data) => {
    pub.publish(data.room, JSON.stringify(data));
  });
});

sub.on('message', (channel, message) => {
  io.to(channel).emit('message', JSON.parse(message));
});
\`\`\`

## Scaling Strategy

### Problem: Sticky sessions needed

**Solution**: Redis Pub/Sub for cross-server communication

\`\`\`
User A → Server 1 → Redis Pub/Sub → Server 2 → User B
\`\`\`

## Performance Results

- **Concurrent users**: 10,000+
- **Message latency**: <50ms
- **Server cost**: $200/month
- **Uptime**: 99.95%

## Key Learnings

1. **Use Redis for state**: Don't rely on in-memory
2. **Implement backpressure**: Prevent message flooding
3. **Monitor everything**: Socket connections, Redis, DB
4. **Graceful degradation**: Fallback to polling if WS fails

---

*Full source code on GitHub*`,
    coverImage:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80",
    tags: ["nodejs", "websockets", "redis", "real-time", "scaling"],
    category: "Backend",
    publishedAt: "2025-11-15",
    updatedAt: "2025-11-20",
    readingTime: "11 min",
    author: "Gokul A",
    authorBio: "Full-Stack Developer exploring DevOps, Cloud & AI",
    featured: false,
    views: 1834,
    likes: 143,
    bookmarks: 92,
    comments: 19,
    status: "published",
  },
];

export const getPostBySlug = (slug) => demoPosts.find((post) => post.slug === slug);

export const getPostsBySeries = (series) => 
  demoPosts.filter((post) => post.series === series).sort((a, b) => a.seriesOrder - b.seriesOrder);

export const getPostsByCategory = (category) =>
  demoPosts.filter((post) => post.category === category);

export const getTrendingPosts = () =>
  [...demoPosts].sort((a, b) => b.views - a.views).slice(0, 5);

export const getPopularTags = () => {
  const tagCount = {};
  demoPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
};
