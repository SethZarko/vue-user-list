<script>
    export default {
        
    }
</script>

<template>
    <nav>
        <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/user">Add User</router-link></li>
        </ul>
    </nav>
</template>

<style scoped>
/* NAV */
nav ul {
    padding: 0;
    margin: 0;
    display: flex;
}
  
nav ul li {
    position: relative;
}
  
nav ul li a {
    text-decoration: none; 
    font-family: "Poppins", sans-serif;
    font-size: 1rem;
    color: white; 
    padding: 1em;
    letter-spacing: 1px;
    transition: ease-in .1s;
}
  
nav ul li a::after {
    content: ''; 
    position: absolute;
    width: 0;
    height: 2px;
    display: block;
    margin-top: 5px; 
    right: 0;
    transition: width 0.3s ease;
}
  
nav ul li a:hover::after {
    width: 50%;
    margin: 0 auto;
    left: 0;
    background: white;
}

nav ul li a:hover {
    color: rgba(200, 200, 200);
}

@media (max-width: 375px) {
    nav ul li a {
        font-size: 0.9rem;
    }
}

@media (max-width: 600px) {
    nav ul {
        margin-top: 1.5em;
        justify-content: center;
    }
}
</style>


