/*
    使用:
       - layout 下的组件为一级路由
       - views 下的组件为二级路由(子路由)， 子路由文件夹名称需要与layout下的组件(父路由)同名，文件夹下的所有组件会注册为子路由
*/

// 没有使用 eager 同步获取组件，使得路由可以懒加载
const fatherRouter = import.meta.glob("../layout/*.vue", { import: "default" });
const childRouter = import.meta.glob("../views/**/*.vue", { import: "default" });

// 匹配 layout 与 views 下的组件正则
const fatherReg = /(?<=layout\/).*(?=\.vue)/g;
const folderReg = /(?<=views\/).*(?=\/)/g;
const childReg = /(?<=views\/.*\/).*(?=\.vue)/g;

// 获取所有 routes
function getRouter() {
    // 所有路由表
    const routes = [];

    // 遍历自动导入的layout下的组件，设置为一级路由
    Object.keys(fatherRouter).forEach((item) => {
        // 获取组件的名称（路由的name）
        const name = item.match(fatherReg)[0].toLowerCase();

        //判断是否在views下存在同名的文件夹（判断是否存在子路由）
        let children = hasChildRouter(name);
        if (children.length > 0) {
            // 存在子路由，讲子路由添加到响应的父路由中
            children = getChildRouter(children, name);
        }

        //设置路由
        const targetRouter = {
            name: name,
            path: `/${name}`,
            component: fatherRouter[item],
            children,
        };
        // 添加至路由表
        routes.push(targetRouter);
    });

    return routes;
}

// 子路由必须与父路由同名
function getChildRouter(child, fatherName) {
    const children = [];
    // 遍历子路由
    child.forEach((key) => {
        // 获取子路由名称
        const childName = key.match(childReg)[0].toLowerCase();
        // 设置子路由
        const targetChildRouter = {
            name: `${fatherName}${childName}`,
            path: `${childName}`,
            component: childRouter[key],
        };
        // 添加值子路由表
        children.push(targetChildRouter);
    });
    return children;
}

// 判断是否存在子路由
function hasChildRouter(name) {
    const child = Object.keys(childRouter).filter((item) => {
        const childName = item.match(folderReg)[0].toLowerCase();
        return childName === name;
    });
    return child;
}

export default getRouter();
