import { isEqual } from 'date-fns';
import Appointment from '../entities/Appointment';
import { EntityRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> implements IAppointmentsRepository {
    public async findByDate(date: Date): Promise<Appointment | undefined> {

        const findAppointment = await this.findOne({
            where: { date },
        })

        return findAppointment;
    }
}

export default AppointmentRepository;
