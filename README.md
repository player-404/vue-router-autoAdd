# vue 自动注册路由案例

### 目录

-   layout: 该文件夹下的所有 vue 文件为自动注册为一级路由
-   views：该文件夹下的与 layout 同名的文件夹下的所有 vue 文件会注册为相应路由的子路由(二级路由)

### 使用

-   注册父路由
    -   在 layout 中添加组件注册父路由
-   注册子路由

    -   在 views 中创建与 layout 下组件的同名文件夹后创建 vue 文件创建子路由

-   自定义配置路由
    -   在 vue 文件中另创建`script`标签(vue3),`export default`对象中添加 `routerOption`对象，该对象下的所有属性会自动添加到路由中
    -   `routerOption`中的属性值会覆盖路由表中的属性

```js
<script>
export default {
    routerOption: {
        path: "/123",
    },
};
</script>
```

-   禁止自动注册
    -   `routerOption`对象中添加 `nauto` 属性，设置为 `true`

### 代码

相关代码在 router 文件夹下
