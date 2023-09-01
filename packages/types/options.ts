export interface InitOptions {
  /**
   * 错误监控的服务器地址
   */
  apiAddress?: string
  /**
   * 为true时，整个sdk将禁用
   */
  disabled?: boolean
  /**
   * 每个项目有一个唯一key，给监控的dsn用的
   */
  projectName?: string
}