/*
 * @Author: wenlin
 * @Date: 2020-07-29 16:14:09
 * @LastEditors: wenlin
 * @LastEditTime: 2020-08-03 09:32:01
 * @Description:
 */

export class Storage {
  private privatePreKey: string;
  // 所有均添加上项目私有前缀
  public constructor(name = process.env.VUE_APP_NAME || "") {
    this.privatePreKey = name ? name + "_" : "";
  }
  public get<T = string>(key: string): T | null {
    if (!key) return null;
    let value = window.localStorage.getItem(this.privatePreKey + key);
    try {
      value = JSON.parse(value);
      return value as any;
    } catch (e) {
      return value as any;
    }
  }

  public set(key: string, value: any) {
    if (!key) return;
    let value_ = value;
    if (Object.prototype.toString.call(value_) === "[object Object]") {
      value_ = JSON.stringify(value_);
    }
    window.localStorage.setItem(this.privatePreKey + key, value_);
  }

  public remove(key: string) {
    if (!key) return;
    window.localStorage.removeItem(this.privatePreKey + key);
  }
}

export default new Storage();
