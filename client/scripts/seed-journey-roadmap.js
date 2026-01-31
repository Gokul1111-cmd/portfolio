/* eslint-env node */
import { admin, adminDb } from '../lib/firebase-admin.js';

// ============================================================================
// JOURNEY DATA
// ============================================================================

const journey = {
  id: 'cloud-devops-security-roadmap',
  title: 'Cloud/DevOps/Security Engineering Roadmap',
  description:
    'A comprehensive 7-phase engineering journey covering Cloud fundamentals, Infrastructure as Code, DevOps practices, DevSecOps, SRE/Incident Response, and Documentation. Designed for engineers transitioning into cloud-native and security-focused roles.',
  totalPhases: 7,
  isPublic: true,
  status: 'In Progress',
};

// ============================================================================
// PHASES DATA (7 Phases)
// ============================================================================

const phases = [
  {
    id: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 1: Foundations (Linux, Networking, Programming, Git)',
    description:
      'Master Linux system administration, performance tuning, security hardening, networking fundamentals, programming for automation (Python/Go), and version control workflows.',
    order: 1,
    status: 'In Progress',
    totalModules: 18,
    focusAreas: ['Linux Administration', 'Networking', 'Python', 'Go', 'Git', 'Version Control'],
    isPublic: true,
  },
  {
    id: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 2: Cloud Engineering (AWS)',
    description:
      'Learn AWS cloud fundamentals, core services (EC2, S3, VPC, IAM), multi-account landing zones, security best practices, and monitoring.',
    order: 2,
    status: 'Planned',
    totalModules: 7,
    focusAreas: ['AWS Fundamentals', 'VPC', 'IAM', 'Multi-Account Architecture', 'Security'],
    isPublic: true,
  },
  {
    id: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 3: Infrastructure as Code (Terraform)',
    description:
      'Master Terraform core concepts, state management, modules, drift detection, policy-as-code with OPA, and supply chain security.',
    order: 3,
    status: 'Planned',
    totalModules: 9,
    focusAreas: ['Terraform', 'State Management', 'Policy-as-Code', 'Supply Chain Security'],
    isPublic: true,
  },
  {
    id: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 4: DevOps & Delivery (CI/CD, Docker, Kubernetes)',
    description:
      'Build secure CI/CD pipelines, master containerization with Docker, and Kubernetes orchestration including deep networking, storage, RBAC, and GitOps workflows.',
    order: 4,
    status: 'Planned',
    totalModules: 11,
    focusAreas: ['CI/CD', 'Docker', 'Kubernetes', 'GitOps', 'Blue/Green Deployment', 'Canary Deployment'],
    isPublic: true,
  },
  {
    id: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 5: DevSecOps & Cloud Security',
    description:
      'Implement threat modeling, DevSecOps tooling, container security scanning, runtime security, secrets management, admission control policies, and AWS security services.',
    order: 5,
    status: 'Planned',
    totalModules: 11,
    focusAreas: ['Threat Modeling', 'DevSecOps', 'Container Security', 'AWS Security', 'Secrets Management'],
    isPublic: true,
  },
  {
    id: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 6: SRE, Incident Response & FinOps',
    description:
      'Master observability (metrics, logs, traces), SLO/SLA definitions, incident response playbooks, chaos engineering simulations, and FinOps cost optimization.',
    order: 6,
    status: 'Planned',
    totalModules: 14,
    focusAreas: ['Observability', 'SLO/SLA', 'Incident Response', 'Chaos Engineering', 'FinOps'],
    isPublic: true,
  },
  {
    id: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Phase 7: Documentation & Communication',
    description:
      'Create architecture decision records (ADRs), system documentation, runbooks, postmortems, security reports, and develop executive communication skills.',
    order: 7,
    status: 'Planned',
    totalModules: 10,
    focusAreas: ['ADRs', 'System Documentation', 'Runbooks', 'Postmortems', 'Technical Writing'],
    isPublic: true,
  },
];

// ============================================================================
// ENTRIES DATA
// ============================================================================

