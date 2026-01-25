/**
 * Seed Journey Roadmap Data
 * 
 * Seeds Firestore with complete Cloud/DevOps/Security Engineering Journey
 * Based on comprehensive 6-phase roadmap
 * 
 * Run: node scripts/seed-journey-roadmap.js
 */

/* eslint-disable no-undef */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Firebase config
const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, '../firebase-service-account.json'), 'utf8')
);

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || serviceAccount.project_id,
  authDomain: `${serviceAccount.project_id}.firebaseapp.com`,
  projectId: serviceAccount.project_id,
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// JOURNEY DATA
// ============================================================================

const journey = {
  id: 'cloud-devops-security-roadmap',
  title: 'Cloud/DevOps/Security Engineering Roadmap',
  description: 'Comprehensive learning path from Linux foundations to advanced cloud security, covering AWS, Kubernetes, DevSecOps, and SRE practices.',
  icon: 'cloud',
  color: 'blue',
  isPublic: true,
  order: 1,
  overallProgress: 0,
  totalPhases: 6,
  completedPhases: 0,
};

// ============================================================================
// PHASES DATA
// ============================================================================

const phases = [
  {
    id: 'phase-1-foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 1 — Foundations',
    status: 'Planned',
    order: 1,
    focusAreas: ['Linux', 'Networking', 'Programming', 'Git'],
    modulesCompleted: 0,
    totalModules: 4,
  },
  {
    id: 'phase-2-cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 2 — Cloud Engineering',
    status: 'Planned',
    order: 2,
    focusAreas: ['AWS Core Services', 'VPC', 'IAM', 'Monitoring'],
    modulesCompleted: 0,
    totalModules: 2,
  },
  {
    id: 'phase-3-iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 3 — Infrastructure as Code',
    status: 'Planned',
    order: 3,
    focusAreas: ['Terraform', 'CloudFormation', 'Policy-as-Code'],
    modulesCompleted: 0,
    totalModules: 1,
  },
  {
    id: 'phase-4-devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 4 — DevOps & Delivery',
    status: 'Planned',
    order: 4,
    focusAreas: ['CI/CD', 'Docker', 'Kubernetes'],
    modulesCompleted: 0,
    totalModules: 3,
  },
  {
    id: 'phase-5-security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 5 — Cloud Security & DevSecOps',
    status: 'Planned',
    order: 5,
    focusAreas: ['Security Architecture', 'DevSecOps Tooling', 'AWS Security'],
    modulesCompleted: 0,
    totalModules: 3,
  },
  {
    id: 'phase-6-sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 6 — SRE, Incident Response & Governance',
    status: 'Planned',
    order: 6,
    focusAreas: ['SRE', 'Incident Response', 'Compliance', 'FinOps'],
    modulesCompleted: 0,
    totalModules: 3,
  },
];

// ============================================================================
// ENTRIES DATA
// ============================================================================

