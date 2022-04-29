<template>
  <div>
    <NuxtLink v-for="({to, label}, index) in navItemList"
              :key="index"
              :to="to"
              style="margin: 15px;"
    >
      {{ label }}
    </NuxtLink>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      navItemList: [
        {
          label: 'About us',
          to: '/about-us'
        },
        {
          label: 'Home',
          to: '/'
        }
      ]
    }
  }
}
</script>