const entries = [
  // ========== PHASE 1: FOUNDATIONS ==========
  {
    id: 'entry-linux-admin',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Linux System Administration',
    domain: 'Linux Administration',
    status: 'Planned',
    type: 'exercise',
    description:
      'Master Linux filesystems, process management, user/group administration, permissions, and essential command-line tools.',
    techStack: ['Linux', 'Bash', 'systemd'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-linux-performance',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Linux Performance Tuning',
    domain: 'Linux Administration',
    status: 'Planned',
    type: 'exercise',
    description:
      'Learn performance monitoring, tuning CPU/memory/disk I/O, understanding load averages, RSS/VSZ metrics, and OOM killer behavior.',
    techStack: ['Linux', 'top', 'htop', 'vmstat', 'iostat'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-linux-hardening',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Linux Security Hardening',
    domain: 'Linux Administration',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement security best practices including SELinux/AppArmor, firewall configuration, SSH hardening, and audit logging.',
    techStack: ['SELinux', 'AppArmor', 'iptables', 'fail2ban'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-networking-fundamentals',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Networking Fundamentals',
    domain: 'Networking',
    status: 'Planned',
    type: 'exercise',
    description:
      'Understand OSI model, TCP/IP, routing, DNS, DHCP, VLANs, and troubleshooting with tcpdump/wireshark.',
    techStack: ['TCP/IP', 'DNS', 'DHCP', 'tcpdump', 'wireshark'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-networking-project',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Multi-Tier Network Design Project',
    domain: 'Networking',
    status: 'Planned',
    type: 'project',
    description:
      'Design and implement a multi-tier network with proper segmentation, routing, firewall rules, and monitoring.',
    techStack: ['Networking', 'VLANs', 'Firewall', 'Monitoring'],
    isPublic: true,
    order: 5,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-python-automation',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Python for Automation',
    domain: 'Python',
    status: 'Planned',
    type: 'exercise',
    description:
      'Learn Python basics, scripting for system automation, working with APIs, file manipulation, and error handling.',
    techStack: ['Python', 'Requests', 'JSON', 'APIs'],
    isPublic: true,
    order: 6,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-go-basics',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Go Programming Basics',
    domain: 'Go',
    status: 'Planned',
    type: 'exercise',
    description:
      'Introduction to Go for building CLI tools, understanding concurrency, and creating microservices.',
    techStack: ['Go', 'CLI', 'Concurrency'],
    isPublic: true,
    order: 7,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-git-fundamentals',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Git Version Control',
    domain: 'Git',
    status: 'Planned',
    type: 'exercise',
    description:
      'Master Git workflows, branching strategies, merge vs rebase, pull requests, and collaboration best practices.',
    techStack: ['Git', 'GitHub', 'GitLab'],
    isPublic: true,
    order: 8,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-lfs101x',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'LFS101x: Introduction to Linux',
    domain: 'Linux',
    status: 'Planned',
    type: 'certification',
    description: 'Linux Foundation introductory course covering Linux essentials.',
    techStack: ['Linux'],
    isPublic: true,
    order: 9,
    links: [{ label: 'Linux Foundation', url: 'https://www.linuxfoundation.org/' }],
    artifacts: [],
    metadata: {
      issuer: 'Linux Foundation',
      issueDate: null,
    },
  },
  {
    id: 'entry-github-foundations',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'GitHub Foundations Certification',
    domain: 'Git',
    status: 'Planned',
    type: 'certification',
    description: 'GitHub certification covering repositories, workflows, and collaboration.',
    techStack: ['Git', 'GitHub'],
    isPublic: true,
    order: 10,
    links: [{ label: 'GitHub Certifications', url: 'https://github.com/certifications' }],
    artifacts: [],
    metadata: {
      issuer: 'GitHub',
      issueDate: null,
    },
  },
  {
    id: 'entry-syscall-tracing-lab',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'System Call Tracing Lab',
    domain: 'Linux',
    status: 'Planned',
    type: 'lab',
    description: 'Use strace and ltrace to trace system calls and library calls for debugging and security analysis.',
    techStack: ['strace', 'ltrace', 'Linux'],
    isPublic: true,
    order: 11,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-go-concurrency-lab',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Go Concurrency Lab',
    domain: 'Go',
    status: 'Planned',
    type: 'lab',
    description: 'Hands-on lab exploring Go goroutines, channels, and concurrent patterns.',
    techStack: ['Go', 'Concurrency'],
    isPublic: true,
    order: 12,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-linux-kernel-internals',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Linux Kernel Internals Lab',
    domain: 'Linux Administration',
    status: 'Planned',
    type: 'lab',
    description:
      'Deep dive into Linux kernel internals including syscalls, context switching, kernel scheduling, procfs and sysfs analysis.',
    techStack: ['Linux', 'strace', 'perf', 'procfs', 'sysfs'],
    isPublic: true,
    order: 13,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-linux-cgroups-namespaces',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Cgroups & Namespaces Lab',
    domain: 'Linux Administration',
    status: 'Planned',
    type: 'lab',
    description:
      'Explore container isolation mechanisms using Linux cgroups and namespaces for resource management and process isolation.',
    techStack: ['Linux', 'cgroups', 'namespaces', 'docker'],
    isPublic: true,
    order: 14,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-fd-exhaustion-lab',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'File Descriptor Exhaustion Lab',
    domain: 'Linux Administration',
    status: 'Planned',
    type: 'lab',
    description:
      'Analyze and mitigate file descriptor exhaustion scenarios, understanding ulimit, lsof, and procfs monitoring.',
    techStack: ['Linux', 'lsof', 'ulimit', 'procfs'],
    isPublic: true,
    order: 15,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-tls-handshake-analysis',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'TLS Handshake Analysis Lab',
    domain: 'Networking',
    status: 'Planned',
    type: 'lab',
    description:
      'Deep dive into TLS/SSL handshake process, certificate chain validation, cipher suite negotiation, and packet inspection.',
    techStack: ['TLS', 'OpenSSL', 'Wireshark'],
    isPublic: true,
    order: 16,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-reverse-proxy-lab',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Reverse Proxy Behavior Lab',
    domain: 'Networking',
    status: 'Planned',
    type: 'lab',
    description:
      'Analyze reverse proxy behavior with Nginx and Envoy, traffic routing, header manipulation, and load distribution.',
    techStack: ['Nginx', 'Envoy', 'HTTP', 'TLS'],
    isPublic: true,
    order: 17,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-l4-l7-loadbalancer',
    phaseId: 'foundations',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'L4 vs L7 Load Balancer Lab',
    domain: 'Networking',
    status: 'Planned',
    type: 'lab',
    description:
      'Compare Layer 4 (TCP/UDP) and Layer 7 (HTTP/HTTPS) load balancing behavior, performance, and use cases.',
    techStack: ['HAProxy', 'Nginx', 'AWS ELB'],
    isPublic: true,
    order: 18,
    links: [],
    artifacts: [],
  },

  // ========== PHASE 2: CLOUD ==========
  {
    id: 'entry-aws-fundamentals',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS Cloud Fundamentals',
    domain: 'AWS Fundamentals',
    status: 'Planned',
    type: 'exercise',
    description:
      'Learn AWS global infrastructure, core services (EC2, S3, RDS, Lambda), pricing models, and the Well-Architected Framework.',
    techStack: ['AWS', 'EC2', 'S3', 'RDS', 'Lambda'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-aws-vpc-project',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS VPC Design Project',
    domain: 'VPC',
    status: 'Planned',
    type: 'project',
    description:
      'Design and implement a production-ready VPC with public/private subnets, NAT gateways, route tables, and security groups.',
    techStack: ['AWS', 'VPC', 'Networking', 'Security Groups'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-iam-attack-simulation',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'IAM Attack Simulation Project',
    domain: 'IAM',
    status: 'Planned',
    type: 'project',
    description:
      'Simulate common IAM misconfigurations and attacks, then implement detection and remediation strategies.',
    techStack: ['AWS', 'IAM', 'CloudTrail', 'Security'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-multi-account-landing-zone',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Multi-Account Landing Zone Project',
    domain: 'Multi-Account Architecture',
    status: 'Planned',
    type: 'project',
    description:
      'Design and deploy a multi-account AWS architecture using AWS Organizations, Control Tower, and Service Control Policies (SCPs).',
    techStack: ['AWS', 'Organizations', 'Control Tower', 'SCPs'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-aws-monitoring',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS Monitoring and Logging',
    domain: 'Security',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement comprehensive monitoring with CloudWatch, X-Ray, and logging with CloudTrail for security and compliance.',
    techStack: ['AWS', 'CloudWatch', 'X-Ray', 'CloudTrail'],
    isPublic: true,
    order: 5,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-aws-solutions-architect',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS Certified Solutions Architect - Associate',
    domain: 'AWS Fundamentals',
    status: 'Planned',
    type: 'certification',
    description:
      'Industry-recognized certification validating expertise in designing distributed systems on AWS.',
    techStack: ['AWS'],
    isPublic: true,
    order: 6,
    links: [{ label: 'AWS Certification', url: 'https://aws.amazon.com/certification/' }],
    artifacts: [],
    metadata: {
      issuer: 'Amazon Web Services',
      issueDate: null,
    },
  },
  {
    id: 'entry-compliance-drift-detection',
    phaseId: 'cloud',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Compliance Drift Detection Lab',
    domain: 'Security',
    status: 'Planned',
    type: 'lab',
    description:
      'Build automated compliance monitoring using AWS Config and EventBridge to detect configuration drift.',
    techStack: ['AWS Config', 'EventBridge', 'Lambda'],
    isPublic: true,
    order: 7,
    links: [],
    artifacts: [],
  },

  // ========== PHASE 3: IAC ==========
  {
    id: 'entry-terraform-core',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Terraform Core Concepts',
    domain: 'Terraform',
    status: 'Planned',
    type: 'exercise',
    description:
      'Master Terraform basics: providers, resources, variables, outputs, state management, and workspace organization.',
    techStack: ['Terraform', 'HCL', 'AWS'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-state-corruption-lab',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'State Corruption Simulation Lab',
    domain: 'State Management',
    status: 'Planned',
    type: 'lab',
    description:
      'Simulate Terraform state corruption scenarios and practice recovery techniques using state backups and imports.',
    techStack: ['Terraform', 'State Management'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-secret-leakage-lab',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Secret Leakage Detection Lab',
    domain: 'Supply Chain Security',
    status: 'Planned',
    type: 'lab',
    description:
      'Identify and prevent secrets in Terraform state files and code using tools like tfsec and secret scanning.',
    techStack: ['Terraform', 'tfsec', 'git-secrets'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-opa-policy-project',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'OPA Policy-as-Code Project',
    domain: 'Policy-as-Code',
    status: 'Planned',
    type: 'project',
    description:
      'Implement Open Policy Agent (OPA) policies to enforce infrastructure compliance, cost controls, and security standards.',
    techStack: ['OPA', 'Rego', 'Terraform'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-terraform-cert',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'HashiCorp Certified: Terraform Associate',
    domain: 'Terraform',
    status: 'Planned',
    type: 'certification',
    description:
      'Official HashiCorp certification validating Terraform skills for infrastructure automation.',
    techStack: ['Terraform'],
    isPublic: true,
    order: 5,
    links: [{ label: 'HashiCorp Certifications', url: 'https://www.hashicorp.com/certification' }],
    artifacts: [],
    metadata: {
      issuer: 'HashiCorp',
      issueDate: null,
    },
  },
  {
    id: 'entry-failure-scenarios',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'IaC Failure Scenarios Lab',
    domain: 'Terraform',
    status: 'Planned',
    type: 'lab',
    description:
      'Practice handling common Terraform failures: API rate limits, resource dependencies, and partial apply failures.',
    techStack: ['Terraform', 'Troubleshooting'],
    isPublic: true,
    order: 6,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-reproducible-builds',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Reproducible Builds Project',
    domain: 'Security',
    status: 'Planned',
    type: 'project',
    description:
      'Build reproducible and verifiable artifacts ensuring bit-for-bit consistency across different build environments.',
    techStack: ['Docker', 'SLSA', 'Cosign', 'GitHub Actions'],
    isPublic: true,
    order: 7,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-dependency-pinning',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Dependency Pinning Exercise',
    domain: 'Security',
    status: 'Planned',
    type: 'exercise',
    description:
      'Master dependency pinning strategies and integrity verification across package managers for supply chain security.',
    techStack: ['npm', 'pip', 'sigstore'],
    isPublic: true,
    order: 8,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-artifact-provenance',
    phaseId: 'iac',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Artifact Provenance Pipeline',
    domain: 'Security',
    status: 'Planned',
    type: 'project',
    description:
      'End-to-end artifact provenance pipeline implementing SLSA framework with Cosign signing and GitHub Actions attestation.',
    techStack: ['SLSA', 'Cosign', 'GitHub Actions'],
    isPublic: true,
    order: 9,
    links: [],
    artifacts: [],
  },

  // ========== PHASE 4: DEVOPS ==========
  {
    id: 'entry-secure-cicd',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Secure CI/CD Pipeline Design',
    domain: 'CI/CD',
    status: 'Planned',
    type: 'exercise',
    description:
      'Build secure CI/CD pipelines with secret management, artifact signing, SBOM generation, and vulnerability scanning.',
    techStack: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'Trivy'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-blue-green-deployment',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Blue/Green Deployment Project',
    domain: 'CI/CD',
    status: 'Planned',
    type: 'project',
    description:
      'Implement blue/green deployment strategy with automated rollback capabilities for zero-downtime releases.',
    techStack: ['Kubernetes', 'AWS', 'Terraform'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-canary-deployment',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Canary Deployment Lab',
    domain: 'CI/CD',
    status: 'Planned',
    type: 'lab',
    description:
      'Implement progressive canary deployments with traffic splitting and automated rollback based on metrics.',
    techStack: ['Kubernetes', 'Istio', 'Prometheus'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-docker-hardening',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Docker Security Hardening',
    domain: 'Docker',
    status: 'Planned',
    type: 'exercise',
    description:
      'Harden Docker containers with non-root users, minimal base images, multi-stage builds, and security scanning.',
    techStack: ['Docker', 'Trivy', 'Distroless'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-kubernetes-deep-dive',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Kubernetes Deep Dive',
    domain: 'Kubernetes',
    status: 'Planned',
    type: 'exercise',
    description:
      'Master Kubernetes architecture, networking (CNI, Services, Ingress), storage (PV, PVC, StorageClasses), and RBAC.',
    techStack: ['Kubernetes', 'CNI', 'RBAC', 'Storage'],
    isPublic: true,
    order: 5,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-gitops-workflow',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'GitOps with ArgoCD/Flux',
    domain: 'GitOps',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement GitOps workflows using ArgoCD or Flux for declarative continuous delivery to Kubernetes.',
    techStack: ['ArgoCD', 'Flux', 'Kubernetes', 'GitOps'],
    isPublic: true,
    order: 6,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-cka-cert',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Certified Kubernetes Administrator (CKA)',
    domain: 'Kubernetes',
    status: 'Planned',
    type: 'certification',
    description:
      'CNCF certification demonstrating Kubernetes administration skills including cluster management and troubleshooting.',
    techStack: ['Kubernetes'],
    isPublic: true,
    order: 7,
    links: [{ label: 'CNCF Certifications', url: 'https://www.cncf.io/certification/cka/' }],
    artifacts: [],
    metadata: {
      issuer: 'CNCF',
      issueDate: null,
    },
  },
  {
    id: 'entry-cks-cert',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Certified Kubernetes Security Specialist (CKS)',
    domain: 'Kubernetes',
    status: 'Planned',
    type: 'certification',
    description:
      'Advanced CNCF certification focused on Kubernetes security including cluster hardening and vulnerability scanning.',
    techStack: ['Kubernetes', 'Security'],
    isPublic: true,
    order: 8,
    links: [{ label: 'CNCF CKS', url: 'https://www.cncf.io/certification/cks/' }],
    artifacts: [],
    metadata: {
      issuer: 'CNCF',
      issueDate: null,
    },
  },
  {
    id: 'entry-breach-simulation',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'CI/CD Breach Simulation',
    domain: 'CI/CD',
    status: 'Planned',
    type: 'lab',
    description:
      'Simulate supply chain attacks on CI/CD pipelines and implement detection and prevention mechanisms.',
    techStack: ['CI/CD', 'Security', 'SBOM'],
    isPublic: true,
    order: 9,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-artifact-integrity',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Artifact Integrity Verification',
    domain: 'CI/CD',
    status: 'Planned',
    type: 'lab',
    description:
      'Implement artifact signing and verification using Cosign and SLSA attestations for supply chain security.',
    techStack: ['Cosign', 'SLSA', 'Sigstore'],
    isPublic: true,
    order: 10,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-secure-platform-capstone',
    phaseId: 'devops',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Secure Cloud Platform Capstone',
    domain: 'Platform Engineering',
    status: 'Planned',
    type: 'project',
    description:
      'End-to-end platform engineering project combining Terraform infrastructure, secure CI/CD pipelines, Kubernetes deployment, security controls, and comprehensive monitoring.',
    techStack: ['Terraform', 'CI/CD', 'Kubernetes', 'Security', 'Monitoring', 'GitOps'],
    isPublic: true,
    order: 11,
    links: [],
    artifacts: [],
  },

  // ========== PHASE 5: SECURITY ==========
  {
    id: 'entry-threat-modeling',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Threat Modeling Fundamentals',
    domain: 'Threat Modeling',
    status: 'Planned',
    type: 'exercise',
    description:
      'Learn threat modeling methodologies (STRIDE, PASTA) to identify and mitigate security risks in system design.',
    techStack: ['Threat Modeling', 'STRIDE', 'PASTA'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-container-scanning',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Container Image Scanning',
    domain: 'DevSecOps',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement automated container image scanning with Trivy, Grype, and integrate into CI/CD pipelines.',
    techStack: ['Trivy', 'Grype', 'Docker', 'CI/CD'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-runtime-security',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Runtime Security Monitoring',
    domain: 'Container Security',
    status: 'Planned',
    type: 'exercise',
    description:
      'Deploy runtime security monitoring with Falco to detect anomalous behavior and security incidents in containers.',
    techStack: ['Falco', 'Kubernetes', 'eBPF'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-secrets-management',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Secrets Management',
    domain: 'Secrets Management',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement secure secrets management using HashiCorp Vault, AWS Secrets Manager, and External Secrets Operator.',
    techStack: ['Vault', 'AWS Secrets Manager', 'External Secrets'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-admission-control',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Kubernetes Admission Control Policies',
    domain: 'DevSecOps',
    status: 'Planned',
    type: 'project',
    description:
      'Implement admission control policies with OPA Gatekeeper and Kyverno to enforce security and compliance standards.',
    techStack: ['OPA', 'Gatekeeper', 'Kyverno', 'Kubernetes'],
    isPublic: true,
    order: 5,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-aws-security-services',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS Security Services',
    domain: 'AWS Security',
    status: 'Planned',
    type: 'exercise',
    description:
      'Master AWS security services: GuardDuty, Security Hub, Inspector, Macie, and automated incident response.',
    techStack: ['AWS', 'GuardDuty', 'Security Hub', 'Inspector'],
    isPublic: true,
    order: 6,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-devsecops-cert',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'DevSecOps Professional Certification',
    domain: 'DevSecOps',
    status: 'Planned',
    type: 'certification',
    description:
      'Certification validating DevSecOps practices including secure SDLC, security testing, and compliance automation.',
    techStack: ['DevSecOps'],
    isPublic: true,
    order: 7,
    links: [],
    artifacts: [],
    metadata: {
      issuer: 'Various',
      issueDate: null,
    },
  },
  {
    id: 'entry-aws-security-cert',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS Certified Security - Specialty',
    domain: 'AWS Security',
    status: 'Planned',
    type: 'certification',
    description:
      'Advanced AWS certification demonstrating expertise in securing AWS workloads and implementing security controls.',
    techStack: ['AWS', 'Security'],
    isPublic: true,
    order: 8,
    links: [{ label: 'AWS Security Specialty', url: 'https://aws.amazon.com/certification/' }],
    artifacts: [],
    metadata: {
      issuer: 'Amazon Web Services',
      issueDate: null,
    },
  },
  {
    id: 'entry-runtime-attack-simulation',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Runtime Attack Simulation Lab',
    domain: 'Container Security',
    status: 'Planned',
    type: 'lab',
    description:
      'Simulate runtime attacks on containers and Kubernetes clusters, then implement detection and response mechanisms.',
    techStack: ['Falco', 'Kubernetes', 'Security'],
    isPublic: true,
    order: 9,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-supply-chain-security',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Software Supply Chain Security',
    domain: 'DevSecOps',
    status: 'Planned',
    type: 'project',
    description:
      'Comprehensive supply chain security project implementing SBOM generation, SLSA provenance, Cosign signing, dependency verification, and attestation workflows.',
    techStack: ['SBOM', 'SLSA', 'Cosign', 'Sigstore', 'Provenance', 'Dependency Signing'],
    isPublic: true,
    order: 10,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-secrets-leak-rotation',
    phaseId: 'security',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Secrets Leak & Rotation Lab',
    domain: 'Secrets Management',
    status: 'Planned',
    type: 'lab',
    description:
      'Practice detecting secret exposure in code/logs, implementing automated revocation procedures, and building secret rotation automation workflows.',
    techStack: ['Vault', 'AWS Secrets Manager', 'git-secrets', 'Secret Scanning', 'Rotation Automation'],
    isPublic: true,
    order: 11,
    links: [],
    artifacts: [],
  },

  // ========== PHASE 6: SRE ==========
  {
    id: 'entry-observability',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Observability: Metrics, Logs, Traces',
    domain: 'Observability',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement comprehensive observability with Prometheus, Grafana, Loki, and distributed tracing with Tempo/Jaeger.',
    techStack: ['Prometheus', 'Grafana', 'Loki', 'Tempo', 'Jaeger'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-slo-sla',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'SLO/SLA Definition and Monitoring',
    domain: 'SLO/SLA',
    status: 'Planned',
    type: 'exercise',
    description:
      'Define Service Level Objectives (SLOs) and Service Level Agreements (SLAs), implement error budgets and alerting.',
    techStack: ['SLO', 'SLA', 'Prometheus', 'Grafana'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-incident-response',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Incident Response Playbooks',
    domain: 'Incident Response',
    status: 'Planned',
    type: 'exercise',
    description:
      'Create incident response playbooks, implement on-call rotations, and conduct blameless postmortems.',
    techStack: ['PagerDuty', 'Opsgenie', 'Incident Response'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-chaos-engineering',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Chaos Engineering',
    domain: 'Chaos Engineering',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement chaos engineering experiments with Chaos Mesh or LitmusChaos to test system resilience.',
    techStack: ['Chaos Mesh', 'LitmusChaos', 'Kubernetes'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-credential-leak-sim',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Credential Leak Simulation',
    domain: 'Incident Response',
    status: 'Planned',
    type: 'lab',
    description:
      'Simulate credential leak scenarios and practice automated detection and response procedures.',
    techStack: ['AWS', 'Security', 'Incident Response'],
    isPublic: true,
    order: 5,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-finops',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'FinOps: Cloud Cost Optimization',
    domain: 'FinOps',
    status: 'Planned',
    type: 'exercise',
    description:
      'Implement FinOps practices for cloud cost visibility, optimization, and showback/chargeback mechanisms.',
    techStack: ['AWS Cost Explorer', 'Kubecost', 'FinOps'],
    isPublic: true,
    order: 6,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-btl1-cert',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Blue Team Level 1 (BTL1)',
    domain: 'Incident Response',
    status: 'Planned',
    type: 'certification',
    description:
      'Security Operations certification covering security monitoring, incident detection, and threat hunting.',
    techStack: ['Security Operations', 'SIEM', 'Threat Hunting'],
    isPublic: true,
    order: 7,
    links: [{ label: 'Security Blue Team', url: 'https://securityblue.team/' }],
    artifacts: [],
    metadata: {
      issuer: 'Security Blue Team',
      issueDate: null,
    },
  },
  {
    id: 'entry-finops-cert',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'FinOps Certified Practitioner',
    domain: 'FinOps',
    status: 'Planned',
    type: 'certification',
    description:
      'FinOps Foundation certification demonstrating cloud financial management expertise.',
    techStack: ['FinOps', 'Cloud Cost Management'],
    isPublic: true,
    order: 8,
    links: [{ label: 'FinOps Foundation', url: 'https://www.finops.org/' }],
    artifacts: [],
    metadata: {
      issuer: 'FinOps Foundation',
      issueDate: null,
    },
  },
  {
    id: 'entry-aws-ir-automation',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'AWS Incident Response Automation',
    domain: 'Incident Response',
    status: 'Planned',
    type: 'project',
    description:
      'Build automated incident response system integrating AWS GuardDuty findings with Lambda remediation functions and Slack notifications for real-time security alerts.',
    techStack: ['AWS GuardDuty', 'Lambda', 'EventBridge', 'Slack', 'SNS', 'CloudWatch'],
    isPublic: true,
    order: 9,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-dr-restore-simulation',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Disaster Recovery Restore Simulation',
    domain: 'SRE',
    status: 'Planned',
    type: 'lab',
    description:
      'Hands-on disaster recovery testing lab simulating complete system failures, practicing restore procedures, and validating RTO/RPO targets.',
    techStack: ['AWS Backup', 'Disaster Recovery', 'RTO/RPO', 'Restore Testing', 'Business Continuity'],
    isPublic: true,
    order: 10,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-major-incident-simulation',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Major Incident Simulation Project',
    domain: 'SRE',
    status: 'Planned',
    type: 'project',
    description:
      'Full-scale production outage simulation including detection, escalation, remediation, and comprehensive postmortem analysis.',
    techStack: ['AWS', 'Prometheus', 'Grafana', 'PagerDuty'],
    isPublic: true,
    order: 11,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-soc2-readiness',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'SOC2 Readiness Lab',
    domain: 'FinOps',
    status: 'Planned',
    type: 'lab',
    description:
      'SOC2 Type II controls mapping, evidence collection, and readiness assessment for cloud infrastructure.',
    techStack: ['SOC2', 'AWS', 'Security Hub'],
    isPublic: true,
    order: 12,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-iso27001-mapping',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'ISO27001 Controls Mapping Exercise',
    domain: 'Observability',
    status: 'Planned',
    type: 'exercise',
    description:
      'Map ISO27001 information security controls to AWS services and cloud-native security implementations.',
    techStack: ['ISO27001', 'AWS', 'IAM'],
    isPublic: true,
    order: 13,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-pci-dss-compliance',
    phaseId: 'sre',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'PCI DSS Cloud Compliance Lab',
    domain: 'Chaos Engineering',
    status: 'Planned',
    type: 'lab',
    description:
      'PCI DSS compliance validation and enforcement in AWS using WAF, encryption, network segmentation, and security controls.',
    techStack: ['PCI-DSS', 'AWS', 'WAF'],
    isPublic: true,
    order: 14,
    links: [],
    artifacts: [],
  },

  // ========== PHASE 7: DOCUMENTATION ==========
  {
    id: 'entry-adrs',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Architecture Decision Records (ADRs)',
    domain: 'ADRs',
    status: 'Planned',
    type: 'exercise',
    description:
      'Learn to create and maintain Architecture Decision Records (ADRs) to document key architectural decisions.',
    techStack: ['ADR', 'Markdown', 'Git'],
    isPublic: true,
    order: 1,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-system-docs',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'System Documentation',
    domain: 'System Documentation',
    status: 'Planned',
    type: 'exercise',
    description:
      'Create comprehensive system documentation including architecture diagrams, data flow diagrams, and API documentation.',
    techStack: ['Markdown', 'Mermaid', 'OpenAPI'],
    isPublic: true,
    order: 2,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-runbooks',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Operational Runbooks',
    domain: 'Runbooks',
    status: 'Planned',
    type: 'exercise',
    description:
      'Create operational runbooks for common procedures, troubleshooting guides, and emergency response playbooks.',
    techStack: ['Markdown', 'Documentation'],
    isPublic: true,
    order: 3,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-postmortems',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Incident Postmortems',
    domain: 'Postmortems',
    status: 'Planned',
    type: 'exercise',
    description:
      'Write blameless postmortems documenting incidents, root causes, remediation actions, and preventive measures.',
    techStack: ['Documentation', 'Incident Response'],
    isPublic: true,
    order: 4,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-security-reports',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Security Reports and Assessments',
    domain: 'Technical Writing',
    status: 'Planned',
    type: 'exercise',
    description:
      'Create security assessment reports, vulnerability reports, and compliance documentation for stakeholders.',
    techStack: ['Security', 'Documentation'],
    isPublic: true,
    order: 5,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-portfolio-showcase',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Portfolio Showcase Project',
    domain: 'Technical Writing',
    status: 'Planned',
    type: 'project',
    description:
      'Create a comprehensive portfolio website showcasing all projects, certifications, and technical skills.',
    techStack: ['React', 'Portfolio', 'Web Development'],
    isPublic: true,
    order: 6,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-executive-summaries',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Executive Summaries and Presentations',
    domain: 'Technical Writing',
    status: 'Planned',
    type: 'exercise',
    description:
      'Learn to create executive-level summaries, technical presentations, and communicate complex topics to non-technical audiences.',
    techStack: ['Presentation', 'Communication'],
    isPublic: true,
    order: 7,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-docs-project',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Documentation Website Project',
    domain: 'System Documentation',
    status: 'Planned',
    type: 'project',
    description:
      'Build a centralized documentation website using tools like Docusaurus or MkDocs for all technical documentation.',
    techStack: ['Docusaurus', 'MkDocs', 'Documentation'],
    isPublic: true,
    order: 8,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-engineering-learning-journal',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Engineering Learning Journal',
    domain: 'System Documentation',
    status: 'Planned',
    type: 'note',
    description:
      'Maintain a structured learning journal documenting technical concepts, lessons learned, breakthrough moments, and knowledge gaps throughout the engineering journey.',
    techStack: ['Markdown', 'Documentation', 'Learning'],
    isPublic: true,
    order: 9,
    links: [],
    artifacts: [],
  },
  {
    id: 'entry-incident-analysis-notes',
    phaseId: 'documentation',
    journeyId: 'cloud-devops-security-roadmap',
    title: 'Incident Analysis Notes',
    domain: 'Postmortems',
    status: 'Planned',
    type: 'note',
    description:
      'Collection of detailed incident analysis notes, security findings, troubleshooting patterns, and lessons learned from real-world scenarios and lab simulations.',
    techStack: ['Incident Response', 'Security', 'Troubleshooting', 'Documentation'],
    isPublic: true,
    order: 10,
    links: [],
    artifacts: [],
  },
];

// ============================================================================
// GROUPED ENTRY ARRAYS
// ============================================================================

const exercises = entries.filter((e) => e.type === 'exercise');
const labs = entries.filter((e) => e.type === 'lab');
const projects = entries.filter((e) => e.type === 'project');
const certifications = entries.filter((e) => e.type === 'certification');
const notes = entries.filter((e) => e.type === 'note');

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

const VALID_TYPES = ['exercise', 'lab', 'project', 'certification', 'note'];
const VALID_STATUSES = ['Planned', 'In Progress', 'Completed'];

/**
 * Validate single entry against schema
 * @param {Object} entry - Entry to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateEntry(entry) {
  const errors = [];

  if (!entry.id) errors.push(`Missing id`);
  if (!entry.title) errors.push(`Missing title (id: ${entry.id})`);
  if (!entry.phaseId) errors.push(`Missing phaseId (id: ${entry.id})`);
  if (!entry.domain) errors.push(`Missing domain (id: ${entry.id})`);
  if (!VALID_STATUSES.includes(entry.status)) {
    errors.push(`Invalid status "${entry.status}" (id: ${entry.id}). Must be: ${VALID_STATUSES.join(', ')}`);
  }
  if (!VALID_TYPES.includes(entry.type)) {
    errors.push(`Invalid type "${entry.type}" (id: ${entry.id}). Must be: ${VALID_TYPES.join(', ')}`);
  }
  if (!entry.description) errors.push(`Missing description (id: ${entry.id})`);
  if (!Array.isArray(entry.techStack) || entry.techStack.length === 0) {
    errors.push(`Invalid or empty techStack (id: ${entry.id})`);
  }
  if (!Array.isArray(entry.links)) errors.push(`links must be array (id: ${entry.id})`);
  if (!Array.isArray(entry.artifacts)) errors.push(`artifacts must be array (id: ${entry.id})`);
  if (typeof entry.isPublic !== 'boolean') errors.push(`isPublic must be boolean (id: ${entry.id})`);
  if (typeof entry.order !== 'number') errors.push(`order must be number (id: ${entry.id})`);

  // Validate links structure
  if (Array.isArray(entry.links)) {
    entry.links.forEach((link, idx) => {
      if (!link.label) errors.push(`Link[${idx}] missing label (id: ${entry.id})`);
      if (!link.url) errors.push(`Link[${idx}] missing url (id: ${entry.id})`);
      if (link.title) errors.push(`Link[${idx}] has deprecated 'title' field, use 'label' instead (id: ${entry.id})`);
    });
  }

  // Validate artifacts structure
  if (Array.isArray(entry.artifacts)) {
    entry.artifacts.forEach((artifact, idx) => {
      if (!artifact.url) errors.push(`Artifact[${idx}] missing url (id: ${entry.id})`);
    });
  }

  // Validate certifications have metadata
  if (entry.type === 'certification' && !entry.metadata) {
    errors.push(`Certification missing metadata (id: ${entry.id})`);
  }
  if (entry.metadata) {
    if (!entry.metadata.issuer) errors.push(`Metadata missing issuer (id: ${entry.id})`);
    if (!('issueDate' in entry.metadata)) errors.push(`Metadata missing issueDate (id: ${entry.id})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate phase integrity
 * @param {Object} phase - Phase to validate
 * @param {number} phaseEntryCount - Count of entries in this phase
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validatePhase(phase, phaseEntryCount) {
  const errors = [];

  if (phase.totalModules !== phaseEntryCount) {
    errors.push(
      `Phase "${phase.id}" totalModules (${phase.totalModules}) does not match entry count (${phaseEntryCount})`
    );
  }

  if (!VALID_STATUSES.includes(phase.status)) {
    errors.push(
      `Phase "${phase.id}" has invalid status "${phase.status}". Must be: ${VALID_STATUSES.join(', ')}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate orders are sequential within phase
 * @param {Object} phaseEntries - Entries by phase
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateOrders(phaseEntries) {
  const errors = [];

  Object.entries(phaseEntries).forEach(([phaseId, phaseItems]) => {
    const orders = phaseItems.map((e) => e.order).sort((a, b) => a - b);
    const expectedOrders = Array.from({ length: phaseItems.length }, (_, i) => i + 1);

    if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
      errors.push(`Phase "${phaseId}" has non-sequential orders: ${orders.join(', ')}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check for duplicate IDs
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function checkDuplicateIds() {
  const errors = [];
  const seen = new Set();

  entries.forEach((entry) => {
    if (seen.has(entry.id)) {
      errors.push(`Duplicate entry ID: "${entry.id}"`);
    }
    seen.add(entry.id);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate all data before seeding
 * @returns {Object} { valid: boolean, warnings: string[], errors: string[] }
 */
function validateAllData() {
  const warnings = [];
  const errors = [];

  // Validate all entries
  entries.forEach((entry) => {
    const validation = validateEntry(entry);
    if (!validation.valid) {
      errors.push(...validation.errors);
    }
  });

  // Validate all phases
  const phaseEntryMap = {};
  entries.forEach((entry) => {
    if (!phaseEntryMap[entry.phaseId]) phaseEntryMap[entry.phaseId] = [];
    phaseEntryMap[entry.phaseId].push(entry);
  });

  phases.forEach((phase) => {
    const phaseCount = phaseEntryMap[phase.id]?.length || 0;
    const validation = validatePhase(phase, phaseCount);
    if (!validation.valid) {
      errors.push(...validation.errors);
    }
  });

  // Validate order sequences
  const orderValidation = validateOrders(phaseEntryMap);
  if (!orderValidation.valid) {
    errors.push(...orderValidation.errors);
  }

  // Check for duplicates
  const duplicateValidation = checkDuplicateIds();
  if (!duplicateValidation.valid) {
    errors.push(...duplicateValidation.errors);
  }

  // Warn about status distribution
  const inProgressCount = phases.filter((p) => p.status === 'In Progress').length;
  if (inProgressCount === 0) {
    warnings.push('⚠ No phases marked as "In Progress"');
  } else if (inProgressCount > 1) {
    warnings.push(`⚠ Multiple phases (${inProgressCount}) marked as "In Progress"`);
  }

  return {
    valid: errors.length === 0,
    warnings,
    errors,
  };
}

// ============================================================================
// SEED FUNCTION
// ============================================================================

// Cleanup existing journey data
async function cleanupExistingData() {
  console.log('🧹 CLEANING UP EXISTING DATA...\n');
  
  try {
    // Delete all entries
    const entriesSnapshot = await adminDb.collection('journeyEntries').get();
    console.log(`  Found ${entriesSnapshot.size} existing entries`);
    if (entriesSnapshot.size > 0) {
      const entryDeleteBatch = adminDb.batch();
      entriesSnapshot.docs.forEach((doc) => entryDeleteBatch.delete(doc.ref));
      await entryDeleteBatch.commit();
      console.log(`  ✓ Deleted ${entriesSnapshot.size} entries`);
    }

    // Delete all phases
    const phasesSnapshot = await adminDb.collection('journeyPhases').get();
    console.log(`  Found ${phasesSnapshot.size} existing phases`);
    if (phasesSnapshot.size > 0) {
      const phaseDeleteBatch = adminDb.batch();
      phasesSnapshot.docs.forEach((doc) => phaseDeleteBatch.delete(doc.ref));
      await phaseDeleteBatch.commit();
      console.log(`  ✓ Deleted ${phasesSnapshot.size} phases`);
    }

    // Delete all journeys
    const journeysSnapshot = await adminDb.collection('journeys').get();
    console.log(`  Found ${journeysSnapshot.size} existing journeys`);
    if (journeysSnapshot.size > 0) {
      const journeyDeleteBatch = adminDb.batch();
      journeysSnapshot.docs.forEach((doc) => journeyDeleteBatch.delete(doc.ref));
      await journeyDeleteBatch.commit();
      console.log(`  ✓ Deleted ${journeysSnapshot.size} journeys`);
    }

    console.log('\n✓ Cleanup complete\n');
  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    throw error;
  }
}

async function seedJourneyRoadmap() {
  try {
    console.log('\n' + '='.repeat(70));
    console.log('ENGINEERING JOURNEY ROADMAP - FIREBASE SEED');
    console.log('='.repeat(70) + '\n');

    // CLEANUP EXISTING DATA
    await cleanupExistingData();

    // PRE-SEED VALIDATION
    console.log('📋 VALIDATING DATA...');
    const validation = validateAllData();

    if (validation.warnings.length > 0) {
      validation.warnings.forEach((w) => console.log(w));
    }

    if (!validation.valid) {
      console.error('\n❌ VALIDATION FAILED\n');
      validation.errors.forEach((error) => console.error(`  ✗ ${error}`));
      console.error('\n' + '='.repeat(70));
      process.exit(1);
    }

    console.log('✓ All data validated successfully\n');

    // SEED PROCESS
    console.log('🚀 SEEDING FIREBASE...\n');

    // 1. Create Journey
    console.log('  Creating journey...');
    const journeyRef = await adminDb.collection('journeys').add({
      ...journey,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`  ✓ Journey created: ${journeyRef.id}`);

    // 2. Create Phases
    console.log('\n  Creating phases...');
    const phaseRefs = new Map();
    for (const phase of phases) {
      const phaseRef = await adminDb.collection('journeyPhases').add({
        ...phase,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      phaseRefs.set(phase.id, phaseRef.id);
    }
    console.log(`  ✓ ${phases.length} phases created`);

    // 3. Create Entries
    console.log('\n  Creating entries...');
    let entriesCreated = 0;
    for (const entry of entries) {
      await adminDb.collection('journeyEntries').add({
        ...entry,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      entriesCreated++;
      // Progress indicator every 10 entries
      if (entriesCreated % 10 === 0) {
        console.log(`    → ${entriesCreated}/${entries.length} entries...`);
      }
    }
    console.log(`  ✓ ${entriesCreated} entries created\n`);

    // 4. Generate Summary Report
    console.log('='.repeat(70));
    console.log('✅ SEED COMPLETE - SUMMARY REPORT');
    console.log('='.repeat(70));

    // Journey info
    console.log(`\n📚 JOURNEY: ${journey.title}`);
    console.log(`   Status: ${journey.status}`);
    console.log(`   Public: ${journey.isPublic ? 'Yes' : 'No'}`);

    // Phases info
    console.log(`\n📍 PHASES: ${phases.length}`);
    const phaseEntryMap = {};
    entries.forEach((entry) => {
      if (!phaseEntryMap[entry.phaseId]) phaseEntryMap[entry.phaseId] = 0;
      phaseEntryMap[entry.phaseId]++;
    });

    phases.forEach((phase) => {
      const count = phaseEntryMap[phase.id] || 0;
      const status = phase.status === 'In Progress' ? '🔄' : '📋';
      console.log(`   ${status} Phase ${phase.order}: ${phase.id.padEnd(16)} (${count} entries)`);
    });

    // Entries summary
    console.log(`\n📊 ENTRIES: ${entries.length} total`);
    console.log(`   Exercises:    ${exercises.length}`);
    console.log(`   Labs:         ${labs.length}`);
    console.log(`   Projects:     ${projects.length}`);
    console.log(`   Certifications: ${certifications.length}`);
    console.log(`   Notes:        ${notes.length}`);

    // Per-phase breakdown
    console.log(`\n📈 ENTRIES BY PHASE:`);
    phases.forEach((phase) => {
      const count = phaseEntryMap[phase.id] || 0;
      const phaseEntries = entries.filter((e) => e.phaseId === phase.id);
      const exCount = phaseEntries.filter((e) => e.type === 'exercise').length;
      const labCount = phaseEntries.filter((e) => e.type === 'lab').length;
      const projCount = phaseEntries.filter((e) => e.type === 'project').length;
      const certCount = phaseEntries.filter((e) => e.type === 'certification').length;
      const noteCount = phaseEntries.filter((e) => e.type === 'note').length;

      console.log(`   ${phase.id.padEnd(16)}: ${count} (Ex:${exCount} Lab:${labCount} Proj:${projCount} Cert:${certCount} Note:${noteCount})`);
    });

    console.log('\n' + '='.repeat(70));
    console.log('🎉 ROADMAP SUCCESSFULLY SEEDED TO FIREBASE');
    console.log('='.repeat(70) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ SEED FAILED');
    console.error('='.repeat(70));
    console.error('Error:', error.message);
    if (error.code) {
      console.error('Firebase Error Code:', error.code);
    }
    console.error('='.repeat(70) + '\n');
    process.exit(1);
  }
}

// Run seed
seedJourneyRoadmap();
