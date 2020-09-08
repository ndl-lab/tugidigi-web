// import Component from 'vue-class-component';
// import Vue from 'vue';
// import {Book, Page} from 'domain/reiki';
// import {getPages} from 'service/reikiservice';

// import './thumbs.scss';

// function zeroPadding(num, length) {
//     return ('0000000000' + num).slice(-length);
// }

// class PageSelect {

//     constructor(
//         public page: number,
//         public selected: boolean) {}
// }

// @Component({
//     template: require('./thumbs.html'),
//     props: ["book"]
// })
// export default class Thumbs extends Vue {

//     book: Book;
//     pages: PageSelect[] = [];

//     white:boolean = true;

//     mounted() {
//         getPages(this.book.id, (pages) => {
//             let pstemp: PageSelect[] = [];
//             pages.forEach(pg => pstemp.push(new PageSelect(pg.page, false)));
//             this.pages = pstemp;
//         });
//     }

//     get pageSelected(){
//         return this.pages.filter(p => p.selected).length > 0;
//     }

//     get downloadlink(){
//         return `http://172.31.168.5/dms/api/download/${this.book.id}?pages=${this.pages.filter(p => p.selected).map(p => p.page).join(",")}&white=${this.white}`
//     }

//     clickPage(page: PageSelect){
//         this.$emit("pgclick", page.page);
//     }

//     iiifUrl(page: number) {
//         if (this.book)
//             return `http://172.31.168.5/img/?IIIF=${this.book.id}/${zeroPadding(page, 4)}.tif/full/,120/0/default.jpg`;
//         else return "";
//     }

// }