const entries = [
  // ========== PHASE 1: FOUNDATIONS ==========
  {
    id: 'entry-linux-fundamentals',
    phaseId: 'phase-1-foundations',
    title: 'Linux System Administration',
    domain: 'Linux',
    status: 'Planned',
    type: 'project',
    description: 'Master Linux filesystems, users/groups/permissions, systemd, bash scripting, package management, cgroups/namespaces, and performance monitoring (memory, CPU, disk I/O, load average, OOM killer).',
    techStack: ['Linux', 'Bash', 'systemd', 'strace', 'lsof', 'htop', 'vmstat', 'iostat'],
    isPublic: true,
    order: 1,
    githubLink: null,
    links: [],
    artifacts: [],
  },
  {
    id: 'cert-linux-lfs101x',
    phaseId: 'phase-1-foundations',
    title: 'Linux Foundation LFS101x',
    domain: 'Linux',
    status: 'Planned',
    type: 'certification',
    description: 'Mandatory baseline Linux certification covering essential system administration skills.',
    techStack: ['Linux'],
    isPublic: true,
    order: 2,
    githubLink: null,
    certificateImage: null,
    issuer: 'Linux Foundation',
    issueDate: null,
    credentialLink: null,
  },
  {
    id: 'entry-networking',
    phaseId: 'phase-1-foundations',
    title: 'Networking Deep Dive',
    domain: 'Networking',
    status: 'Planned',
    type: 'project',
    description: 'OSI/TCP-IP models, CIDR/subnets/routing, DNS internals, NAT/firewalls, TLS handshake, load balancing (L4 vs L7), reverse proxies (Nginx/Envoy), connection pooling, and BGP basics.',
    techStack: ['TCP/IP', 'DNS', 'TLS', 'iptables', 'tcpdump', 'Nginx', 'Envoy'],
    isPublic: true,
    order: 3,
    githubLink: null,
  },
  {
    id: 'cert-cisco-networking',
    phaseId: 'phase-1-foundations',
    title: 'Cisco Networking Basics',
    domain: 'Networking',
    status: 'Planned',
    type: 'certification',
    description: 'Cisco NetAcad badge covering networking fundamentals.',
    techStack: ['Networking'],
    isPublic: true,
    order: 4,
    certificateImage: null,
    issuer: 'Cisco',
    issueDate: null,
  },
  {
    id: 'entry-programming',
    phaseId: 'phase-1-foundations',
    title: 'Programming for DevOps',
    domain: 'Programming',
    status: 'Planned',
    type: 'project',
    description: 'Python (automation, security tooling) and Go (cloud-native tooling). REST APIs, concurrency, error handling, structured logging, unit/integration testing.',
    techStack: ['Python', 'Go', 'REST APIs', 'Testing'],
    isPublic: true,
    order: 5,
    githubLink: null,
  },
  {
    id: 'entry-git-version-control',
    phaseId: 'phase-1-foundations',
    title: 'Git & Version Control Workflows',
    domain: 'Git',
    status: 'Planned',
    type: 'project',
    description: 'Branching strategies, PR-based workflows, semantic versioning, release and rollback flows.',
    techStack: ['Git', 'GitHub', 'GitLab'],
    isPublic: true,
    order: 6,
    githubLink: null,
  },
  {
    id: 'cert-github-foundations',
    phaseId: 'phase-1-foundations',
    title: 'GitHub Foundations',
    domain: 'Git',
    status: 'Planned',
    type: 'certification',
    description: 'Official GitHub certification covering Git fundamentals and workflows.',
    techStack: ['Git', 'GitHub'],
    isPublic: true,
    order: 7,
    certificateImage: null,
    issuer: 'GitHub',
    issueDate: null,
  },

  // ========== PHASE 2: CLOUD ENGINEERING ==========
  {
    id: 'entry-aws-fundamentals',
    phaseId: 'phase-2-cloud',
    title: 'AWS Cloud Fundamentals',
    domain: 'AWS',
    status: 'Planned',
    type: 'project',
    description: 'Shared Responsibility Model, Regions/AZs, Well-Architected Framework, multi-account strategy, AWS Landing Zone, environment separation, centralized logging.',
    techStack: ['AWS', 'Organizations', 'Landing Zone', 'CloudTrail', 'Config'],
    isPublic: true,
    order: 8,
    githubLink: null,
  },
  {
    id: 'cert-aws-solutions-architect',
    phaseId: 'phase-2-cloud',
    title: 'AWS Solutions Architect – Associate',
    domain: 'AWS',
    status: 'Planned',
    type: 'certification',
    description: 'Mandatory AWS certification covering core services, architecture design, and best practices.',
    techStack: ['AWS'],
    isPublic: true,
    order: 9,
    certificateImage: null,
    issuer: 'Amazon Web Services',
    issueDate: null,
    credentialLink: null,
  },
  {
    id: 'entry-aws-core-services',
    phaseId: 'phase-2-cloud',
    title: 'AWS Core Services Deep Dive',
    domain: 'AWS',
    status: 'Planned',
    type: 'project',
    description: 'EC2, Lambda, VPC/subnets/route tables, ALB/NLB, Security Groups/NACLs, S3/EBS/EFS, RDS/DynamoDB, IAM (roles, policies, STS, least privilege), CloudWatch, CloudTrail.',
    techStack: ['EC2', 'Lambda', 'VPC', 'S3', 'RDS', 'IAM', 'CloudWatch'],
    isPublic: true,
    order: 10,
    githubLink: null,
  },

  // ========== PHASE 3: INFRASTRUCTURE AS CODE ==========
  {
    id: 'entry-terraform-iac',
    phaseId: 'phase-3-iac',
    title: 'Terraform Infrastructure as Code',
    domain: 'Terraform',
    status: 'Planned',
    type: 'project',
    description: 'State management, modules/workspaces, drift detection, secrets handling, policy-as-code (OPA), SBOM basics, dependency pinning, artifact provenance (SLSA).',
    techStack: ['Terraform', 'CloudFormation', 'OPA', 'Checkov', 'tfsec'],
    isPublic: true,
    order: 11,
    githubLink: null,
  },
  {
    id: 'cert-terraform-associate',
    phaseId: 'phase-3-iac',
    title: 'HashiCorp Terraform Associate',
    domain: 'Terraform',
    status: 'Planned',
    type: 'certification',
    description: 'Official Terraform certification covering IaC fundamentals and best practices.',
    techStack: ['Terraform'],
    isPublic: true,
    order: 12,
    certificateImage: null,
    issuer: 'HashiCorp',
    issueDate: null,
  },

  // ========== PHASE 4: DEVOPS & DELIVERY ==========
  {
    id: 'entry-cicd-pipelines',
    phaseId: 'phase-4-devops',
    title: 'CI/CD Pipeline Engineering',
    domain: 'CI/CD',
    status: 'Planned',
    type: 'project',
    description: 'Secure pipelines with approval gates, artifact management, rollbacks. Jenkins, GitHub Actions, GitLab CI.',
    techStack: ['Jenkins', 'GitHub Actions', 'GitLab CI', 'ArgoCD'],
    isPublic: true,
    order: 13,
    githubLink: null,
  },
  {
    id: 'entry-docker-containers',
    phaseId: 'phase-4-devops',
    title: 'Docker Containerization',
    domain: 'Docker',
    status: 'Planned',
    type: 'project',
    description: 'Image layers, image hardening, vulnerability scanning, supply chain risks, Docker Compose, ECR/Docker Hub.',
    techStack: ['Docker', 'Docker Compose', 'Trivy', 'ECR'],
    isPublic: true,
    order: 14,
    githubLink: null,
  },
  {
    id: 'entry-kubernetes-deep-dive',
    phaseId: 'phase-4-devops',
    title: 'Kubernetes Deep Dive',
    domain: 'Kubernetes',
    status: 'Planned',
    type: 'project',
    description: 'Control plane, etcd, scheduler, RBAC, admission controllers, CRDs/operators, CNI (Calico/Cilium), persistent volumes/CSI, service mesh basics.',
    techStack: ['Kubernetes', 'Helm', 'RBAC', 'Calico', 'Cilium', 'Istio'],
    isPublic: true,
    order: 15,
    githubLink: null,
  },
  {
    id: 'cert-cka',
    phaseId: 'phase-4-devops',
    title: 'Certified Kubernetes Administrator (CKA)',
    domain: 'Kubernetes',
    status: 'Planned',
    type: 'certification',
    description: 'CNCF certification for Kubernetes administration skills.',
    techStack: ['Kubernetes'],
    isPublic: true,
    order: 16,
    certificateImage: null,
    issuer: 'Cloud Native Computing Foundation',
    issueDate: null,
  },
  {
    id: 'cert-cks',
    phaseId: 'phase-4-devops',
    title: 'Certified Kubernetes Security Specialist (CKS)',
    domain: 'Kubernetes',
    status: 'Planned',
    type: 'certification',
    description: 'Mandatory CNCF certification for Kubernetes security expertise.',
    techStack: ['Kubernetes', 'Security'],
    isPublic: true,
    order: 17,
    certificateImage: null,
    issuer: 'Cloud Native Computing Foundation',
    issueDate: null,
  },

  // ========== PHASE 5: CLOUD SECURITY & DEVSECOPS ==========
  {
    id: 'entry-security-architecture',
    phaseId: 'phase-5-security',
    title: 'Security Architecture & Threat Modeling',
    domain: 'Security',
    status: 'Planned',
    type: 'project',
    description: 'Threat modeling (STRIDE, DREAD), attack surface analysis, Zero Trust Architecture, software architecture (monolith vs microservices).',
    techStack: ['STRIDE', 'DREAD', 'Zero Trust', 'Threat Modeling'],
    isPublic: true,
    order: 18,
    githubLink: null,
  },
  {
    id: 'entry-devsecops-tooling',
    phaseId: 'phase-5-security',
    title: 'DevSecOps Tooling & Automation',
    domain: 'DevSecOps',
    status: 'Planned',
    type: 'project',
    description: 'Snyk, Trivy, SonarQube, Checkov/tfsec/Terrascan, OPA/Gatekeeper/Kyverno, Falco, HashiCorp Vault. Security maturity model implementation.',
    techStack: ['Snyk', 'Trivy', 'SonarQube', 'OPA', 'Falco', 'Vault'],
    isPublic: true,
    order: 19,
    githubLink: null,
  },
  {
    id: 'cert-devsecops-foundation',
    phaseId: 'phase-5-security',
    title: 'DevSecOps Foundation',
    domain: 'DevSecOps',
    status: 'Planned',
    type: 'certification',
    description: 'PeopleCert certification for DevSecOps fundamentals.',
    techStack: ['DevSecOps'],
    isPublic: true,
    order: 20,
    certificateImage: null,
    issuer: 'PeopleCert',
    issueDate: null,
  },
  {
    id: 'entry-aws-security',
    phaseId: 'phase-5-security',
    title: 'AWS Security Advanced',
    domain: 'AWS Security',
    status: 'Planned',
    type: 'project',
    description: 'KMS, Secrets Manager, GuardDuty, Security Hub, WAF/Shield, Organizations/SCPs, IAM Identity Center (SSO), SAML/OIDC federation.',
    techStack: ['KMS', 'GuardDuty', 'Security Hub', 'WAF', 'SCPs', 'IAM'],
    isPublic: true,
    order: 21,
    githubLink: null,
  },
  {
    id: 'cert-aws-security-specialty',
    phaseId: 'phase-5-security',
    title: 'AWS Certified Security – Specialty',
    domain: 'AWS Security',
    status: 'Planned',
    type: 'certification',
    description: 'Advanced AWS security certification covering threat detection, incident response, and compliance.',
    techStack: ['AWS', 'Security'],
    isPublic: true,
    order: 22,
    certificateImage: null,
    issuer: 'Amazon Web Services',
    issueDate: null,
  },

  // ========== PHASE 6: SRE, INCIDENT RESPONSE & GOVERNANCE ==========
  {
    id: 'entry-sre-observability',
    phaseId: 'phase-6-sre',
    title: 'SRE & Observability',
    domain: 'SRE',
    status: 'Planned',
    type: 'project',
    description: 'SLIs/SLOs/SLAs, error budgets, postmortems, metrics vs logs vs traces, RED/USE/Golden Signals, alert fatigue reduction.',
    techStack: ['Prometheus', 'Grafana', 'ELK', 'Datadog', 'SLOs'],
    isPublic: true,
    order: 23,
    githubLink: null,
  },
  {
    id: 'entry-incident-response',
    phaseId: 'phase-6-sre',
    title: 'Incident Response & Chaos Engineering',
    domain: 'Incident Response',
    status: 'Planned',
    type: 'project',
    description: 'Log forensics, MITRE ATT&CK, IR playbooks, chaos engineering basics, game days, failure injection.',
    techStack: ['MITRE ATT&CK', 'Splunk', 'Chaos Engineering', 'Gremlin'],
    isPublic: true,
    order: 24,
    githubLink: null,
  },
  {
    id: 'cert-btl1',
    phaseId: 'phase-6-sre',
    title: 'Blue Team Level 1 (BTL1)',
    domain: 'Incident Response',
    status: 'Planned',
    type: 'certification',
    description: 'Optional certification for defensive security and incident response.',
    techStack: ['Incident Response', 'Blue Team'],
    isPublic: true,
    order: 25,
    certificateImage: null,
    issuer: 'Security Blue Team',
    issueDate: null,
  },
  {
    id: 'entry-compliance-finops',
    phaseId: 'phase-6-sre',
    title: 'Compliance & FinOps',
    domain: 'Governance',
    status: 'Planned',
    type: 'project',
    description: 'SOC 2, ISO 27001, PCI-DSS, cost as security/reliability factor. AWS Cost Explorer, Budgets, SCP-based cost guardrails.',
    techStack: ['SOC 2', 'ISO 27001', 'AWS Cost Explorer', 'FinOps'],
    isPublic: true,
    order: 26,
    githubLink: null,
  },
  {
    id: 'cert-finops',
    phaseId: 'phase-6-sre',
    title: 'FinOps Certified Practitioner',
    domain: 'FinOps',
    status: 'Planned',
    type: 'certification',
    description: 'FinOps Foundation certification for cloud cost management.',
    techStack: ['FinOps', 'Cloud Economics'],
    isPublic: true,
    order: 27,
    certificateImage: null,
    issuer: 'FinOps Foundation',
    issueDate: null,
  },
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedJourneyRoadmap() {
  console.log('🚀 Starting journey roadmap seed...\n');

  try {
    // 1. Create Journey
    console.log('📦 Creating journey...');
    const journeyData = {
      ...journey,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const journeyRef = await addDoc(collection(db, 'journeys'), journeyData);
    console.log(`✓ Journey created: ${journeyRef.id}\n`);

    // 2. Create Phases
    console.log('📂 Creating phases...');
    for (const phase of phases) {
      const phaseData = {
        ...phase,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const phaseRef = await addDoc(collection(db, 'journeyPhases'), phaseData);
      console.log(`  ✓ Phase ${phase.order}: ${phase.title} (${phaseRef.id})`);
    }
    console.log();

    // 3. Create Entries
    console.log('📝 Creating entries...');
    for (const entry of entries) {
      const entryData = {
        ...entry,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const entryRef = await addDoc(collection(db, 'journeyEntries'), entryData);
      console.log(`  ✓ ${entry.type === 'certification' ? '🏆' : '📋'} ${entry.title} (${entryRef.id})`);
    }
    console.log();

    console.log('✅ Journey roadmap seeded successfully!');
    console.log(`
📊 Summary:
   - 1 Journey created
   - ${phases.length} Phases created
   - ${entries.length} Entries created (${entries.filter(e => e.type === 'certification').length} certifications, ${entries.filter(e => e.type !== 'certification').length} projects)
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding journey roadmap:', error);
    process.exit(1);
  }
}

seedJourneyRoadmap();
