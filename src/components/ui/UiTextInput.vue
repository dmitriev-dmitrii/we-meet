<template>
  <input
      class="ui-text-input"
      type="text"
      v-bind="$attrs"
      :class="classes"
      :value="$attrs.modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :disabled="disabled || loading"
  >
  <div v-if="loading">loading ...</div>
</template>

<script>
import {computed, defineComponent} from 'vue'
import {UI_SIZES} from "@/components/ui/constants/uiSizes.js";

export default defineComponent({
  name: "UiTextInput",
  props: {
    size: {
      default: UI_SIZES.MEDIUM,
      type: String,
      validator: (value) => Object.values(UI_SIZES).includes(value),
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
        [`size_${props.size}`]: true,
        'loading': props.loading,
        'disabled': props.disabled,
      }
    })

    return {
      classes
    }
  }
})
</script>

<style lang="scss" scoped>

.ui-text-input {
  border-radius: $base-border-radius;
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 0.35em 0.5em 0.5em 0.5em;
  transition: border-color 0.25s;
  display: block;
  box-sizing: border-box;
  width: 100%;

  &:focus::placeholder {
    color: rgba(0,0,0,0);
  }


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
    &:hover:not([disabled]):not(.loading) {
      border-color: $primary-color;
    }
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