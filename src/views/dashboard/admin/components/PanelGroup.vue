<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="40" :sm="52" :lg="100" class="card-panel-col">
      <!--   <div class="card-panel" @click="handleSetLineChartData('newVisitis')"> -->

      <div class="card-panel">
        <!--   <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div> -->
        <div class="card-panel-description">
          <div class="card-panel-text">
            公告板:

            <!--   <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" /> -->

            <h1>开发团队介绍：</h1>
            <p>核心：后端主程兼架构师kiro涛，后台管理kiro涛，JAVA后端主程Evan双文，后端大宗师，后端jack谢，前端技术总负责W银满，大数据算法QH，安卓原生three，IOS开发麻子，原生sdk插件开发thr,flutter插件开发天辉，音视频处理flysd。

              <br>

              辅助成员：风铃儿，yungui,浮生若水,奉贤,akin,nermay。

              <br>
              合作伙伴：知道创宇 腾讯云 景安 涂图 美狐 七牛云 阿里云 </br>
              极光 百度AI智能云  字节跳动·火山引擎 声网 个推
            </p>
            <h1>其他相关介绍：</h1>
            <p>
              蜻蜓系列系统介绍：
              <a href="https://songshu.youyacao.com/qingting.html" target="_blank">https://songshu.youyacao.com/qingting.html</a>

              <br>
              蜻蜓安装教程介绍：
              <a href="https://doc.youyacao.com/web/#/8?page_id=51" target="_blank">https://doc.youyacao.com/web/#/8?page_id=51</a>

              <br>
              蜻蜓API文档介绍：
              <a href="https://doc.youyacao.com/web/#/16?page_id=93" target="_blank">https://doc.youyacao.com/web/#/16?page_id=93</a>

              <br>

              蜻蜓系统demo演示大全：


              <a href="https://doc.youyacao.com/web/#/22?page_id=457" target="_blank">https://doc.youyacao.com/web/#/22?page_id=457</a>

              <br>
              YYC松鼠短视频系统：
              <a href="https://songshu.youyacao.com/video.html" target="_blank">https://songshu.youyacao.com/video.html</a>

              <br>
              涂图原生SDK美颜插件：<a href="https://ext.dcloud.net.cn/plugin?id=3694" target="_blank">https://ext.dcloud.net.cn/plugin?id=3694</a>
              <br>

			  <br>
			  字节原生SDK美颜插件：<a href="https://ext.dcloud.net.cn/plugin?id=5008" target="_blank">https://ext.dcloud.net.cn/plugin?id=5008</a>
			  <br>

			  <br>
			  美狐原生SDK美颜插件：<a href="https://ext.dcloud.net.cn/plugin?id=3800" target="_blank">https://ext.dcloud.net.cn/plugin?id=3800</a>
			  <br>


            </p>
            <br>

            <h1>联系我们（微信扫码直接联系）-关注我们（公众号）：</h1>
            <p>

              <img
                src="https://www.youyacao.com/images/gfwx.png"
                style="
                  width: 100px;
                  height: 100px;
              "
                alt="微信扫码直接联系"
              >

              <img
                src="https://www.youyacao.com/images/gzh.jpg"
                style="
                  width: 100px;
                  height: 100px;
              "
                alt="微信扫码直接联系"
              >

              <br>

              紧急联系QQ：央千澈 422108995 QQ 优雅草腾讯云负责 2362059584 电话13708021643 19980731625 座机电话：028-61777191
              <br>
              www.youyacao.com
              <br>
              Copyright ©一颗优雅草科技 2015-2021 All rights reserved
            </p>

          </div>
        </div>

      </div>
    </el-col>
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            接口介绍
          </div>

          <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
 -->
    <!--    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            最新发布
          </div>
          <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="shopping" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            相关衍生产品
          </div>
          <count-to :start-val="0" :end-val="13600" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col> -->

  </el-row>

<!--  <el-row :gutter="40" class="panel-group">

  </el-row> -->

</template>

<script>

export default {
  components: {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 810px;
    // cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: left;
      font-weight: bold;
      margin: 26px;
      margin-left: 20px;

      .card-panel-text {
     line-height: 30px;
         color: rgb(255, 177, 0);
         font-size: 30px;
         margin-bottom: 12px;

      }

.card-panel-text h1{
       line-height: 28px;
           color: rgba(255, 0, 0, 0.45);
           font-size: 14px;
           font-weight: bold;
           margin-bottom: 12px;
      }
.card-panel-text p{
       line-height: 16px;
           color: rgb(86, 187, 131);
           font-size: 12px;
           margin-bottom: 12px;

      }
.card-panel-text img{
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

.card-panel-text a {
        line-height: 18px;
        color:rgba(0, 149, 255, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

.card-panel-text a:hover {
        line-height: 18px;
        color:rgba(255, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
