<template>
  <div>
    <NuxtLink v-for="({to, label}, index) in navigationLinks"
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
  computed: {
    navigationLinks() {
      const links = Object.values(this.$store.getters['Umbraco/getGlobalDataByKey']('websiteMainNavigation').children) || []

      return links.map(link => {
        return {
          label: link.navMainItemTitle,
          to: link.navMainItemLink
        }
      })
    }
  }
}
</script>
