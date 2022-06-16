import { BookObject } from "../js/book";

export const getBookList = () => ({
  "Haruhi Suzumiya": [
    new BookObject(require("url:../books/img/haruhi-1.png"), 0.5, 1, 1, {
      title: "The Melancholy of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9780316228619/the-melancholy-of-haruhi-suzumiya-light-novel/",
      description: `
        <p><b>Haruhi Suzumiya</b> is a popular light novel and anime series. It invloves aliens, time travelers, and espers!<br>

        <p>In some sense it is a slice-of-life story, but yet still contains a lot of plots and character development.<br>

        <p>My all-time favourite anime.
      `
    }),
    new BookObject(require("url:../books/img/haruhi-2.png"), 0.5, 1, 1, {
      title: "The Sigh of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975322847/the-sigh-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the second book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
    new BookObject(require("url:../books/img/haruhi-3.png"), 0.5, 1, 1, {
      title: "The Boredom of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975322854/the-boredom-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the third book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
    new BookObject(require("url:../books/img/haruhi-4.png"), 0.5, 1, 1, {
      title: "The Disappearance of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975322861/the-disappearance-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 4th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!

        <p>The movie with the same name is a very well-received animation work.
      `
    }),
    new BookObject(require("url:../books/img/haruhi-5.png"), 0.5, 1, 1, {
      title: "The Rampage of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975322878/the-rampage-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 5th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
    new BookObject(require("url:../books/img/haruhi-6.png"), 0.5, 1, 1, {
      title: "The Wavering of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975322885/the-wavering-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 6th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
    new BookObject(require("url:../books/img/haruhi-7.png"), 0.5, 1, 1, {
      title: "The Intrigues of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975324179/the-intrigues-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 7th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
  ],
  "2": [
    new BookObject(require("url:../books/img/rust-for-rustaceans.png"), 0.5, 17/14, 23/21, {
      title: "Rust for Rustaceans",
      author: "Jon Gjengset",
      url: "https://nostarch.com/rust-rustaceans",
      description: `
        <p><i><b>Rust for Rustaceans</b> &mdash; Idiomatic Programming for Experienced Developers</i> is a great book on
        intermediate-to-advanced Rust topics. It is written by Jon Gjengset, who has a YouTube channel and does a lot of
        Rust-coding streams, touching various advanced topics like lock-free programming.
      `
    }),
    new BookObject(require("url:../books/img/shortesthistoryeurope.png"), 0.4, 1, 1, {
      title: "The Shortest History of Europe",
      author: "John Hirst",
      url: "https://www.goodreads.com/book/show/6934913-the-shortest-history-of-europe",
      description: `
        <p>This is a light read on certain aspects of European history from the Roman Empire era to
        pre-modern times, covering topics like forms of government, language, religion, argiculture, etc.
      `
    }),
  ]
});
