import { Book } from "Domain/models/Book/Book";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { Price } from "Domain/models/Book/Price/Price";
import { Title } from "Domain/models/Book/Title/Title";
import { InMemoryBookRepository } from "Infrastructure/InMemory/InMemoryBookRepository";
import { ISBNDuplicationCheckDomainService } from "./ISBNDuplicationCheckDomainService";

describe('ISBNDuplicationCheckDomainService', () => {
    let isbnDuplicationCheckDomainService: ISBNDuplicationCheckDomainService;
    let inMemoryBookRepository: InMemoryBookRepository;

    beforeEach(() => {
        // 各テスト前に実行される初期化処理
        inMemoryBookRepository = new InMemoryBookRepository();
        isbnDuplicationCheckDomainService = new ISBNDuplicationCheckDomainService(inMemoryBookRepository);
    })

    test('重複がない場合、falseを返す', async () => {
        const isbn = new BookId('9784167158057');
        const result = await isbnDuplicationCheckDomainService.execute(isbn);
        expect(result).toBeFalsy();
    })

    test('重複がある場合、trueを返す', async () => {
        const existingIsbn = new BookId('9784167158057');
        const newIsbn = new BookId('9784167158057');
        const title = new Title('テスト書籍');
        const price = new Price({ amount: 500, currency: 'JPY' });
        const book = Book.create(existingIsbn, title, price);

        await inMemoryBookRepository.save(book);

        const result = await isbnDuplicationCheckDomainService.execute(newIsbn

        );
        expect(result).toBeTruthy();
    })

    test('異なるISBNで重複がない場合、falseを返す', async () => {
        const existingIsbn = new BookId('9784167158057');
        const newIsbn = new BookId('9784167158064');
        const title = new Title('テスト書籍');
        const price = new Price({ amount: 500, currency: 'JPY' });
        const book = Book.create(existingIsbn, title, price);

        await inMemoryBookRepository.save(book);

        const result = await isbnDuplicationCheckDomainService.execute(newIsbn);

        expect(result).toBeFalsy();
    })
});