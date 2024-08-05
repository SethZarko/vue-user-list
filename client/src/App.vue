<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

export default {
    components: {
        Header,
        Footer
    }
}

</script>

<template>
    <div id="app-container">
        <Header />
        <main>
            <router-view></router-view>
        </main>
        <Footer />
    </div>
</template>