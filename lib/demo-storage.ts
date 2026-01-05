// Demo mode: In-memory storage for testing without a database
// This is NOT production-ready and data is lost on restart

interface DemoUser {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  role: string
  createdAt: Date
  updatedAt: Date
}

interface DemoReceipt {
  id: string
  patientName: string
  patientDOB: Date
  chargeDate: Date
  coverageStartDate: Date
  coverageEndDate: Date
  patientState: string
  planPrice: number
  planWeeks: number
  medications: string
  chargeAmount: number
  breakdown: string
  adjustmentAmount: number | null
  adjustmentReason: string | null
  providerName: string | null
  providerNPI: string | null
  diagnosisCode: string | null
  procedureCode: string | null
  pdfUrl: string | null
  createdById: string
  createdAt: Date
  updatedAt: Date
}

interface DemoPricingRule {
  id: string
  planPrice: number
  planWeeks: number
  medicationKey: string
  category: string
  itemName: string
  itemDescription: string | null
  unitPrice: number
  quantity: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

class DemoStorage {
  private users: Map<string, DemoUser> = new Map()
  private receipts: Map<string, DemoReceipt> = new Map()
  private pricingRules: Map<string, DemoPricingRule> = new Map()
  private accounts: any[] = []
  private sessions: any[] = []

  // Users
  async createUser(data: Partial<DemoUser>): Promise<DemoUser> {
    const id = data.id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const user: DemoUser = {
      id,
      name: data.name || null,
      email: data.email || null,
      emailVerified: data.emailVerified || null,
      image: data.image || null,
      role: data.role || 'user',
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date(),
    }
    this.users.set(id, user)
    return user
  }

  async findUserByEmail(email: string | null): Promise<DemoUser | null> {
    if (!email) return null
    for (const user of this.users.values()) {
      if (user.email === email) return user
    }
    return null
  }

  async findUserById(id: string): Promise<DemoUser | null> {
    return this.users.get(id) || null
  }

  async updateUser(id: string, data: Partial<DemoUser>): Promise<DemoUser> {
    const user = this.users.get(id)
    if (!user) throw new Error('User not found')
    const updated = { ...user, ...data, updatedAt: new Date() }
    this.users.set(id, updated)
    return updated
  }

  // Receipts
  async createReceipt(data: Omit<DemoReceipt, 'id' | 'createdAt' | 'updatedAt'>): Promise<DemoReceipt> {
    const id = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const receipt: DemoReceipt = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.receipts.set(id, receipt)
    return receipt
  }

  async findReceiptById(id: string): Promise<DemoReceipt | null> {
    return this.receipts.get(id) || null
  }

  async findReceiptsByUserId(userId: string): Promise<DemoReceipt[]> {
    return Array.from(this.receipts.values()).filter(r => r.createdById === userId)
  }

  async updateReceipt(id: string, data: Partial<DemoReceipt>): Promise<DemoReceipt> {
    const receipt = this.receipts.get(id)
    if (!receipt) throw new Error('Receipt not found')
    const updated = { ...receipt, ...data, updatedAt: new Date() }
    this.receipts.set(id, updated)
    return updated
  }

  async deleteReceipt(id: string): Promise<void> {
    this.receipts.delete(id)
  }

