<script>
import { useUsersStore } from '../stores/usersStore.js';
import { useToast } from 'vue-toastification';

export default {
  props: ['id'],
  data() {
    return {
      usersStore: useUsersStore(),
      user: null,
      toast: useToast()
    };
  },
  async mounted() {
    const userId = this.id;
    this.user = await this.usersStore.fetchUserById(userId);

    // Display toast message if present in the query
    const toastMessage = this.$route.query.toast;
    if (toastMessage) {
      this.toast.success(toastMessage);
      this.$router.replace({ query: { ...this.$route.query, toast: null } });
    }
  },
  methods: {
    async deleteUser(userId) {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        const data = await response.json();
        this.toast.success(data.message);

        // Redirect to the home page with a success toast message
        this.$router.push({ path: '/' });
      } catch (error) {
        console.error('Error deleting user:', error);
        this.toast.error('Failed to delete user');
      }
    }
  }
};
</script>

<template>
  <section id="user-section">
    <div v-if="user" class="user-container">
      <div class="user-info-container">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Name:</strong> {{ user.profile.name }}</p>
        <p><strong>Status:</strong> {{ user.profile.status ? 'Active' : 'Inactive' }}</p>
        <p class="user-bio"><strong>Bio:
        </strong>  <br/> <br/>
        {{ user.profile.bio }}</p>
      </div>

      <div class="user-btn-container">
        <router-link :to="`/edit/${user.id}`" class="edit-btn">Edit User</router-link>
        <button @click="deleteUser(user.id)" class="delete-btn">Delete User</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* USER */
#user-section {
  width: 100%;
  margin-bottom: 20em;
}

.user-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 90%;
  max-width: 850px;
  margin: 2em auto;
  padding: 2em;
  border: solid white 1px;
  background: rgba(10, 50, 120, 0.15);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.65);
  transition: box-shadow 0.3s ease;
}

.user-info-container {
  width: 100%;
  margin-bottom: 2em;
}

.user-info-container p {
  font-family: 'Roboto-mono', sans-serif;
  color: white;
  letter-spacing: 1px;
  line-height: 1.6;
}

.user-bio {
  width: 90%;
  border: solid 0.15px crimson;
  border-radius: 5px;
  padding: 1em;
  margin: 1em 0;
}

.user-btn-container {
  display: flex;
  align-items: center;
  gap: 1em;
}

.user-btn-container a,
.user-btn-container button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.5px;
  border: solid 1px white;
  padding: 0.65em 1em;
  color: white;
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.35);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.edit-btn {
  background: rgb(110, 100, 40);
  transition: ease-in .2s;
}

.delete-btn {
  background: rgb(150, 30, 30);
  transition: ease-in .2s;
}

.edit-btn:hover {
  background: rgba(130, 110, 50, 0.65);
}

.delete-btn:hover {
  background: rgba(150, 30, 30, 0.65);
  transition: ease-in .2s;
}

@media (min-width: 650px) {
    .user-container {
        flex-direction: row;
    }

    .user-info-container {
        margin-bottom: 0;
    }

    .user-btn-container {
        flex-direction: column;
    }

    .user-btn-container a, .user-btn-container button  {
        width: 150px;
        font-size: 1rem;
    }
}
</style>