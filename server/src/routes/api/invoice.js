const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { createReport } = require('docx-templates')

const lodash = require('lodash')
const {ObjectId} = require('mongodb')
const {mongoose} = require('../../db/mongoose.js')
const {Invoice} = require('../../models/invoice')

// Функция для подготовки данных из инвойса и клиента
function prepareTemplateData(invoice, customer) {
  // Получаем даты для плейсхолдеров
  const invoiceDate = new Date(invoice.invoice_date)
  const startDate = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth(), 1)
  const endDate = new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 0)
  
  return {
    // Данные счета
    invoiceNumber: invoice.number,
    invoice_date: invoiceDate.toLocaleDateString('ru-RU'),
        startDate: startDate.toLocaleDateString('ru-RU'),
    endDate: endDate.toLocaleDateString('ru-RU'),  

    // Общая сумма
    total_amount: invoice.services.reduce((sum, service) => sum + (service.price * service.quantity), 0),
    total_amount_text: invoice.getTotalString ? invoice.getTotalString() : 'Сумма не рассчитана',
    
    // Плейсхолдеры для каждой услуги
    requestNumber: invoice.services[0]?.requestNumber || '',
    requestDescription: invoice.services[0]?.description || '',
    hour: invoice.services[0]?.quantity || 0,
    price: invoice.services[0]?.price || 0,
    sumPrice: (invoice.services[0]?.price || 0) * (invoice.services[0]?.quantity || 0),
    totalPrice: invoice.services.reduce((sum, service) => sum + (service.price * service.quantity), 0),
    stringPrice: invoice.getTotalString ? invoice.getTotalString() : 'Сумма не рассчитана',
    projectName: invoice.services[0]?.projectName || '',
    projectJiraLink: invoice.services[0]?.projectJiraLink || '',
    projectGitLink: invoice.services[0]?.projectGitLink || ''
  }
}



router.get('/', async function (req, res, next) {
  try {
    const invoices = await Invoice.find({})
    res.send({data: invoices})
  } catch (err) {
    res.status(500).send({error: err.message})
  }
})

router.post('/add', (req, res) => {
  let invoice = new Invoice(req.body)
  let error = invoice.validateSync()
  invoice.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.render('invoice/add', {action: '/invoice/add', create: true, invoice: req.body, errors: e})
  })
})

router.get('/:id', async function (req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id': new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }
    return res.send(invoice)
  } catch (err) {
    return res.status(500).send({error: err.message})
  }
})

router.post('/:id', async function (req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id': new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }

    invoice.set(req.body)

    const doc = await invoice.save()
    return res.send(doc)
  } catch (e) {
    return res.status(422).send({error: e.message || e.toString()})
  }
})

router.delete('/:id', async function (req, res, next) {
  try {
    const invoice = await Invoice.findByIdAndDelete(new ObjectId(req.params.id))
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }
    return res.send(invoice)
  } catch (err) {
    return res.status(500).send({error: err.message})
  }
});

router.get('/:id/act-file', async function (req, res, next) {
  try {
    const invoice = await Invoice.findOne({'_id': new ObjectId(req.params.id)})
    if (!invoice) {
      return res.status(404).send({error: 'Invoice not found'})
    }

    // Получаем актуальные данные клиента отдельно из базы данных
    const Customer = require('../../models/customer').Customer
    const customer = await Customer.findById(invoice.customer._id || invoice.customer)
    if (!customer) {
      return res.status(404).send({error: 'Customer not found'})
    }

    // Путь к шаблону
    const templatePath = path.join(__dirname, '../../docx/awg_template.docx')
    console.log('Путь к шаблону:', templatePath)
    
    // Проверяем существование файла шаблона
    if (!fs.existsSync(templatePath)) {
      return res.status(404).send({error: 'Template file not found'})
    }

    // Читаем шаблон
    const templateBuffer = fs.readFileSync(templatePath)
    
    // Подготавливаем данные для шаблона с актуальным клиентом
    const templateData = prepareTemplateData(invoice, customer)
    console.log('Данные для шаблона (ключи):', Object.keys(templateData))
    console.log('Размер шаблона:', templateBuffer.length, 'байт')
    
    try {
      // Генерируем документ из шаблона
      const report = await createReport({
        template: templateBuffer,
        data: templateData,
        cmdDelimiter: ['{', '}'],
        processLineBreaks: true,
        noSandbox: false,
        additionalJsContext: {
          // Дополнительные функции для обработки данных
          formatText: (text) => {
            if (!text) return ''
            return String(text).replace(/\n/g, '\n').trim()
          },
          formatDate: (date) => {
            if (!date) return ''
            return new Date(date).toLocaleDateString('ru-RU')
          },
          formatPrice: (price) => {
            if (!price) return '0'
            return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
          }
        }
      })
      
      console.log('Документ сгенерирован, размер:', report.length, 'байт')
      
      // Проверяем, что документ сгенерирован корректно
      if (!report || report.length === 0) {
        throw new Error('Документ не был сгенерирован или пуст')
      }
        
        // Создаем папку для логов, если её нет
        const logDir = path.join(__dirname, '../../docx/log')
        if (!fs.existsSync(logDir)) {
          fs.mkdirSync(logDir, { recursive: true })
        }
      
      // Сохраняем файл в папку логов
      const logFileName = `act-${invoice.number}-${Date.now()}.docx`
      const logFilePath = path.join(logDir, logFileName)
      fs.writeFileSync(logFilePath, report)
      console.log('Файл сохранен в логах:', logFilePath)
      console.log('Отправляем файл клиенту, размер:', report.length, 'байт')
      
      // Отправляем файл клиенту
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', `attachment; filename="act-${invoice.number}.docx"`)
      res.setHeader('Content-Length', report.length)
      res.setHeader('Cache-Control', 'no-cache')
      res.end(report)
      
    } catch (error) {
      console.error('Ошибка при генерации документа:', error)
      return res.status(500).send({error: 'Ошибка при генерации документа: ' + error.message})
    }
    
  } catch (err) {
    console.error('Ошибка при создании акт-файла:', err)
    return res.status(500).send({error: err.message})
  }
});

module.exports = router