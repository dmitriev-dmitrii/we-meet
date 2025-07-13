<template>
  <button class="ui-button" v-bind="$attrs" :class="classes" :disabled="loading || disabled">

    <div v-if="loading"> loading...</div>
    <slot v-else></slot>
  </button>
</template>

<script>
import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: "UiButton",
  props: {

    size: {
      default: 'base',
      type: String,
      validator: (value, props) => ['small', 'base', 'large'].includes(value),
    },
    theme: {
      default: 'base',
      type: String,
      validator: (value, props) => ['primary', 'base', 'danger'].includes(value),
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
        [`theme_${props.theme}`]: true,
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
  border: 1px solid rgba(0, 0, 0, 0);
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

.theme {

  &_primary {
    background-color: $primary-color;
    font-weight: bold;
  }

  &_base {
    background-color: $accent-color;
  }

  &_danger {
    background-color: $danger-color;
  }

}

.size {

  &_small {
    font-size: 1.5rem;
  }

  &_base {
    font-size: 1.75rem;
  }

  &_large {
    font-size: 2rem;
  }

}


</style>