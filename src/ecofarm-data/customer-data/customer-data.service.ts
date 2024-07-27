import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from 'src/auth/enums/roles';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';

@Injectable()
export class CustomerDataService {
    constructor(private prisma: PrismaService) {}

    getAllCustomers() {
        return this.prisma.user.findMany({
            where: {
                role: Role.CUSTOMER,
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                contactInfo: true
            }
        })
    };

    getCustomerById(customerId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: customerId
            },
            select: {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                contactInfo: true
            }
        })
    }

    getCustomerByName(customerName: string) {
        return this.prisma.user.findMany({
            where: {
                firstName: customerName
            },
            select : {
                id: true,
                username: true,
                firstName: true,
                lastName: true,
                role: true,
                contactInfo: true
            }
        })
    };

    async deleteCustomerById(customerId: string): Promise<{message: string}> {
        await this.prisma.user.delete({
            where: {
                id: customerId
            }
        });
        return {message: 'Customer deleted'}
    };

    async createCustomer(firstName: string, lastName: string, contactInfo: string, username: string, password: string) {
        return this.prisma.user.create({
            data: { 
                username: username,
                password: await argon.hash(password),
                firstName: firstName,
                lastName: lastName,
                contactInfo: contactInfo,
                role: 'CUSTOMER'
            },
            select: {
                firstName: true,
                lastName: true,
                contactInfo: true,
                role: true
            }
        });
    }


    async updateCustomerById(customerId: string, firstName?: string, lastName?: string, contactInfo?: string, username?: string, password?: string) {
        const customer = await this.prisma.user.findFirst({
          where: {
            id: customerId,
          },
          select: {
            firstName: true,
            lastName: true,
            contactInfo: true,
            role: true
          }
        });

        if (!customer) throw new NotFoundException('Customer not found');
        const data: any = {};
        if (firstName) data.firstName = firstName;
        if (lastName) data.lastName = lastName;
        if (contactInfo) data.contactInfo = contactInfo;
        if (username) data.username = username;
        if (password) data.password = await argon.hash(password);

        const updatedCustomer = await this.prisma.user.update({
        where: {
            id: customerId,
        },
        select: {
            firstName: true,
            lastName: true,
            contactInfo: true,
            role: true
        },
        data,
        });

        return updatedCustomer;
      }


}