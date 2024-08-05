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
    async updateUser() {
      try {
        // Call the update API
        const response = await fetch(`http://localhost:8000/api/users/${this.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.user.email,
            name: this.user.profile.name,
            bio: this.user.profile.bio,
            status: this.user.profile.status
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update user');
        }

        const data = await response.json();
        this.toast.success(data.message);

        // Redirect to the individual user page with a success toast message
        this.$router.push({ path: `/${this.id}` });
      } catch (error) {
        console.error('Error updating user:', error);
        this.toast.error('Failed to update user');
      }
    }
  }
};
</script>

<template>
    <section v-if="user" id="edit-user-section">
      <h1>Editing User: {{ user.profile.name }}</h1>
      <form @submit.prevent="updateUser">
        <label>Email</label>
        <input type="text" v-model="user.email" placeholder="Email">
        <label>Name</label>
        <input type="text" v-model="user.profile.name" placeholder="Name">
        <label class="user-label">
          User Status
          <input type="checkbox" v-model="user.profile.status">
        </label>
        <label>User Bio</label>
        <textarea name="bio" v-model="user.profile.bio" placeholder="Bio"></textarea>
        <button type="submit">Update User</button>
      </form>
    </section>
  </template>
  
  <style scoped>
  /* Include modern CSS styling here */
  #edit-user-section {
    width: 90%;
    max-width: 600px;
    margin: 1em auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.65);
    transition: box-shadow 0.3s ease;
  }
  
  h1 {
    font-family: 'Poppins', sans-serif;
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-family: 'Montserrat', sans-serif;
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 10px;
    color: #555;
  }

  .user-label {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 3em;
  }

  input[placeholder], textarea[placeholder] {
    font-family: 'Roboto-mono', sans-serif;
    letter-spacing: 1px;
  }
  
  input[type="text"],
  textarea {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  input[type="text"]:focus,
  textarea:focus {
    outline: none;
    border-color: #007bff;
  }
  
  input[type="checkbox"] {
    margin-right: 10px;
  }
  
  input[type="checkbox"]:focus {
    outline: none;
    box-shadow: 0 0 3px 3px rgba(0, 123, 255, 0.25);
  }
  
  button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
  </style>
  