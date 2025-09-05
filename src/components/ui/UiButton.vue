<template>
  <button class="ui-button" v-bind="$attrs" :class="classes" :disabled="loading || disabled">

    <div v-if="loading"> loading...</div>
    <slot v-else></slot>
  </button>
</template>

<script>
import {computed, defineComponent} from 'vue'
import {UI_SIZES} from "@/components/ui/constants/uiSizes.js";
import {UI_VARIANTS} from "@/components/ui/constants/uiVariants.js";

export default defineComponent({
  name: "UiButton",
  props: {
    size: {
      default: UI_SIZES.MEDIUM,
      type: String,
      validator: (value, props) => Object.values(UI_SIZES).includes(value),
    },
    variant: {
      default: UI_VARIANTS.BASE,
      type: String,
      validator: (value, props) => Object.values(UI_VARIANTS).includes(value),
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {

    const classes = computed(() => {

      return {
        [`variant_${props.variant}`]: true,
        [`size_${props.size}`]: true,
        loading: props.loading,
        disabled: props.disabled,
      }
    })

    return {
      classes
    }
  }
})
</script>

<style scoped lang="scss">

.ui-button {
  border-radius: $base-border-radius;
  padding: 0.5em 1.25em;
  cursor: pointer;
  transition: border-color 0.15s, opacity 0.25s;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;

  &:disabled,
  .loading {
    user-select: none;
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
  }

  .loading {
    cursor: wait;
  }

  @media (hover: hover) {

    &:hover:not(.loading),
    {
      border-color: currentColor;
    }
  }

  &:active {
    border-color: currentColor;
  }

}

.variant {

  &_primary {
    border: 1px solid $primary-color;
    background-color: $primary-color;
    font-weight: bold;
  }

  &_base {
    border: 1px solid $main-text-color;
    background-color: $accent-color;
  }

  &_danger {
    border: 1px solid $danger-color;
    background-color: $danger-color;
  }

}

.size {

  &_sm {
    font-size: 1.5rem;
  }

  &_md {
    font-size: 2rem;
  }

  &_lg {
    font-size: 2.5rem;
  }

}


</style>