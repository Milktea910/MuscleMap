import { Notify } from 'quasar'

export default () => {
  // 設置通知預設配置
  Notify.setDefaults({
    position: 'bottom',
    timeout: 2500,
    textColor: 'white',
    actions: [{ icon: 'close', color: 'white' }],
  })
}
