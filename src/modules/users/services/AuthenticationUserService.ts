import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';
import User from "../infra/typeorm/entities/User";
import IUsersRepository from '../repositories/IUsersRepository';
import { injectable, inject } from 'tsyringe';
import authConfig from '../../../config/auth';

import AppError from '../../../shared/errors/AppError';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}
@injectable()
class AuthenticateUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({email, password}: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email);

        if(!user) {
            throw new AppError('Email/senha erradas', 401);
        }

        const passwordMatched = await compare(password, String(user.password));
        if(!passwordMatched) {
            throw new AppError('Email/senha erradas', 401);
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        })

        return {
            user,
            token
        }
    }
}

export default AuthenticateUserService
