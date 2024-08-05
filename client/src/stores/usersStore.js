import { defineStore } from 'pinia';

export const useUsersStore = defineStore('users', {
  state: () => {
    return { 
      users: [],
      allUsers: [],
      totalUsers: 0,
      currentPage: 1,
      totalPages: 1,
      user: null
    }
  },
  actions: {
    async fetchUsers() {
      try {
        const response = await fetch('https://vue-user-list.onrender.com/api/users/all');
        const data = await response.json();
        
        this.allUsers = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchUserById(userId) {
      try {
        const response = await fetch(`https://vue-user-list.onrender.com/api/users/${userId}`);
        const data = await response.json();

        this.user = data;
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPaginatedUsers(page, limit) {
      try {
        const response = await fetch(`https://vue-user-list.onrender.com/api/users/paginate?page=${page}&limit=${limit}`);
        const data = await response.json();
        
        this.users = data.users;
        this.totalUsers = data.total;
        this.currentPage = data.page;
        this.totalPages = data.totalPages;
      } catch (error) {
        console.error(error);
      }
    }
  }
});
