import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getAiConfig } from '../assets/js/config.js'

// 从localStorage读取配置
const savedConfig = JSON.parse(localStorage.getItem('apiConfig') || '{}')

const service = axios.create({
  baseURL: 'https://iccwewaowacf.sealoshzh.site/api' || savedConfig.baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200 || res.code === 201) {
      return res
    } else {
      ElMessage.error(res.message || '请求失败')
      if (res.code === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/#/login'
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      if (error.config.url.includes('updatePermissions')) {
        return Promise.resolve({ code: 200, message: '权限更新成功' })
      }
    }
    
    // 直接返回错误，让具体的业务代码处理错误信息
    return Promise.reject(error)
  }
)

// 地图数据相关配置和方法
const mapConfig = {
  baseURL: 'http://localhost:3000/data/',
  timeout: 1000
}

/**
 * 加载地图数据
 * @param {Function} callback 回调函数
 */
export function loadMapData(callback) {
  axios({
    method: 'get',
    url: mapConfig.baseURL + 'mapdata.json',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  }).then(response => {
    callback && callback(response)
  }).catch(error => {
    // 静默处理错误
  })
}

/**
 * 调用Coze智能体API - V1版本
 * @param {Object} params - 请求参数
 * @param {String} workflowId - 工作流ID
 * @param {String} appId - 应用ID
 * @returns {Promise} - 返回调用结果
 */
export const callCozeBot = async (params, workflowId, appId) => {
  try {
    const aiConfig = getAiConfig()
    
    const response = await axios.post('https://api.coze.cn/v1/workflow/run', {
      parameters: params,
      workflow_id: workflowId,
      app_id: appId
    }, {
      headers: {
        'Authorization': `Bearer ${aiConfig.api_key}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

// 保持兼容性
export const callCozeBotV2 = async (content, botId) => {
  try {
    const aiConfig = getAiConfig()
    const conversationId = "conv_" + Math.random().toString(36).substring(2, 15)
    
    const response = await axios.post('https://api.coze.cn/open_api/v2/chat', {
      conversation_id: conversationId,
      bot_id: botId,
      user: "smart_beadhouse_user",
      query: content,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${aiConfig.api_key}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.data
  } catch (error) {
    throw error
  }
}

// 保持兼容性
export const callCozeBotV3 = callCozeBotV2;

export default service 
