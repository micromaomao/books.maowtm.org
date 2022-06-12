import { BookObject } from "../js/book";

export const getBookList = () => ({
  "Haruhi Suzumiya": [
    new BookObject(require("url:../books/img/haruhi-1.png"), 0.5, 1, 1),
    new BookObject(require("url:../books/img/haruhi-2.png"), 0.5, 1, 1),
    new BookObject(require("url:../books/img/haruhi-3.png"), 0.5, 1, 1),
    new BookObject(require("url:../books/img/haruhi-4.png"), 0.5, 1, 1),
    new BookObject(require("url:../books/img/haruhi-5.png"), 0.5, 1, 1),
    new BookObject(require("url:../books/img/haruhi-6.png"), 0.5, 1, 1),
    new BookObject(require("url:../books/img/haruhi-7.png"), 0.5, 1, 1),
  ]
});
