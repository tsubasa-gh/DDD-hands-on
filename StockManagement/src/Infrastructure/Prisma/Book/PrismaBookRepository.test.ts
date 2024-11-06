import { PrismaClient } from "@prisma/client";
import { Book } from "Domain/models/Book/Book";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { Price } from "Domain/models/Book/Price/Price";
import { QuantityAvailable } from "Domain/models/Book/Stock/QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "Domain/models/Book/Stock/Status/Status";
import { Stock } from "Domain/models/Book/Stock/Stock";
import { Title } from "Domain/models/Book/Title/Title";
import { bookTestDataCreator } from "Infrastructure/shared/Book/bookTestDataCreator";
import { PrismaBookRepository } from "./PrismaBookRepository";

const prisma = new PrismaClient();

describe('PrismaBookRepository', () => {
    beforeEach(async () => {
        await prisma.$transaction([prisma.book.deleteMany()]);
        await prisma.$disconnect();
    });

    const repository = new PrismaBookRepository();

    test('saveした集約がfindで取得できる', async () => {
        const bookId = new BookId('9784167158057');
        const title = new Title('吾輩は猫である');
        const price = new Price({
            amount: 770,
            currency: 'JPY',
        });
        const book = Book.create(bookId, title, price);
        await repository.save(book);

        const createEntity = await repository.find(bookId);
        expect(createEntity?.bookId.equals(bookId)).toBeTruthy();
        expect(createEntity?.title.equals(title)).toBeTruthy();
        expect(createEntity?.price.equals(price)).toBeTruthy();
        expect(createEntity?.stockId.equals(book.stockId)).toBeTruthy();
        expect(createEntity?.quantityAvailable.equals(book.quantityAvailable)).toBeTruthy();
        expect(createEntity?.status.equals(book.status)).toBeTruthy();
    });

    test('updateできる', async () => {
        const createdEntity = await bookTestDataCreator(repository)({});

        const stock = Stock.reconstruct(
            createdEntity.stockId,
            new QuantityAvailable(100),
            new Status(StatusEnum.InStock),
        );

        const book = Book.reconstruct(
            createdEntity.bookId,
            new Title('吾輩は猫である(改訂版))'),
            new Price({
                amount: 800,
                currency: 'JPY',
            }),
            stock
        );

        await repository.update(book);
        const updatedEntity = await repository.find(createdEntity.bookId);
        expect(updatedEntity?.bookId.equals(book.bookId)).toBeTruthy();
        expect(updatedEntity?.title.equals(book.title)).toBeTruthy();
        expect(updatedEntity?.price.equals(book.price)).toBeTruthy();
        expect(updatedEntity?.stockId.equals(book.stockId)).toBeTruthy();
        expect(
            updatedEntity?.quantityAvailable.equals(book.quantityAvailable)
        ).toBeTruthy();
        expect(updatedEntity?.status.equals(book.status)).toBeTruthy();
    })

    it('deleteできる', async () => {
        const createdEntity = await bookTestDataCreator(repository)({});

        const readyEntity = await repository.find(createdEntity.bookId);
        expect(readyEntity).not.toBeNull();

        await repository.delete(createdEntity);
        const deletedEntity = await repository.find(createdEntity.bookId);
        expect(deletedEntity).toBeNull
    });
});
