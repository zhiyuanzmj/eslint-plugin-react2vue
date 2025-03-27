# eslint-plugin-react2vue

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

This is an ESLint plugin for converting the React Hooks API to the Vue Composition API for [vue-jsx-vapor](https://github.com/vuejs/vue-jsx-vapor).

Suggest using [unplugin-auto-imports](https://github.com/unplugin/unplugin-auto-import) to automatically import the Vue Composition API.

## Setup

.vscode/settings.json

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,

  // Auto fix
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
  },
}
```

eslint.config.ts

```ts
import parserTs from '@typescript-eslint/parser'
import react2vue from 'eslint-plugin-react2vue'

export default {
  files: ['**/*.tsx'],
  languageOptions:{
    parser: parserTs, // support ts
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    'react2vue/useEffect': 'error',
    'react2vue/useState': 'error',
    'react2vue/useImperativeHandle': 'error',
    'react2vue/forwardRef': 'error',
    'react2vue/useMemo': 'error',
    'react2vue/useCallback': 'error',
    'react2vue/defineComponent': 'error',
    'react2vue/defineSlots': 'error',
  },
  plugins: {
    react2vue,
  },
}
```

### useState

```ts
// before
const [foo, setFoo] = useState(count)
console.log([foo, setFoo(1), setFoo])

// after
const foo = ref(0)
console.log([foo.value, foo.value = 1, val => foo.value = val])
```

### useEffect

Use `watchEffect` instead of `useEffect`.

```ts
// before
useEffect(() => {
  console.log(foo)
}, [foo])

// after
watchEffect(() => {
  console.log(foo)
})
```

### useMemo

Use `computed` instead of `useMemo`.

```ts
// before
const double = useMemo(() => foo * 2, [foo])
console.log({ double }, [double])

// after
const double = computed(() => foo * 2)
console.log({ double: double.value }, [double.value])
```

### defineComponent

Use `defineComponent` macro to support destructuring props.

```tsx
// before
const Comp = ({ count = 1 }) => {
  return <div>{count}</div>
}

// after
const Comp = defineComponent(({ count = 1 }) => {
  return <div>{count}</div>
})
```


### defineSlots

Use `defineSlots` instead of `children` prop.

```tsx
// before
const Comp = ({ children }) => {
  return children
}

// after
const Comp = ({ children }) => {
  const slots = defineSlots()
  return <slots.default />
}
```


### useCallback

Remove useCallback.

```ts
// before
const callback = useCallback(() => {
  console.log(foo)
}, [foo])

// after
const callback = () => {
  console.log(foo)
}
```


### forwardRef

Remove forwardRef.

```tsx
// before
const Comp = forwardRef(({ count }, ref) => {
  return <div>{count}</div>
})

// after
const Comp = ({ count }) => {
  return <div>{count}</div>
}
```


### useImperativeHandle

Use `defineExpose` instead of `useImperativeHandle`

```tsx
// before
const Comp = ({ count, ref }) => {
  useImperativeHandle(ref, () => {
    return {
      count: count * 2
    }
  }, [count])
  return <div>{count}</div>
}

// after
const Comp = ({ count }) => {
  defineExpose(computed(() => {
    return {
      count: count * 2
    }
  }))
  return <div>{count}</div>
}
```



## License

[MIT](./LICENSE) License © [zhiyuanzmj](https://github.com/zhiyuanzmj)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/eslint-plugin-react2vue?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/eslint-plugin-react2vue
[npm-downloads-src]: https://img.shields.io/npm/dm/eslint-plugin-react2vue?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/eslint-plugin-react2vue
[bundle-src]: https://img.shields.io/bundlephobia/minzip/eslint-plugin-react2vue?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=eslint-plugin-react2vue
[license-src]: https://img.shields.io/github/license/zhiyuanzmj/eslint-plugin-react2vue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/zhiyuanzmj/eslint-plugin-react2vue/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/eslint-plugin-react2vue
