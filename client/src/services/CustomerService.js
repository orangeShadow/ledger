import api from '@/services/api'

export default {
  fetchCustomers () {
    return api().get('api/customer')
  },
  addCustomer (customer) {
    return api().post(`api/customer`, customer)
  },
  fetchCustomer (id) {
    return api().get(`api/customer/${id}`)
  },
  updateCustomer (id, customer) {
    return api().post(`api/customer/${id}`, customer)
  }
}
