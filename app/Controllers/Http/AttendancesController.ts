import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Attendance from 'App/Models/Attendance'

export default class AttendancesController {
  public async index({}: HttpContextContract) {
    return await Attendance.all()
  }

  public async store({ request }: HttpContextContract) {
    const newSchema = schema.create({
      name: schema.string({ trim: true }),
      nis: schema.string({}, [rules.maxLength(4), rules.minLength(4)]),
      kelas: schema.string({ trim: true }),
    })

    const data = await request.validate({
      schema: newSchema,
      messages: {
        'nis.maxLength': 'NIS cannot be longer than 4 characters',
      },
    })

    const student = await Attendance.create(data) // create and insert to databse
    return student
  }

  public async show({ params }: HttpContextContract) {
    return Attendance.findOrFail(params.id)
  }

  public async update({ params, request }: HttpContextContract) {
    const data = request.body()
    const student = await Attendance.findOrFail(params.id)
    student.name = data.name
    student.nis = data.nis
    student.kelas = data.kelas

    return student.save()
  }

  public async destroy({ params }: HttpContextContract) {
    const student = await Attendance.findOrFail(params.id)
    return student.delete()
  }
}
