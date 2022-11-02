/*
    - 为什么需要再次获取文件：
        使用eager同步获取组件内容，因为同步无法使路由懒加载，所以需要再获取一次组件
    - 如何为自动注册的路由添加自定义设置：
        在vue组件中直接添加script标签，在export default中添加routeroption对象，我们会自动读取该对象并天际到路由中
    - 自定义设置与自定注册的路由属性冲突
        自定义设置的属性值会覆盖路由中的属性值
    - 动态路由 addroute 问题
        起初想使用动态路由，但在路由挂载到实例之前未获取数据动态加载路由，之后再使用动态路由也无效，故使用同步方法，且直接返回路由表
*/

// 自动获取到的路由表
import routes from "./autoAddRouter";

// 同步获取组件内容
const fatherOptions = import.meta.glob("../layout/*.vue", { import: "default", eager: true });
const childOptions = import.meta.glob("../views/**/*.vue", { import: "default", eager: true });
// 匹配正则
const fatherReg = /(?<=layout\/).*(?=\.vue)/g;
const childReg = /(?<=views\/.*\/).*(?=\.vue)/g;

// 返回天际了自定义设置的路由表
function setOptions(routes) {
    // 遍历 layout 中的组件，获取内容
    for (let key in fatherOptions) {
        // 获取自定义设置，路由name，在路由表中的index
        const routerOptions = fatherOptions[key].routerOption;
        const name = key.match(fatherReg)[0].toLowerCase();
        const routerIndex = routes.findIndex((item) => item.name === name);
        // 如果设置了 nauto 属性，代表该组件不会自动注册到路由表，将之前注册的路由删除
        removeRouter(routerOptions, routerIndex, routes);
        //存在自定义设置与路由时，将设置添加到路由中
        if (routerOptions && routerIndex > -1) {
            const currentRouter = routes[routerIndex];
            const newRouter = Object.assign({ ...currentRouter }, routerOptions);
            routes[routerIndex] = newRouter;
        }
        // 如果存在自路由，且响应的组件中存在自定义设置，则将设置添加到路由中
        if (routes[routerIndex].children && routes[routerIndex].children.length > 0) {
            setChildOptions(routes[routerIndex].children, name);
        }
    }
    return routes;
}

// 删除设置了 nauto 属性的路由
function removeRouter(routerOptions, index, routes) {
    if (routerOptions && routerOptions.nauto) {
        routes.splice(index, 1);
    }
}

// 添加子路由的自定义设置
function setChildOptions(childRouter, fatherName) {
    for (let key in childOptions) {
        const routerOptions = childOptions[key].routerOption;
        const name = key.match(childReg)[0].toLowerCase();
        const childName = `${fatherName}${name}`;
        const routerIndex = childRouter.findIndex((item) => item.name === childName);
        if (routerOptions && routerIndex > -1) {
            const currentRouter = childRouter[routerIndex];
            const newRouter = Object.assign({ ...currentRouter }, routerOptions);
            childRouter[routerIndex] = newRouter;
        }
    }
}

export default setOptions(routes);
