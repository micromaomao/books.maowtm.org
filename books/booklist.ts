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
    new BookObject(require("url:../books/img/haruhi-7.png"), 0.7, 1, 1, {
      title: "The Intrigues of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975324179/the-intrigues-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 7th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
    new BookObject(require("url:../books/img/haruhi-8.png"), 0.5, 1, 1, {
      title: "The Indignation of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9780316038997/the-indignation-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 8th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
    new BookObject(require("url:../books/img/haruhi-9.png"), 0.4, 1, 1, {
      title: "The Dissociation of Haruhi Suzumiya",
      author: "Nagaru Tanigawa",
      series: "Haruhi Suzumiya Series",
      url: "https://yenpress.com/9781975324193/the-dissociation-of-haruhi-suzumiya-light-novel/",
      description: `
        <p>This is the 9th book in the Haruhi Suzumiya series. Please check out the first one if you don't know what this is!
      `
    }),
  ],
  "Non-fiction": [
    new BookObject(require("url:../books/img/NoPlaceToHide.png"), 0.5, 1.05, 1.075, {
      title: "No Place to Hide",
      author: "Glenn Greenwald",
      url: "https://www.goodreads.com/book/show/18213403-no-place-to-hide",
      description: `
        <p><b>No Place to Hide</b>: Edward Snowden, the NSA, and the U.S. Surveillance State

        <p>A book about the surveillance program of USA and its partners. Also includes a discussion of press freedom in the US.
      `
    }),
    new BookObject(require("url:../books/img/SurelyYoureJoking.png"), 0.7, 1.05, 1.05, {
      title: "Surely You're Joking, Mr. Feynman!",
      author: "Richard P. Feynman",
      url: "https://wwnorton.com/books/Surely-Youre-Joking-Mr-Feynman/",
      description: `
        <p><b>Richard P. Feynman</b> is an inspiring physicist and Nobel Prize winner. In this book, he described his
        philosophy around scientific communication in a series of light-hearted stories, and is quite fun to read.
      `
    }),
    new BookObject(require("url:../books/img/TheDisappearingSpoon.png"), 0.9, 1, 1, {
      title: "The Disappearing Spoon",
      author: "Sam Kean",
      url: "https://www.goodreads.com/book/show/9800230-the-disappearing-spoon",
      description: `
        <p><b>The Disappearing Spoon</b>: And Other True Tales of Madness, Love, and the History of the World from the Periodic Table of the Elements

        <p>This is a book about some interesting history of chemistry and science in general. A bit long for my taste but still enjoyable.
      `
    }),
    new BookObject(require("url:../books/img/shortesthistoryeurope.png"), 0.4, 0.95, 0.95, {
      title: "The Shortest History of Europe",
      author: "John Hirst",
      url: "https://www.goodreads.com/book/show/6934913-the-shortest-history-of-europe",
      description: `
        <p>This is a light read on certain aspects of European history from the Roman Empire era to
        pre-modern times, covering topics like forms of government, language, religion, argiculture, etc.
      `
    }),
    new BookObject(require("url:../books/img/IntoThinAir.png"), 0.7, 0.9, 0.95, {
      title: "Into Thin Air",
      author: "Jon Krakauer",
      url: "https://www.goodreads.com/book/show/1898.Into_Thin_Air",
      description: `
        <p><b>Into Thin Air</b>: A Personal Account of the Mount Everest Disaster

        <p>This was also one of the book
        <a target="_blank" href="https://www.youtube.com/watch?v=NafbGOQBlQs">recommended by MinutePhysics</a>.
        It is a first-person account of the author's 1996 trip to climb the Mount Everest, during which a number of
        team members died in a storm and the author himself was nearly unable to make his return. It contains a lot
        of vivid details about the whole trip which makes it really engaging to read.
      `
    }),
    new BookObject(require("url:../books/img/TrueNorth.png"), 0.7, 0.9, 0.9, {
      title: "True North",
      author: "Bruce Henderson",
      url: "https://www.goodreads.com/book/show/107425.True_North",
      description: `
        <p><b>True North</b>: Peary, Cook, and the Race to the Pole

        <p>This was one of the book
        <a target="_blank" href="https://www.youtube.com/watch?v=Roq20IV4yP0">recommended by MinutePhysics</a>!
        It lays out the story of the arctic exploration done by Frederick Cook, as well as discussing some of the controversies
        regarding who actually reached the North Pole first. However I find that the author perhaps sided a bit too closely with Cook
        in this matter.
      `
    }),
    new BookObject(require("url:../books/img/ThinkingFastAndSlow.png"), 0.8, 0.85, 0.9, {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      url: "https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow",
      description: `
        <p>A good book on some interesting psychology topics that may help your day-to-day decision-making.
      `
    }),
  ],
  "CS": [
    new BookObject(require("url:../books/img/rust-for-rustaceans.png"), 0.5, 17/14, 23/21, {
      title: "Rust for Rustaceans",
      author: "Jon Gjengset",
      url: "https://nostarch.com/rust-rustaceans",
      description: `
        <p><i><b>Rust for Rustaceans</b> &mdash; Idiomatic Programming for Experienced Developers</i> is a great book on
        intermediate-to-advanced Rust topics. It is written by Jon Gjengset, who has a
        <a target="_blank" href="https://www.youtube.com/c/JonGjengset">YouTube channel</a> and does a lot of
        Rust-coding streams, touching various advanced topics like lock-free programming.
      `
    }),
    new BookObject(require("url:../books/img/CrackingCodingInterview.png"), 1, 1, 1.05, {
      title: "Cracking the Coding Interview",
      author: "Gayle Laakmann McDowell",
      url: "https://www.crackingthecodinginterview.com/",
      description: `
        <p>Pretty useful. For me I mostly read the behavioural part because that is my weakness.
      `
    }),
  ],
  "whatif":
    new BookObject(require("url:../books/img/WhatIf.png"), 0.7, 1.3, 1.1, {
      title: "What If?",
      author: "Randall Munroe",
      url: "https://what-if.xkcd.com/",
      description: `
        <p><b>What If?</b> Serious Scientific Answers to Absurd Hypothetical Questions</p>

        <img src="${require("url:../books/img/xkcd.jpg")}" alt="Avatar of Randall Munroe - the stick figure"
              style="width: 100%; max-width: 200px; margin: 10px auto; display: block;">

        <p>Just click the link above and read a couple of chapters :)
      `
    })
});
