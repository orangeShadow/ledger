import api from '@/services/api'

export default {
  fetchInvoices () {
    return api().get('api/invoice')
  },
  fetchInvoice (id) {
    return api().get(`api/invoice/${id}`)
  },
  updateInvoice (invoice) {
    return api().post(`api/invoice/${invoice._id}`, invoice)
  },
  fetchInvoicesByCustomer (customerId) {
    return api().get(`api/customer/${customerId}/invoice`)
  },
  addInvoiceByCustomerId (customerId, invoice) {
    return api().post(`api/customer/${customerId}/invoice`, invoice)
  },
  deleteInvoice (invoiceId) {
    return api().delete(`api/invoice/${invoiceId}`)
  }
}
