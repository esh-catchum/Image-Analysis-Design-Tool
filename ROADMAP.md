# Пошаговая миграция с React на Vue 3

## **Этап 1: Подготовка**

1. **Анализ зависимостей**
   - Создайте матрицу совместимости для всех зависимостей (особенно Radix UI, который нужно будет заменить на эквиваленты Vue, например Headless UI или PrimeVue)
   - Пример замен:
     - `react-hook-form` → `vee-validate` или `vuelidate`
     - `clsx` → `classnames` (аналог для Vue)
     - `tailwind-merge` → `tailwind-variants`

2. **Настройка песочницы**

   ```bash
   npx nuxi init vue-migration-sandbox
   cd vue-migration-sandbox && npm i
   ```

   - Протестируйте ключевые интеграции (Tailwind, Pinia, Composables) в изолированной среде.

3. **Создание карты компонентов**

   | React-компонент | Vue-аналог | Статус |
   |----------------|------------|--------|
   | `DesignCanvas` | `Canvas.vue` | ❌ |
   | `Toolbar` | `Toolbar.vue` | ❌ |

---

### **Этап 2: Инкрементальная миграции**

#### **Вариант A: Микросервисный подход (рекомендуется)**

1. **Настройка Module Federation**:

   ```javascript
   // next.config.mjs
   const { withModuleFederation } = require('@module-federation/nextjs');

   module.exports = withModuleFederation({
     name: 'host',
     remotes: {
       vueApp: 'vueApp@http://localhost:3001/remoteEntry.js',
     },
   });
   ```

2. **Постепенная замена роутов**:

   ```text
   pages/
   ├─ legacy/ (Next.js)
   └─ modern/ (Nuxt, начинаем с наименее связанных страниц)
   ```

#### **Вариант B: Слой совместимости**

1. **Использование `@vue/compat`**:

   ```javascript
   // vite.config.js
   export default defineConfig({
     vue: {
       compilerOptions: {
         compatConfig: {
           MODE: 3,
           GLOBAL_MOUNT: true, // Поддержка rootComponent
         }
       }
     }
   })
   ```

2. **Обертка React-компонентов**:

   ```vue
   <!-- VueWrapper.vue -->
   <template>
     <div ref="reactRoot"></div>
   </template>

   <script setup>
   import { mountReactComponent } from '@/lib/react-compat';

   onMounted(() => {
     mountReactComponent(this.$refs.reactRoot, 'DesignCanvas');
   });
   </script>
   ```

---

### **Этап 3: Перенос ключевых систем**

1. **Состояние (Redux → Pinia)**:

   ```typescript
   // stores/design.ts
   export const useDesignStore = defineStore('design', {
     state: () => ({
       elements: [] as Element[],
       history: [] as HistoryState[],
     }),
     actions: {
       addElement(element: Omit<Element, 'id'>) {
         // Аналог addElement из design-context
       }
     }
   });
   ```

2. **Стили**:
   - Перенесите Tailwind-конфиг с заменой `@apply` на `@screen` где нужно
   - Конвертируйте CSS-переменные:

     ```css
     :root {
       --sidebar-bg: hsl(var(--sidebar-background));
     }
     ```

3. **Hooks → Composables**:

   ```typescript
   // composables/useMobile.ts
   export default function () {
     const isMobile = ref(false);
     
     const checkMobile = () => {
       isMobile.value = window.innerWidth < 768;
     };

     onMounted(() => {
       window.addEventListener('resize', checkMobile);
       checkMobile();
     });

     return { isMobile };
   }
   ```

---

### **Этап 4: Оптимизация**

1. **Замена бандлера**:
   - Если использовался Webpack → Vite:

   ```bash
   npm uninstall webpack webpack-cli
   npm i -D vite @vitejs/plugin-vue
   ```

2. **Анализ производительности**:

   ```bash
   npx nuxt build --analyze
   ```

3. **Тестирование**:
   - Настройте Cypress Component Testing для Vue-компонентов
   - Обновите тесты Jest → Vitest

---

### **Рекомендации по сложным частям**

1. **Динамический рендеринг (аналог ReactDOM.render)**:

   ```typescript
   const { createApp } = await import('vue');
   const vueApp = createApp(DynamicComponent);
   vueApp.mount(domNode);
   ```

2. **Портирование Context API**:
   - Используйте `provide/inject` + `computed` для реактивности:

   ```vue
   <script setup>
   const elements = ref<Element[]>([]);
   provide('design-context', {
     elements,
     updateElement: (id, props) => { /*...*/ }
   });
   </script>
   ```

3. **Маршрутизация**:

   ```ts
   // nuxt.config.ts
   export default defineNuxtConfig({
     pages: true,
     routeRules: {
       '/legacy/**': { ssr: false }, // Прокси к Next.js
     },
   });
   ```

---

Для минимизации downtime рассмотрите Canary-развертывание с feature-флагами:

```vue
<template>
  <ReactDesignTool v-if="flags.useReact" />
  <VueDesignTool v-else />
</template>
```

Ключевой метрикой успеха будет процент перенесенных компонентов без регрессий в производительности.
