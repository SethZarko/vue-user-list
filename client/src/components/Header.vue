<script>
    import Nav from './Nav.vue'

    export default {
        components: {
            Nav
        }

    }
</script>

<template>
    <header>
        <div class="header-container">
            <h1>UserLists</h1>
            <Nav />
        </div>
    </header>
</template>

<style scoped>
/* HEADER */
header {
    padding: 1.5em;
}

.header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-container h1 {
    font-family: 'Montserat', sans-serif;
    color: white;
}

@media (max-width: 600px) {
    .header-container {
        display: block;
        text-align: center;
    }
}
</style>

