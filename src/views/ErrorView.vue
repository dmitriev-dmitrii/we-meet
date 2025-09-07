<template>
  <main>

    <h1>
      {{ status }}
    </h1>

    <h2>{{ statusText }}</h2>

    <p>
      {{ message }}
    </p>

    <UiButton @click="onHomeClick" :variant="UI_VARIANTS.PRIMARY" :size="UI_SIZES.LARGE">Go home page →</UiButton>

    <p v-if="errorId"> error id : {{ errorId }}</p>
  </main>
</template>

<script>
import {defineComponent, unref} from 'vue'
import UiButton from "@/components/ui/UiButton.vue";
import {useRoute, useRouter} from "vue-router";
import {UI_SIZES} from "@/components/ui/constants/uiSizes.js";
import {UI_VARIANTS} from "@/components/ui/constants/uiVariants.js";
import {ROUTER_NAMES} from "@/router/constants/routerNames.js";

export default defineComponent({
  name: "ErrorView",
  components: {UiButton},
  props: {
    status: {
      default: '',
    },
    statusText: {
      default: 'Unknown Error',
    },
    message: {
      default: 'Oops...'
    },
    errorId: {
      default: ''
    },
  },
  setup() {
    const router = useRouter()
    const onHomeClick = async () => {
      await router.push({name: ROUTER_NAMES.HOME})
    }
    return {
      onHomeClick,
      UI_VARIANTS,
      UI_SIZES
    }
  }
})
</script>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

h1, h2 {
  font-size: 6rem;
  padding: 0;
  margin: 0;
}

p {
  padding: 0;
  margin: 3rem 0;
}

</style>