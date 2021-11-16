import request from '@/utils/request'

export function getData(id) {
  return request({
    url: `shop/vip/${id}`,
    method: 'get'
  })
}

export function getDatas(data) {
  return request({
    url: 'shop/vip',
    method: 'get',
    params: data
  })
}

export function addData(data) {
  return request({
    url: 'shop/vip',
    method: 'post',
    data
  })
}

export function updateData(id, data) {
  return request({
    url: `shop/vip/${id}`,
    method: 'put',
    data
  })
}

export function deleteData(id) {
  return request({
    url: `shop/vip/${id}`,
    method: 'delete'
  })
}

export function batchDisable(data) {
  return request({
    url: `shop/vip/batchDisable`,
    method: 'post',
    data
  })
}
