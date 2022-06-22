const registerRouter = require('./backend/router')


module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // 编译阶段全局引入变量和 mixin(这样可以在任何地方直接用，而不需要手动导入才能用)
        additionalData: `
          @import "@/assets/scss/variable.scss";
          @import "@/assets/scss/mixin.scss";
        `
      }
    }
  },

  devServer: {
    /*
      在服务内部的所有其他中间件之前， 提供执行自定义中间件的功能。 这可以用来配置自定义处理程序 --- webpack4
      webpack5已经弃用，名字改成 setupMiddlewares
    */
    before(app) {
      registerRouter(app)
    }
  }
}




// vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。
// vue脚手架对webpack做过封装，它内部由一个webpack.config.js。不过vue也提供一个机会让我们可以修改这个config，所以可以在这里进行修改

/*
sass文件在整个编译过程中是会通过sass-loader进行编译，所以在这里additionalData配置一下全局引入sass文件
https://webpack.docschina.org/loaders/sass-loader/
*/
