import 'dotenv/config'
import express from 'express'
import prisma from './prisma/database.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Create User 
app.post('/api/users/create', async (req, res) => {
    const { email, name, status, bio } = req.body;

    try {
      const newUser = await prisma.user.create({
        data: {
          email,
          profile: {
            create: {
              name,
              status: status ?? true,
              bio
            }
          }
        },
        include: {
          profile: true
        }
      });

        res.status(201).json({ message: 'User Created Successfully!'})
    } catch (error) {
      console.error(error); 
      res.status(500).json({ message: 'Error' });
    }
})

// Get All Users
app.get('/api/users/all', async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany({
      include: {
        profile: true
      },
      orderBy: {
        createdAt: 'desc'
      },
    })
    res.status(200).json(allUsers)
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error' });
  }
});

// Get All Users - Paginated
app.get('/api/users/paginate', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
      const allUsers = await prisma.user.findMany({
          skip: skip,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
              profile: true       
          }
      });
      const totalUsers = await prisma.user.count();
      res.status(200).json({
          users: allUsers,
          total: totalUsers,
          page: page,
          totalPages: Math.ceil(totalUsers / limit),
      });
  } catch (error) {
     console.error(error); 
     res.status(500).json({ message: 'Error' });
  }
});

// Get Single User
app.get('/api/users/:id', async (req, res) => {
    const userId = parseInt(req.params.id, 10);
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
      });
  
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching user' });
    }
}); 

// Update User
app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, bio, status } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { profile: true }
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Build the data object conditionally
    const dataToUpdate = {};
    if (email) dataToUpdate.email = email;

    // Build the profile update object conditionally
    const profileDataToUpdate = {};
    if (name) profileDataToUpdate.name = name;
    if (bio) profileDataToUpdate.bio = bio;
    if (typeof status === 'boolean') profileDataToUpdate.status = status;

    // Only include the profile update if there are fields to update
    if (Object.keys(profileDataToUpdate).length > 0) {
      dataToUpdate.profile = {
        update: profileDataToUpdate
      };
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: { profile: true }
    });

    res.status(200).json({
      data: updatedUser,
      message: 'User Information Updated Successfully!',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Delete  User
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        profile: true,
      },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userExists.profile) {
      await prisma.profile.delete({
        where: { userId: parseInt(id) },
      });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'User Deleted Successfully!' });
  } catch (error) {
    console.error('Error Deleting user:', error);
    res.status(500).json({ message: 'Failed to Delete user' });
  }
});

// Run Server
const PORT = process.env.PORT || 8000
const server = app.listen(PORT, () => console.log(`Server Running on PORT: ${PORT}`))

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Server is shutting down...')
  try {
      await prisma.$disconnect()
      console.log('Prisma disconnected.')
      server.close(() => {
          console.log('Server closed.')
          process.exit(0)
      })
  } catch (err) {
      console.error('Error during disconnection:', err)
      process.exit(1)
  }
})