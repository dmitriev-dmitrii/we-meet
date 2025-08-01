<template>
  <input class="ui-text-input" type="text" v-bind="$attrs" :class="classes" >
  <div v-if="loading">loading ...</div>
</template>

<script>

import {computed, defineComponent} from 'vue'

export default defineComponent({
  name: "UiTextInput",
  props: {
    size: {
      default: 'base',
      type:String,
      validator: (value, props) => ['small', 'base', 'large'].includes(value),
    },
    loading: {
      type:Boolean,
      default: false
    },
    disabled: {
      type:Boolean,
      default: false
    }
  },
  setup(props) {

    const classes = computed(() => {

      return {
        [`size-${props.size}`]: true,
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

<style lang="scss" scoped>

.ui-text-input {
  border-radius: $base-border-radius;
  border: 1px solid rgba(0, 0, 0, 0);
  padding: 0.5em ;
  transition: border-color 0.25s;
  display: block;
  box-sizing: border-box;
  width: 100%;

  @media (hover: hover) {
    &:hover {
      border-color:$primary-color;
    }
  }
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
}

.size {
  &_small {
    font-size: 1.5rem;
  }

  &_base {
    font-size: 1.75rem;
    min-height: 4rem;
  }

  &_large {
    font-size: 2rem;
  }
}

</style>