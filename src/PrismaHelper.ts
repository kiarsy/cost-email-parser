import { EventType, getEmail } from "./EventType";
import { PrismaClient } from '@prisma/client';

export class PrismaHelper
{
    prisma = new PrismaClient();

    async handle(event: EventType)
    {
        let user = await this.prisma.userEmails.findFirst({ where: { email: getEmail(event.mail.from) } });
        
        if (!user) {
            console.log("User not found:", getEmail(event.mail.from));
            return;
        }
        
        let account = await this.prisma.account.findFirst({
            where: {
                bank: event.meta.bank,
                account: String(event.meta.accountNumber),
                userId: user.userId!
            }
        });
        
        if (!account) {
            account = await this.prisma.account.create({
                data: {
                    bank: event.meta.bank,
                    account: String(event.meta.accountNumber),
                    userId: user.userId!
                }
            });
        }
        
        try {
            await this.prisma.cost.create({
                data: {
                    credit: event.record.credit,
                    currency: event.record.currency,
                    date: event.record.date,
                    debit: event.record.debit,
                    description: event.record.description,
                    accountId: account.id
                }
            })
        }
        catch (e: any) {
            // console.error(e, 'Error creating character')
        
            // if (e instanceof Prisma.PrismaClientKnownRequestError) {
            //     // P2022: Unique constraint failed
            //     // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
            if (e.code === 'P2002') {
                console.error('The Record already exists', e)
                // throw new RedwoodError('The character already exists')
            }
            // }
        }
        
    }
}
