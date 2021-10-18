## admin_qiankun_main

基于 qiankun 微服务的系统的主应用

## 构建步骤

```bash

# 1. 使用VNP连接公司内网环境，连接成功标准 ping 10.12.102.194有响应，如ping不通，请检查账号权限

# 2. 使用cci 私有仓库

npm config set registry http://10.12.102.194:4873

        #推荐使用 nrm 管理 registry

            npm install nrm -g

            nrm add cci http://10.12.102.194:4873

            nrm ls #查看registry列表

            nrm use cci #使用 cci 私有仓库


# 3. 安装依赖
npm install

        #推荐使用 yarn 安装依赖
            #安装 yarn
            npm install yarn -g

            yarn #安装依赖


# 4. 开发模式（两种命令皆可）
npm run dev

# 5. 项目构建
npm run build


# 6. 演示
npm run build



# 7. 代码格式校验
npm run lint

```

## 技术栈

- vue-cli 4.x
- vue 2.x
- vue-router
- vuex
- element-ui
- scss
- axios
- typescript
- qiankun

## 代码结构

```
web_template_qiankun
├─ .env                                       环境变量
├─ .eslintignore                              eslint的忽略
├─ .eslintrc.js                               eslint配置项
├─ .gitignore                                 git的忽略
├─ .prettierrc.js                             prettier的配置项
├─ .stylelintrc.js                            stylelint的配置项
├─ .vscode                                    vscode相关配置，主要是格式化代码相关
├─ ansible                                    脚本
├─ build                                      脚本
├─ package.json                               package.json
├─ public                                     公共资源
├─ README.md
├─ src
│  ├─ api                                     接口相关
│  │  ├─ generate.ts                          通过接口文档自动生成接口的脚本
│  │  ├─ modules                              接口模块
│  │  │  ├─ login.ts                          登录相关接口
│  │  │  └─ public.ts                         公共接口
│  │  └─ request.ts                           统一封装的请求方法。拦截等
│  ├─ App.tsx                                 vue的入口
│  ├─ assets                                  静态资源
│  ├─ casLogin.ts                             登录校验
│  ├─ global.d.ts                             ts的一些全局定义
│  ├─ icons                                   图标相关
│  │  ├─ component                            图标组件
│  │  ├─ index.tsx                            图标组件注册
│  │  └─ svg                                  svg图标存放
│  ├─ initial.ts                              系统校验通过的正式启动入口
│  ├─ layout                                  整体布局相关
│  │  ├─ common.ts                            布局的几个公共方法
│  │  ├─ components
│  │  │  ├─ AppMain.tsx                       子页面的入口
│  │  │  ├─ Breadcrumb                        面包屑
│  │  │  ├─ Collapse                          折叠
│  │  │  ├─ Header.tsx                        头部整合
│  │  │  ├─ Screenfull                        全屏
│  │  │  ├─ Sidebar                           菜单
│  │  │  │  ├─ index.tsx                      左侧菜单
│  │  │  │  └─ TopMenu.tsx                    顶部菜单
│  │  │  └─ TagsView                          可关闭的标签页
│  │  ├─ index.tsx                            layout的入口
│  │  └─ Message                              消息。需跟进业务进行自己的处理
│  ├─ main.ts                                 项目入口
│  ├─ qiankun.ts                              微服务性相关
│  ├─ router                                  路由相关
│  │  ├─ child.ts                             子路由，目前没用
│  │  ├─ index.ts                             路由入口
│  │  ├─ permission.ts                        根据后台的菜单。路由转菜单等权限处理
│  │  └─ static.ts                            静态路由
│  ├─ shims-tsx.d.ts                          全局定义
│  ├─ shims-vue.d.ts                          全局定义
│  ├─ store                                   vuex相关
│  │  ├─ index.ts                             入口
│  │  ├─ modules
│  │  │  ├─ app.ts                            系统的一些配置项。一些功能可在此配置需不需要
│  │  │  ├─ dict.ts                           字典
│  │  │  └─ user.ts                           用户相关
│  │  └─ root.ts                              主store
│  ├─ styles                                  样式
│  │  └─ mixin.scss                           全局的mixin。会自动注入
│  ├─ utils                                   公共的js方法
│  └─ views
│     ├─ base                                 基础页面
│     │  ├─ 401                               初始进入未登录或者失效的页面
│     │  ├─ 404                               404错误页
│     │  ├─ iframe                            嵌入其他系统的iframe组件
│     │  └─ login                             登录
│     └─ home                                 没用的
│        └─ index.tsx
├─ tsconfig.json                              ts相关配置
├─ vue.config.js                              vue cli的相关配置
└─ 项目开发规范说明.docx                      开发说明

```