  // Pricing Rules
  async createPricingRule(data: Omit<DemoPricingRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<DemoPricingRule> {
    const id = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const rule: DemoPricingRule = {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.pricingRules.set(id, rule)
    return rule
  }

  async findPricingRules(filters?: {
    planPrice?: number
    planWeeks?: number
    medicationKey?: string
    category?: string
    isActive?: boolean
  }): Promise<DemoPricingRule[]> {
    let rules = Array.from(this.pricingRules.values())
    
    if (filters) {
      if (filters.planPrice !== undefined) {
        rules = rules.filter(r => r.planPrice === filters.planPrice)
      }
      if (filters.planWeeks !== undefined) {
        rules = rules.filter(r => r.planWeeks === filters.planWeeks)
      }
      if (filters.medicationKey) {
        rules = rules.filter(r => r.medicationKey === filters.medicationKey)
      }
      if (filters.category) {
        rules = rules.filter(r => r.category === filters.category)
      }
      if (filters.isActive !== undefined) {
        rules = rules.filter(r => r.isActive === filters.isActive)
      }
    }
    
    return rules
  }

  async findPricingRuleById(id: string): Promise<DemoPricingRule | null> {
    return this.pricingRules.get(id) || null
  }

  async updatePricingRule(id: string, data: Partial<DemoPricingRule>): Promise<DemoPricingRule> {
    const rule = this.pricingRules.get(id)
    if (!rule) throw new Error('Pricing rule not found')
    const updated = { ...rule, ...data, updatedAt: new Date() }
    this.pricingRules.set(id, updated)
    return updated
  }

  async deletePricingRule(id: string): Promise<void> {
    this.pricingRules.delete(id)
  }

  // Seed sample data
  seedSampleData() {
    // Sample pricing rules
    const sampleRules = [
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 't-cypionate',
        category: 'Pharmacy',
        itemName: 'Testosterone Cypionate',
        itemDescription: '4-week supply',
        unitPrice: 50,
        quantity: 1,
        isActive: true,
      },
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 't-cypionate',
        category: 'Lab',
        itemName: 'Lab Work',
        itemDescription: 'Initial lab panel',
        unitPrice: 75,
        quantity: 1,
        isActive: true,
      },
      {
        planPrice: 499,
        planWeeks: 12,
        medicationKey: 't-cypionate',
        category: 'Pharmacy',
        itemName: 'Testosterone Cypionate',
        itemDescription: '12-week supply',
        unitPrice: 150,
        quantity: 1,
        isActive: true,
      },
    ]

    sampleRules.forEach(rule => {
      this.createPricingRule(rule as any)
    })
  }
}

// Singleton instance
let demoStorage: DemoStorage | null = null

export function getDemoStorage(): DemoStorage {
  if (!demoStorage) {
    demoStorage = new DemoStorage()
    demoStorage.seedSampleData()
  }
  return demoStorage
}

// Prisma-like interface for demo mode
export const demoPrisma = {
  user: {
    create: async (data: { data: any }) => {
      return getDemoStorage().createUser(data.data)
    },
    findUnique: async (args: { where: { id?: string; email?: string } }) => {
      const storage = getDemoStorage()
      if (args.where.id) {
        return storage.findUserById(args.where.id)
      }
      if (args.where.email) {
        return storage.findUserByEmail(args.where.email)
      }
      return null
    },
    findMany: async () => {
      return Array.from(getDemoStorage()['users'].values())
    },
    update: async (args: { where: { id: string }; data: any }) => {
      return getDemoStorage().updateUser(args.where.id, args.data)
    },
  },
  receipt: {
    create: async (data: { data: any }) => {
      return getDemoStorage().createReceipt(data.data)
    },
    findUnique: async (args: { where: { id: string } }) => {
      return getDemoStorage().findReceiptById(args.where.id)
    },
    findMany: async (args?: { where?: { createdById: string }; orderBy?: any }) => {
      const storage = getDemoStorage()
      if (args?.where?.createdById) {
        return storage.findReceiptsByUserId(args.where.createdById)
      }
      return Array.from(storage['receipts'].values())
    },
    update: async (args: { where: { id: string }; data: any }) => {
      return getDemoStorage().updateReceipt(args.where.id, args.data)
    },
    delete: async (args: { where: { id: string } }) => {
      return getDemoStorage().deleteReceipt(args.where.id)
    },
  },
  pricingRule: {
    create: async (data: { data: any }) => {
      return getDemoStorage().createPricingRule(data.data)
    },
    findUnique: async (args: { where: { id: string } }) => {
      return getDemoStorage().findPricingRuleById(args.where.id)
    },
    findMany: async (args?: { where?: any; orderBy?: any }) => {
      return getDemoStorage().findPricingRules(args?.where)
    },
    update: async (args: { where: { id: string }; data: any }) => {
      return getDemoStorage().updatePricingRule(args.where.id, args.data)
    },
    delete: async (args: { where: { id: string } }) => {
      return getDemoStorage().deletePricingRule(args.where.id)
    },
  },
  account: {
    create: async (data: { data: any }) => {
      const storage = getDemoStorage()
      storage['accounts'].push(data.data)
      return data.data
    },
    findUnique: async (args: { where: any }) => {
      const storage = getDemoStorage()
      return storage['accounts'].find((acc: any) => {
        if (args.where.provider_providerAccountId) {
          return acc.provider === args.where.provider_providerAccountId.provider &&
                 acc.providerAccountId === args.where.provider_providerAccountId.providerAccountId
        }
        return false
      }) || null
    },
  },
  session: {
    create: async (data: { data: any }) => {
      const storage = getDemoStorage()
      storage['sessions'].push(data.data)
      return data.data
    },
    findUnique: async (args: { where: { sessionToken: string } }) => {
      const storage = getDemoStorage()
      return storage['sessions'].find((s: any) => s.sessionToken === args.where.sessionToken) || null
    },
    update: async (args: { where: { sessionToken: string }; data: any }) => {
      const storage = getDemoStorage()
      const index = storage['sessions'].findIndex((s: any) => s.sessionToken === args.where.sessionToken)
      if (index >= 0) {
        storage['sessions'][index] = { ...storage['sessions'][index], ...args.data }
        return storage['sessions'][index]
      }
      return null
    },
    delete: async (args: { where: { sessionToken: string } }) => {
      const storage = getDemoStorage()
      const index = storage['sessions'].findIndex((s: any) => s.sessionToken === args.where.sessionToken)
      if (index >= 0) {
        storage['sessions'].splice(index, 1)
      }
    },
  },
  verificationToken: {
    create: async (data: { data: any }) => data.data,
    findUnique: async (args: { where: { token: string } }) => null,
    delete: async (args: { where: { identifier_token: any } }) => null,
  },
  $disconnect: async () => {},
}

