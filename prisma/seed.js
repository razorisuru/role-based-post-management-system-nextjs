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
    where: { email: 'admin@rolebase.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@rolebase.com',
      password: hashedPassword,
      phone: '+1 (555) 000-0001',
      status: 'ACTIVE',
      roleId: roles['admin'].id,
    },
  })
  console.log(`  ✓ Admin user created: ${adminUser.email}`)

  // Create a test user for each role
  const testUsers = [
    { name: 'Moderator User', email: 'moderator@rolebase.com', role: 'moderator' },
    { name: 'Regular User', email: 'user@rolebase.com', role: 'user' },
    { name: 'Guest User', email: 'guest@rolebase.com', role: 'guest' },
  ]

  const testPassword = await bcrypt.hash('Test@123', 12)
  
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
    console.log(`  ✓ ${userData.role} user created: ${user.email}`)
  }

  console.log('')
  console.log('✅ Database seeded successfully!')
  console.log('')
  console.log('📋 Test Accounts:')
  console.log('  Admin:     admin@rolebase.com / Admin@123')
  console.log('  Moderator: moderator@rolebase.com / Test@123')
  console.log('  User:      user@rolebase.com / Test@123')
  console.log('  Guest:     guest@rolebase.com / Test@123')
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