## 开发规范

- 代码格式规范，使用用项目中所配置的 eslint 进行格式化和规范

- 组件和页面结构遵循从上往下 template，script，style 的结构。为组件根元素设置一个 class 使用 scss 加 scoped,一般所有样式放在根 class 下。一般不使用 id，组件中使用 id，首选随机 id，需要外部使用的尽量外部使用 ref 获取组件。应尽量避免操作 dom

- 组件：组件放入 components 中，必须命名 name，文件名与组件名相同，以 PascalCase(首字母大写)命名，以 index.js 导出组件，组件具体内容放在其下 src 文件夹中，具体文件结构参见 components 中的 Editor 文件。单个页面或模块中的组件，放在其目录下的 components 中

- 页面：页面放在 views 中，根据项目模块进行文件夹划分，一般根据菜单进行目录构建，使用 kebab-case(短横线分割)的命名方式，每个页面中，使用 index.js 导出页面，页面内容放在 src 中进行编辑

- 样式：

  - 全局样式放入 styles 中。
  - 公共的 scss 放入 styles/mixin 中，mixin 已全局注入，无需重复引入
  - 页面内，或组件内修改公共组件样式时，需要带上自定义的类名来增加命名空间。全局所有修改时不用添加，一般不建议全局修改
  - 父组件中修改子组件样式时，使用 `>>>`

- 注释：
  - 除开一些功能明了，过度统一的文件，所有文件头部必须添加注释，vscode 中，可以使用这个插件进行注释 koroFileHeader
  - data 中的变量，注释一般放在其后
  - 方法的注释，需要说明方法用途，入参，出参
  - 在复杂的逻辑、临界、特殊情况的时候，需要添加注释说明
- 命名：使用英文，禁止使用中文以及拼音，js/文件名一般使用 camelCase(驼峰命名),html 使用 kebab-case(短横线分割)
  - 组件：PascalCase(首字母大写)命名方式，导入后，在 template 中使用 kebab-case,自闭合`<is-demo/>`
  - html：标签名使用 kebab-case，class 使用中横线连接
  - js：以一般使用 cameCase 命名变量，函数。
    - boolean 类型变量使用"is"。"has","can","should"同理 例：isXxx
    - 常量使用大写加下横线
    - 事件监听函数使用 onXxxx
    - 作用域不大临时变量可以简写，比如：str，num，bol，obj，fun，arr。
    - 循环变量可以简写，比如：i，j，k 等。
- 使用箭头函数代替 let \_this = this
- console.log(),debugger 调试完成后要删除
- if,else，禁止使用简写，必须跟{}
- 表达式和语句应清晰、简洁，易于阅读和理解，避免使用晦涩难懂的 语句。使用圆括号明确表达式执行优先级

## git commit 规范

- type ⽤于说明 Commit 的类型，包含以下 7 种类型：
  - feat：新功能（feature）
  - fix：修补 bug
  - docs：文档（documentation）
  - style： 格式（不影响代码运行的变动）
  - refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
  - test：增加测试
  - chore：构建过程或辅助工具的变动

eg:

```bash
git commit -m "feat(views/login): 登录页功能及其接口对接"
```

## 开发说明

- 使用本地开发时，使用静态路由的方式如下

  1. env 环境变量中，设置 VUE_APP_CAS="0", VUE_APP_LOCAL_MENU="1"
  2. 在 router 中 static 配置好静态路由

- 在 env 中配置项目名 VUE_APP_NAME 和 项目部署路径 VUE_APP_BASEURL，项目路径一般为/项目名/ ，考虑后期部署的情况不推荐使用 / 路径，在 env 中配置的环境变量，需要三个环境同时配置
- 在使用 localStorage 和 sessionStorage 时，key 名需要在前面加上项目名和下划线，例：command_user
- layout 页面布局请根据项目具体需求进行调整，可参考公司项目中的几种常见布局方式
- 调试接口时，在 vue.config.js 中配置代理，接口前缀路径开发，生产保持一致，上线是，能做到代理的一致性
- 所有接口放在 src/api/modules 下面，进行分模块建文件，统一使用 src/api/request.js 作为基础请求对象，与所需业务不符时，使用 axios 或修改 request.js
- 资源文件统一存放在 src/assets 中，引入的时候，尽量使用~@相对于 src 这种方式，能使用 svg 的资源，尽量使用 svg
- svg 文件放在 src/icons/svg 中，命名使用 camelCase 规则，禁止使用中文名

## 修订记录

| 序号 |  修改时间  | 修改人 | 版本  | 备注 |
| :--: | :--------: | :----: | :---: | :--: |
|  1   | 2020-04-28 |  文林  | 0.1.0 | 初稿 |
