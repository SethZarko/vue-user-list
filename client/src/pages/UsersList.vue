<script>
import { useUsersStore } from '../stores/usersStore.js';
import { useToast } from 'vue-toastification';

export default {
  data() {
    return {
      usersStore: useUsersStore(),
      allUsers: [],
      filteredUsers: [],
      unpaginatedUsers: [],
      search: '',
      limit: 10,
      toast: useToast()
    }
  },
  async mounted() {
    await this.usersStore.fetchPaginatedUsers(1, this.limit); // Call Fetch Paginated Users
    await this.usersStore.fetchUsers() // Call Fetch Users

    this.allUsers = this.usersStore.users; // Store Fetched Paginated Users
    this.filteredUsers = this.allUsers; // Default to showing all users on mount
    this.unpaginatedUsers = this.usersStore.allUsers; // Store All Users

    const toastMessage = this.$route.query.toast; // Assign Toast Message from ID User Page

    if (toastMessage) { // Display Toast Message if Present
      this.toast.success(toastMessage); // Display
      this.$router.replace({ query: { ...this.$route.query, toast: null } }); // Clear Router Query
    }
  },
  methods: {
    // Change Page Onclick - PREV / NEXT
    async changePage(page) {
      await this.usersStore.fetchPaginatedUsers(page, this.limit);
      this.allUsers = this.usersStore.users;
      this.filterUsers(this.search); // Reapply filter after changing page
    },
    // Go to Individual User Profile
    goToUser(userId) {
      this.$router.push(`/${userId}`);
    },
    // Filter Users by Email
    filterUsers(searchTerm) {
      if (!searchTerm) {
        this.filteredUsers = this.allUsers;
        return;
      }
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      this.filteredUsers = this.unpaginatedUsers.filter(user =>
        user.email.toLowerCase().includes(lowercasedSearchTerm)
      );
    },
    // Handle Search Input
    handleSearch() {
      this.filterUsers(this.search);
    },
    // Set Limit and Fetch Users
    async setLimit(event) {
      const newLimit = Number(event.target.value);

      // Reset limit to 10 if condition is met
      if (this.disableLimitInput) {
        this.limit = 10;
        // Refresh the page
        this.$router.go(0);
      } else {
        this.limit = newLimit;
      }

      // Fetch users with the new limit
      await this.usersStore.fetchPaginatedUsers(this.currentPage, this.limit);

      this.allUsers = this.usersStore.users; // Store Fetched Users
      this.filteredUsers = this.allUsers; // Default to showing all users
    }
  },
  computed: {
    currentPage() {
      return this.usersStore.currentPage;
    },
    totalPages() {
      return this.usersStore.totalPages;
    },
    disableLimitInput() {
      const maxUsersDisplayable = this.unpaginatedUsers.length / this.limit;
      return maxUsersDisplayable < this.usersStore.currentPage;
    }
  }
}
</script>



<template>
  <section id="user-list">
    <div class="search-container">
      <input type="text" v-model="search" placeholder="Search by email" @input="handleSearch" />
    </div>

    <div class="list-container">
      <div class="pagination-controls" v-if="!search">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>
      <br>

      <!-- Display filtered users or all users based on search -->
      <div class="limit-container">
        <p>Users Per Page:</p>
        <input type="number" v-model="limit" @input="setLimit" min="1" max="10">
      </div>

      <ul v-if="filteredUsers.length">
        <div class="list-items-container" v-for="user in filteredUsers" :key="user.id" @click="goToUser(user.id)">
          <li>
            <p>ID: </p>{{ user.id }}
          </li>
          <hr>
          <li>
            <p>Email: </p>{{ user.email }}
          </li>
          <li>
            <p>Name: </p>{{ user.profile.name }}
          </li>
          <li>
            <p>Status: </p>{{ user.profile.status ? 'Active' : 'Inactive' }}
          </li>
        </div>
      </ul>
      <ul v-if="filteredUsers.length === 0" class="list-items-container">
        <li class="no-user">
          <p>User Does Not Exist</p>
        </li>
      </ul>

      <br>
      <hr>
    </div>
  </section>
</template>



<style scoped>
/* USERS LIST */
#user-list {
  width: 100%;
  max-width: 1200px;
  height: 100%;
  min-height: 800px;
  margin: 0 auto;
  padding: 2em;
}

.list-container {
  width: 100%;
  margin: 0 auto;
  border: solid 1px white;
  border-radius: 10px;
  padding: 0.5em;
}

.list-items-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  border: solid white 2px;
  border-radius: 10px;
  background: rgba(100, 100, 100, 0.35);
  margin: 0.5em 0;
  padding: 1em;
  cursor: pointer;
  transition: background 0.2s ease-in;
}

.list-items-container:hover {
  background: rgba(200, 200, 200, 0.45);
}

.list-items-container li {
  display: flex;
  align-items: center;
  font-family: 'Roboto-mono', sans-serif;
  padding: 1em;
  color: white;
  letter-spacing: 1px;
  flex: 1 1 200px;
  box-sizing: border-box;
}

.list-items-container li p {
  color: rgb(200, 200, 200);
  font-weight: 600;
  margin-right: 0.5em;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination-controls button {
  font-family: 'Poppins', sans-serif;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-controls span {
  font-family: 'Roboto-mono', sans-serif;
  color: white;
}

hr {
  display: none;
}

.search-container {
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
}

.search-container input {
  width: 80%;
  max-width: 600px;
  padding: 0.75em;
  font-size: 1em;
  border: 2px solid white;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-family: 'Roboto-mono', sans-serif;
  transition: background-color 0.3s, border-color 0.3s;
}

.search-container input::placeholder {
  color: rgb(200, 200, 200);
}

.search-container input:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
}

.no-user {
  display: flex;
  align-items: center;
  justify-content: center;
}

.limit-container {
  font-family: 'Poppins', sans-serif;
  display: flex;
  gap: 1em;
  margin: 1.25em;
  color: white;
}

.limit-container input {
  width: 50px;
}

@media (max-width: 1080px) {
  .list-items-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .list-items-container li {
    padding: 1em;
    flex: 0;
  }

  hr {
    display: block;
    width: 90%;
    margin: 0 auto;
  }
}
</style>