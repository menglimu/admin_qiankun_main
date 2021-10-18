/* eslint-disable @typescript-eslint/member-ordering */
/**
 * @Author: wenlin
 * @Date: 2020-11-17 10:59:00
 * @Description: 字典
 */

import Vue from "vue";
import { getDictByType, getDeptTree } from "@/api/modules/public";
const refreshTmp = 1000 * 60 * 60 * 2; // 部门树两小时更新一次
let countTmp = null;
import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "../root";
// TODO: jest test
interface DictState {
  [key: string]: {
    loadPromise: Promise<any>;
    loading: boolean;
    value: any;
  };
}
@Module({ dynamic: true, store, name: "dict" })
class Dict extends VuexModule {
  private dicts: DictState = {};

  @Mutation
  public setDict({ name, value }) {
    if (!name) return;
    Vue.set(this.dicts, name, { loading: false, loadPromise: null, value });
  }

  @Mutation
  private isLoading({ name, loading, loadPromise }: { name: string; loading: boolean; loadPromise?: Promise<any> }) {
    if (this.dicts[name]) {
      this.dicts[name].loading = loading;
    } else {
      Vue.set(this.dicts, name, { loading, loadPromise, value: null });
    }
  }

  /**
   * 加载字典，已有的字典不会重新加载，当refresh为true时强制加载
   * @param name 字典名
   * @param refresh 是否强制刷新
   * @returns Promise
   */
  @Action
  public async getDict({ name, refresh }: { name: string; refresh?: boolean }) {
    // 正在请求的字典返回请求promise
    if (this.dicts[name]?.loading) return this.dicts[name]?.loadPromise;
    // 字典存在，并且不是强制刷新的时候，返回当前字典
    if (this.dicts[name] && !refresh) {
      return Promise.resolve(this.dicts[name].value);
    }
    const loadPromise = getDictByType(name)
      .then(data => {
        const value = data.map(item => {
          if (item.codeFieldType === "number" && !isNaN(item.code)) {
            item.code = Number(item.code);
          }
          item.label = item.codeName;
          item.value = item.code;
          return item;
        });

        this.setDict({ name, value });
        return value;
      })
      .catch(err => {
        this.isLoading({ name, loading: false });
      });
    this.isLoading({ name, loading: true, loadPromise });
    return loadPromise;
  }

  @Action
  public async getDeptTree(refresh?: boolean) {
    const name = "deptTree";
    // 正在请求的字典返回请求promise
    if (this.dicts[name]?.loading) return this.dicts[name]?.loadPromise;
    // 字典存在，并且不是强制刷新的时候，返回当前字典
    if (this.dicts[name] && !refresh && countTmp && Date.now() - countTmp < refreshTmp) {
      return Promise.resolve(this.dicts[name].value);
    }
    const loadPromise = getDeptTree()
      .then(data => {
        countTmp = Date.now();
        const value = data;
        this.setDict({ name, value });
        return value;
      })
      .catch(err => {
        this.isLoading({ name, loading: false });
      });
    this.isLoading({ name, loading: true, loadPromise });
    return loadPromise;
  }
}
const StoreDict = getModule(Dict);
export default StoreDict;
