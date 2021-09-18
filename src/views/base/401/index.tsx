/**
 * @Author: wenlin
 * @Description: 初始化校验未通过时展示的页面
 */
import Vue from "vue";
import img_404 from "@/assets/404_images/404.png";
import img_404_cloud from "@/assets/404_images/404_cloud.png";
import "./index.scss";
import StoreUser from "@/store/modules/user";

export default Vue.extend({
  name: "UnAccess",
  data() {
    return {};
  },
  methods: {
    goLogin() {
      StoreUser.FedLogOut();
    }
  },
  render() {
    return (
      <div class="box-404">
        <div class="wscn-http404">
          <div class="pic-404">
            <img src={img_404} class="pic-404__parent" alt="404" />
            <img src={img_404_cloud} class="pic-404__child left" alt="404" />
            <img src={img_404_cloud} class="pic-404__child mid" alt="404" />
            <img src={img_404_cloud} class="pic-404__child right" alt="404" />
          </div>
          <div class="bullshit">
            <div class="bullshit__oops">OOPS!</div>
            <div class="bullshit__headline"></div>
            <div class="bullshit__info">当前用户未登录或登录已失效，请重新登录</div>
            <span class="bullshit__return-home" onClick={this.goLogin}>
              去登录
            </span>
          </div>
        </div>
      </div>
    );
  }
});
