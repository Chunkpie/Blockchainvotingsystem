export interface Voter {
  id: string
  name: string
  epicId: string
  age: number
  state: string
  constituency: string
  pin: string
  otp: string
  hasVoted: boolean
}

export interface Candidate {
  id: string
  name: string
  party: string
  symbol: string
  votes: number
}

export interface Vote {
  id: string
  voterId: string
  candidateId: string
  timestamp: Date
  transactionHash: string
  encrypted: boolean
}

export interface Admin {
  username: string
  password: string
}

export class BlockchainVotingSystem {
  private voters: Voter[] = []
  private candidates: Candidate[] = []
  private votes: Vote[] = []
  private electionActive = true

  constructor() {
    this.initializeDemoData()
  }

  private initializeDemoData() {
    // Initialize demo voters as specified
    this.voters = [
      {
        id: "1",
        name: "Rajesh Kumar Sharma",
        epicId: "WBX1234567",
        age: 34,
        state: "West Bengal",
        constituency: "Kolkata Dakshin",
        pin: "1234",
        otp: "567890",
        hasVoted: false,
      },
      {
        id: "2",
        name: "Anjali Mehta",
        epicId: "GJA7654321",
        age: 29,
        state: "Gujarat",
        constituency: "Ahmedabad East",
        pin: "5678",
        otp: "456789",
        hasVoted: false,
      },
      {
        id: "3",
        name: "Mohammed Irfan Khan",
        epicId: "MHA9876543",
        age: 41,
        state: "Maharashtra",
        constituency: "Mumbai South",
        pin: "2468",
        otp: "345678",
        hasVoted: false,
      },
      {
        id: "4",
        name: "Priya Ramesh Iyer",
        epicId: "TNQ6543219",
        age: 38,
        state: "Tamil Nadu",
        constituency: "Chennai Central",
        pin: "1357",
        otp: "234567",
        hasVoted: false,
      },
      {
        id: "5",
        name: "Arjun Singh Rathore",
        epicId: "RJM5432167",
        age: 25,
        state: "Rajasthan",
        constituency: "Jaipur",
        pin: "9876",
        otp: "123456",
        hasVoted: false,
      },
    ]

    // Initialize demo candidates
    this.candidates = [
      { id: "1", name: "Dr. Amit Patel", party: "Indian National Congress", symbol: "Hand", votes: 0 },
      { id: "2", name: "Smt. Kavita Singh", party: "Bharatiya Janata Party", symbol: "Lotus", votes: 0 },
      { id: "3", name: "Shri Ravi Kumar", party: "Aam Aadmi Party", symbol: "Broom", votes: 0 },
      { id: "4", name: "Dr. Meera Sharma", party: "Communist Party of India", symbol: "Hammer & Sickle", votes: 0 },
    ]
  }

  // Voter authentication methods
  authenticateVoter(epicId: string, pin: string, otp: string): Voter | null {
    const voter = this.voters.find((v) => v.epicId === epicId && v.pin === pin && v.otp === otp)
    return voter || null
  }

  // Added getVoter method for authentication flow
  getVoter(epicId: string): Voter | null {
    return this.voters.find((v) => v.epicId === epicId) || null
  }

  // Voting methods
  castVote(voterId: string, candidateId: string): { success: boolean; transactionHash?: string; error?: string } {
    if (!this.electionActive) {
      return { success: false, error: "Election is not active" }
    }

    const voter = this.voters.find((v) => v.id === voterId)
    if (!voter) {
      return { success: false, error: "Voter not found" }
    }

    if (voter.hasVoted) {
      return { success: false, error: "Voter has already voted" }
    }

    const candidate = this.candidates.find((c) => c.id === candidateId)
    if (!candidate) {
      return { success: false, error: "Candidate not found" }
    }

    // Generate transaction hash
    const transactionHash = this.generateTransactionHash(voterId, candidateId)

    // Create vote record
    const vote: Vote = {
      id: Date.now().toString(),
      voterId,
      candidateId,
      timestamp: new Date(),
      transactionHash,
      encrypted: true,
    }

    // Update records
    this.votes.push(vote)
    voter.hasVoted = true
    candidate.votes++

    return { success: true, transactionHash }
  }

  private generateTransactionHash(voterId: string, candidateId: string): string {
    const data = `${voterId}-${candidateId}-${Date.now()}`
    return `0x${Buffer.from(data).toString("hex").substring(0, 64)}`
  }

  // Getter methods
  getCandidates(): Candidate[] {
    return [...this.candidates]
  }

  getVoters(): Voter[] {
    return [...this.voters]
  }

  getVotes(): Vote[] {
    return [...this.votes]
  }

  getTotalVotes(): number {
    return this.votes.length
  }

  getResults(): Candidate[] {
    return this.candidates.sort((a, b) => b.votes - a.votes)
  }

  // Election management
  startElection(): void {
    this.electionActive = true
  }

  endElection(): void {
    this.electionActive = false
  }

  isElectionActive(): boolean {
    return this.electionActive
  }

  // Vote verification
  verifyVote(transactionHash: string): { valid: boolean; vote?: Vote } {
    const vote = this.votes.find((v) => v.transactionHash === transactionHash)
    return vote ? { valid: true, vote } : { valid: false }
  }

  getElection() {
    return {
      isActive: this.electionActive,
      candidates: this.getCandidates(),
      totalVotes: this.getTotalVotes(),
      startTime: new Date("2024-01-15T09:00:00Z"), // Demo election start time
      endTime: new Date("2024-01-15T17:00:00Z"), // Demo election end time
      title: "Lok Sabha General Election 2024 - Demo",
      description: "Demonstration of blockchain-based voting system for Indian elections",
    }
  }

  // Updated getTally method
  getTally(): Record<string, number> {
    const tally: Record<string, number> = {}

    this.candidates.forEach((candidate) => {
      tally[candidate.id] = candidate.votes
    })

    return tally
  }

  getDetailedTally() {
    const totalVotes = this.getTotalVotes()
    const results = this.getResults()

    return {
      totalVotes,
      results: results.map((candidate) => ({
        ...candidate,
        percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(2) : "0.00",
      })),
      winner: results.length > 0 ? results[0] : null,
      isComplete: !this.electionActive,
      lastUpdated: new Date(),
    }
  }
}

// Demo admin credentials
export const DEMO_ADMIN: Admin = {
  username: "admin_demo",
  password: "Secure@2025",
}

// Global instance
export const blockchainSystem = new BlockchainVotingSystem()

// Added blockchainService alias for compatibility
export const blockchainService = blockchainSystem
