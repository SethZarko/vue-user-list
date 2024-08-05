// Imports
import { createRouter, createWebHistory } from 'vue-router';

// Componenents
import UsersList from './pages/UsersList.vue'
import UserPage from './pages/UserPage.vue'
import AddUser from './pages/AddUser.vue'
import EditUser from './pages/EditUser.vue'

// Routes
const routes = [
  { path: '/', component: UsersList },
  { path: '/:id', component: UserPage, props: true },
  { path: '/user', component: AddUser },
  { path: '/edit/:id', component: EditUser, props: true }
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

// Export Router
export default router;