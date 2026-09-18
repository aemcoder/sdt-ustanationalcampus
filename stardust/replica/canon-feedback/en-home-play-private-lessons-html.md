# Canon feedback — en-home-play-private-lessons-html (program / nc---landing-page-template, 18 pages)

1. `canon.css` rule `.content a{color:var(--color-link);text-decoration:underline}` (specificity 0,1,1) outranks any
   single-class button rule (`.button-core`, 0,1,0): the black pill labels (MEET THE TEAM, BOOK ONLINE, CALL TO BOOK,
   LEARN MORE, EMAIL) rendered blue + underlined in iteration 1 at 1440. Compensated in the page CSS with
   `.content a.button-core{color:#fff;text-decoration:none}`. Since every page of this 18-page family carries
   `.button-core` pills, consider moving the lifted `button-core` spec (usta-proxy.css: 56px pill, 18px/20px Graphik
   Semibold, letter-spacing 1px, padding 14px / 34px right with icon, border 2px transparent, --reverse icon-left,
   icon 20px invert filter, hover opacity .7) into canon and scoping the underline rule to `.content .pl-rt a` /
   richtext anchors only. No canon file was edited.
2. Canon `.btn--pill` (56px, padding 14px 34px 14px 14px, gap 12px) is a close but not exact model of the live
   `button-core`: live has no gap (icon margin 10px), border 2px, letter-spacing 1px with `text-content` letter-spacing 0,
   and `--not-fixed-width` behaviour (width auto / min-width max-content, 100% at <=767px). The page CSS carries the
   exact lifted spec; canon `.btn--pill` was not used.
