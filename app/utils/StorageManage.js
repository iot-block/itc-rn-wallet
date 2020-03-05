import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

const defaultExpires = null;
const size = 1000;
const storage = new Storage({
  size, // 数据上限
  storageBackend: AsyncStorage,
  defaultExpires, // 过期时间
  enableCache: true, // 是否缓存
  sync: null, // 同步方法
});

global.storage = storage;

export default class StorageManage {
  /**
   * 存储
   *
   * @param  key 读取key值对应的数据 必传 唯一标识
   * @param  data 存储的数据 type: string || object
   * @param  id   非必传 标识
   */
  static save(key, data, id) {
    // let value = JSON.stringify(data)
    if (id) {
      storage.save({
        key,
        id,
        data,
        expires: defaultExpires,
      });
    } else {
      storage.save({
        key,
        data,
        expires: defaultExpires,
      });
    }
  }

  /**
   * 根据key或者key-id得到存储的数据
   *
   * @param key 必传
   * @param id  可不传
   */
  static async load(key, id) {
    storage.sync = null;
    let ret;
    if (id) {
      try {
        ret = await storage.load({
          key,
          id,
          autoSync: false,
          syncInBackground: false,
        });
      } catch (err) {
        console.log(err.message);
        ret = null;
      }
    } else {
      try {
        // JSON.parse(ret)
        ret = await storage.load({
          key,
          autoSync: false,
          syncInBackground: false,
        });
      } catch (err) {
        // console.log(err);
        ret = null;
      }
    }
    return ret;
  }

  // 获取key下的所有数据(仅key-id数据)
  static async loadAllDataForKey(key) {
    storage.sync = null;
    let ret;
    try {
      ret = await storage.getAllDataForKey(key);
    } catch (err) {
      console.log(err.message);
      ret = null;
    }
    return ret;
  }

  // 获取key下的所有id(仅key-id数据)
  static async loadIdsForKey(key) {
    storage.sync = null;
    let ids;
    try {
      ids = await storage.getIdsForKey(key);
    } catch (err) {
      console.log(err.message);
      ids = null;
    }
    return ids;
  }

  /**
   * 删除单个数据
   * @param key 删除key所对应的数据,必传
   * @param id  删除id对应的数据，若删除的数据中有id,则必传
   */
  static remove(key, id) {
    if (id) {
      return storage.remove({
        key,
        id,
      });
    }
    return storage.remove({
      key,
    });
  }

  // 清空某个key下的所有数据(仅key-id数据)
  static clearMapForkey(key) {
    storage.clearMapForKey(key);
  }

  // 清空所有map,移除所有key-id数据（但会保留只有key的数据）
  static clearMaps() {
    storage.clearMap();
  }

  /**
   * 同步远程数据
   *
   * @param key 必传
   * @param syncsFun 请求
   * @param id  可不传
   */
  static async syncLoad(key, syncFun, keyId) {
    storage.sync = syncFun;

    let result;
    if (keyId) {
      result = await storage
        .load({
          key,
          id: keyId,
          // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
          autoSync: true,
          // syncInBackground(默认为true)意味着如果数据过期，在调用sync方法的时同时先返回已经过期的数据
          // 设置为false，则始终强制返回sync方法提供的最新数据（则需要更多等待时间）
          syncInBackground: true,
          // 给sync方法传递额外的参数
          syncParams: {
            extraFetchOptions: {
              // 各种参数
            },
            someFlag: true,
          },
        })
        .then(
          ret =>
            // 如果找到数据，则在then方法返回
            ret
        )
        .catch(err => {
          // 如果没有找到数据且没有sync方法，或者有其他异常，则在catch中返回
          console.log('syncLoad_err', err.message);
          switch (err.name) {
            case 'NotFoundError':
              break;
            case 'ExpiredError':
              break;
            default:
              return null;
          }
          return null;
        });
    } else {
      result = await storage
        .load({
          key,
          autoSync: true,
          syncInBackground: true,
          syncParams: {
            extraFetchOptions: {},
            someFlag: true,
          },
        })
        .then(ret => ret)
        .catch(err => {
          console.log('syncLoad_err', err.message);
          switch (err.name) {
            case 'NotFoundError':
              break;
            case 'ExpiredError':
              break;
            default:
              return null;
          }
          return null;
        });
    }

    return result;
  }

  // https://blog.csdn.net/sinat_17775997/article/details/71308394
  // https://blog.csdn.net/qq_23414675/article/details/82470243
  /*
    static syncLoadLoad(){
        storage.sync = {
            //sync方法的名字必须和所存数据的key完全相同
            //方法接受的参数为一整个object，所有参数从object中解构取出
            //这里可以使用promise。或是使用普通回调函数，但需要调用resolve或reject。
            user(params){
                let {id,resolve,reject,syncParams:{extraFetchOptions,someFlag}} = params;
                fetch('user/',{
                    method:'GET',
                    body:'id=' + id,
                    ...extraFetchOptions,
                }).then(response => {
                    return response.json()
                }).then(json => {
                    if(json && json.user){
                        storage.save({
                            key: 'user',
                            id,
                            data: json.user
                        })
                        if(someFlag){
                            //根据syncParams中的额外参数做对应处理
                        }
                        //成功则调用resolve
                        resolve && resolve(json.user)
                    }else{
                        //失败则调用reject
                        reject && reject(new Error('data parse error'))
                    }
                }).catch(err => {
                    console.log(err)
                    reject && reject(err)
                })
            }
        }
    } */
}
