import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create permissions
  const permissionsData = [
    // Users permissions
    { name: 'users:read', resource: 'users', action: 'read', description: 'View user list and details' },
    { name: 'users:create', resource: 'users', action: 'create', description: 'Create new users' },
    { name: 'users:update', resource: 'users', action: 'update', description: 'Update user information' },
    { name: 'users:delete', resource: 'users', action: 'delete', description: 'Delete users' },
    // Posts permissions
    { name: 'posts:read', resource: 'posts', action: 'read', description: 'View all posts' },
    { name: 'posts:create', resource: 'posts', action: 'create', description: 'Create new posts' },
    { name: 'posts:update', resource: 'posts', action: 'update', description: 'Update any post' },
    { name: 'posts:delete', resource: 'posts', action: 'delete', description: 'Delete any post' },
    // Dashboard permissions
    { name: 'dashboard:access', resource: 'dashboard', action: 'access', description: 'Access dashboard' },
    // Settings permissions
    { name: 'settings:manage', resource: 'settings', action: 'manage', description: 'Manage system settings' },
  ]

  console.log('📝 Creating permissions...')
  const permissions = {}
  for (const permData of permissionsData) {
    const permission = await prisma.permission.upsert({
      where: { name: permData.name },
      update: {},
      create: permData,
    })
    permissions[permData.name] = permission
    console.log(`  ✓ ${permData.name}`)
  }

  // Create roles
  const rolesData = [
    {
      name: 'admin',
      description: 'Full system access',
      isDefault: false,
      permissions: Object.values(permissions),
    },
    {
      name: 'moderator',
      description: 'Can manage users and posts but not system settings',
      isDefault: false,
      permissions: [
        permissions['users:read'],
        permissions['users:create'],
        permissions['users:update'],
        permissions['posts:read'],
        permissions['posts:create'],
        permissions['posts:update'],
        permissions['dashboard:access'],
      ],
    },
    {
      name: 'user',
      description: 'Standard user with basic access',
      isDefault: true,
      permissions: [
        permissions['posts:create'],
        permissions['dashboard:access'],
      ],
    },
    {
      name: 'guest',
      description: 'Limited access for guests',
      isDefault: false,
      permissions: [
        permissions['posts:read'],
      ],
    },
  ]

  console.log('👥 Creating roles...')
  const roles = {}
  for (const roleData of rolesData) {
    const { permissions: rolePermissions, ...roleInfo } = roleData
    
    const role = await prisma.role.upsert({
      where: { name: roleInfo.name },
      update: {
        description: roleInfo.description,
        isDefault: roleInfo.isDefault,
      },
      create: roleInfo,
    })
    roles[roleData.name] = role
    console.log(`  ✓ ${roleData.name}`)

    // Clear existing permissions for this role
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    })

    // Assign permissions to role
    for (const permission of rolePermissions) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      })
    }
  }

  // Create admin user
  console.log('👤 Creating admin user...')
  const hashedPassword = await bcrypt.hash('Admin@123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nextblog.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@nextblog.com',
      password: hashedPassword,
      phone: '+1 (555) 000-0001',
      status: 'ACTIVE',
      roleId: roles['admin'].id,
    },
  })
  console.log(`  ✓ Admin user created: ${adminUser.email}`)

  // Create a test user for each role
  const testUsers = [
    { name: 'Moderator User', email: 'moderator@nextblog.com', role: 'moderator' },
    { name: 'Regular User', email: 'user@nextblog.com', role: 'user' },
    { name: 'Guest User', email: 'guest@nextblog.com', role: 'guest' },
  ]

  const testPassword = await bcrypt.hash('Test@123', 12)
  
  const createdUsers = [adminUser]
  for (const userData of testUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        password: testPassword,
        status: 'ACTIVE',
        roleId: roles[userData.role].id,
      },
    })
    createdUsers.push(user)
    console.log(`  ✓ ${userData.role} user created: ${user.email}`)
  }

  // Create 100 posts
  console.log('📰 Creating posts...')
  
  const postTitles = [
    'Getting Started with Next.js 15',
    'Understanding React Server Components',
    'Building Scalable APIs with Node.js',
    'Introduction to TypeScript',
    'CSS Grid Layout Complete Guide',
    'Mastering Flexbox in 2024',
    'Database Design Best Practices',
    'Authentication Strategies for Modern Apps',
    'State Management with Zustand',
    'Prisma ORM Deep Dive',
    'Building Real-time Applications',
    'Docker for Developers',
    'CI/CD Pipeline Setup Guide',
    'Testing React Applications',
    'Performance Optimization Tips',
    'Web Security Fundamentals',
    'GraphQL vs REST API',
    'Microservices Architecture',
    'Serverless Computing Guide',
    'Mobile-First Design Principles',
    'Accessibility in Web Development',
    'SEO Best Practices for Developers',
    'Git Workflow Strategies',
    'Code Review Best Practices',
    'Technical Documentation Guide',
  ]

  const postContents = [
    'This comprehensive guide covers everything you need to know about modern web development. We will explore the latest features and best practices that will help you build better applications.',
    'In this article, we dive deep into the core concepts and provide practical examples that you can apply to your own projects. Understanding these fundamentals is crucial for any developer.',
    'Learn how to implement this feature step by step with clear explanations and code samples. By the end of this tutorial, you will have a solid understanding of the topic.',
    'Explore the pros and cons of different approaches and find out which one is best suited for your specific use case. Making the right choice early can save you time and effort later.',
    'This tutorial walks you through the entire process from start to finish, including common pitfalls to avoid and tips for success. Follow along and build something amazing.',
    'Discover the hidden features and advanced techniques that will take your skills to the next level. These insights come from years of real-world experience.',
    'A practical guide with real-world examples and use cases that demonstrate how to apply these concepts effectively in production environments.',
    'Everything you need to know to get started quickly and efficiently. We have distilled the essential information into an easy-to-follow format.',
    'Deep dive into the architecture and design patterns that power modern applications. Understanding the underlying principles will make you a better developer.',
    'Tips and tricks from industry experts that will help you write cleaner, more maintainable code. These practices have been proven in large-scale applications.',
  ]

  const statuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
  
  // Delete existing posts to avoid duplicates on re-seed
  await prisma.post.deleteMany({})
  
  for (let i = 1; i <= 100; i++) {
    const titleIndex = (i - 1) % postTitles.length
    const contentIndex = (i - 1) % postContents.length
    const authorIndex = (i - 1) % createdUsers.length
    const statusIndex = i <= 70 ? 1 : (i <= 90 ? 0 : 2) // 70 published, 20 draft, 10 archived
    
    const title = `${postTitles[titleIndex]} - Part ${Math.ceil(i / postTitles.length)}`
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    const content = `${postContents[contentIndex]}\n\n${postContents[(contentIndex + 1) % postContents.length]}\n\nThis is post number ${i} in our series. Stay tuned for more content!`
    const excerpt = postContents[contentIndex].substring(0, 150) + '...'
    
    const createdDate = new Date()
    createdDate.setDate(createdDate.getDate() - (100 - i)) // Spread posts over last 100 days
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        status: statuses[statusIndex],
        authorId: createdUsers[authorIndex].id,
        publishedAt: statuses[statusIndex] === 'PUBLISHED' ? createdDate : null,
        createdAt: createdDate,
      },
    })
    
    if (i % 25 === 0) {
      console.log(`  ✓ Created ${i} posts...`)
    }
  }
  console.log(`  ✓ All 100 posts created!`)

  console.log('')
  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📋 Test Accounts:')
  console.log('  Admin:     admin@nextblog.com / Admin@123')
  console.log('  Moderator: moderator@nextblog.com / Test@123')
  console.log('  User:      user@nextblog.com / Test@123')
  console.log('  Guest:     guest@nextblog.com / Test@123')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
