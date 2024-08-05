<script>
    export default {
        data() {
            return {
                year: new Date().getFullYear(),
            }
        }
    }
</script>

<template>
    <footer>
        <small>UserLists. Seth Web Dev. {{  year  }}&copy;</small>
    </footer>
</template>

<style scoped>
/* FOOTER */
footer {
    width: 100%;
    padding: 2em;
    display: flex;
    align-items: center;
    justify-content: center;
}

footer small {
    font-family: 'Poppins', sans-serif;
    color: white;
}
</style>