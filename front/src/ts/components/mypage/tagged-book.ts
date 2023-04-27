import Vue from "vue";
import { searchBook } from "service/book-service";
import BookEntry from "pages/search/book_entry";
import SearchStore from "components/search/search-store/search-store";
import Component from "vue-class-component";
import { Book } from "domain/book";
import { fromQueryString } from "service/search-utils";
import {
  getIllustrationsByBook,
  getIllustrations,
} from "service/illust-service";
import { Watch } from "vue-property-decorator";
import VueScrollTo from "vue-scrollto";

import "./tagged-book.scss";
import { tryLocalStorageAvailable } from "utils/localstorage";
import {
  addTagObject,
  deleteTagObject,
  renameTagName,
  retrieveAllTagNames,
  retrieveObjectByTagName,
} from "utils/indexedDB";
import { equalsIgnoreNull } from "utils/objects";
import { BASE_PATH, DOMAIN } from "config";

@Component({
  template: require("./tagged-book.html"),
  components: {
    BookEntry,
  },
})
export default class TaggedBooks extends Vue {
  taggedBookIds: string[] = [];
  allTagNames: string[] = [];
  ss: SearchStore<Book> = null;
  isLocalStorageAvailable: boolean = true;
  isExportModalActive: boolean = false;
  isImportModalActive: boolean = false;
  dataToImport: string = "";
  tagNameToImport: string = "";
  exportURL: string = "";
  exportCSV: string = "";
  keywordBuffer: string = "";

  beforeMount() {
    this.keywordBuffer = this.keyword
    this.ss = new SearchStore(searchBook, true);
    this.ss.addAfterSearchListener((result) => {
      result.list.forEach(async (book) => {
        if (book.illustrations) {
          this.$set(
            book,
            "illusts",
            (await getIllustrations(book.illustrations)).data
          );
        } else {
          this.$set(
            book,
            "illusts",
            (await getIllustrationsByBook(book.id)).data.list
          );
        }
      });
    });
  }
  async mounted() {
    // localstorage 使えるかな？
    this.isLocalStorageAvailable = tryLocalStorageAvailable();
    if (this.isLocalStorageAvailable === false) return;

    this.allTagNames = await retrieveAllTagNames();

    this.taggedBookIds = (
      await retrieveObjectByTagName(this.currentTagName)
    ).bookIds;
    if(this.taggedBookIds.length > 0) {
      this.searchBooksByTaggedIds();
    }
    
    const hash = this.$route.hash
    if(hash !== undefined) {
      VueScrollTo.scrollTo(`${hash}`);
    }
  }

  get sortedBookList(): Book[] {
    return (
      this.taggedBookIds
        .map((id) => {
          return this.ss.result?.list.find((book) => book.id === id);
        })
        .filter((b) => b !== undefined) || []
    );
  }

  get current() {
    const page = this.$route.query.viewed_book_page 
    if(page === undefined) {
      return 1
    }
    return Number(page)
  }

  get currentTagName(): string {
    const tagName = this.$route.query.current_tag_name
    if (tagName === undefined) return this.allTagNames[0]
    if (Array.isArray(tagName) === true) return tagName[0]
    // 型推論が効かない
    return tagName as string
  }

  get keyword(): string {
    const keyword = this.$route.query.tag_keyword || ""
    if(Array.isArray(keyword) === true) return keyword[0]
    return keyword as string
  }

  searchBooksByTaggedIds() {
    const query = new URLSearchParams();
    this.taggedBookIds.forEach((id) => {
      query.append("f-id", id);
    });
    if (this.keyword.length > 1) {
      this.keyword.split(/[\s　]+/).forEach(splittedWord => {
        query.append("keyword", splittedWord);
      })
    }

    query.append("from", `${(this.current - 1) * 5}`)
    query.append("size", "5")
    const queryObj = fromQueryString(`?${query.toString()}`);
    this.ss.restoreQuery(queryObj);
  }

  async changeCurrentTag(newTagName: string) {
    if (this.currentTagName === newTagName) return;

    const newTaggedBookIds = (await retrieveObjectByTagName(newTagName))
    .bookIds;
    
    await this.$router.push({
      query: {
        viewed_book_page: "1",
        current_tag_name: newTagName,
        tag_keyword: null,
      },
      hash: "tagged-books"
    })
    // 異なるタグに同じIDのbookを入れていた場合、ここでreturnしておかないとsearchStoreのロジックによりバグる
    if (equalsIgnoreNull(this.taggedBookIds, newTaggedBookIds)) return;

    this.taggedBookIds = newTaggedBookIds;
    this.ss.clear();
    this.searchBooksByTaggedIds();
  }

  async searchBooksByKeyowrd() {
    await this.$router.push({
      query: {
        viewed_book_page: `1`,
        current_tag_name: `${this.currentTagName}`,
        tag_keyword: this.keywordBuffer
      },
      hash: "tagged-books"
    })
    this.ss.clear();
    this.searchBooksByTaggedIds();
    VueScrollTo.scrollTo("#tagged-books");
  }

  async changeCurrentTagName() {
    const newTagName = prompt(
      this.$l2("新しいタグ名を入力してください", "Input new tag name")
    );
    await renameTagName(this.currentTagName, newTagName);
    this.allTagNames = await retrieveAllTagNames();
    await this.changeCurrentTag(newTagName);
  }
  async deleteCurrentTag() {
    const tag = await retrieveObjectByTagName(this.currentTagName);
    const confirmation = confirm(
      this.$l2(
        `${tag.bookIds.length}件の資料が登録されている「${tag.tagName}」タグを削除しますか？`,
        `Are you sure to delete ${tag.tagName}, which has ${tag.bookIds.length} books`
      )
    );
    if (confirmation === false) return;
    await deleteTagObject(tag);
    this.allTagNames = await retrieveAllTagNames();
    await this.changeCurrentTag(this.allTagNames[0]);
  }

  async exportCurrentTag() {
    const { tagName, bookIds } = await retrieveObjectByTagName(
      this.currentTagName
    );
    const query = new URLSearchParams();
    // 一応バージョン情報をつけておく
    query.append("v", "1");
    query.append("tagName", tagName);
    bookIds.forEach((bookId) => {
      query.append("bookIds", bookId);
    });

    this.exportURL = `${DOMAIN}${BASE_PATH}mypage?${query.toString()}`;
    //this.exportURL = `https://lab.ndl.go.jp/dl/mypage?${query.toString()}`;
    this.exportCSV = `${bookIds.join(",")}`
    this.isExportModalActive = true;
  }

  async importTag() {

    if(this.dataToImport === "" || this.tagNameToImport === "") {
      const message = this.$l2("タグ名とタグデータが必要です", "Tag Name and Tag Data are required.")
      alert(message)
      return
    }

    // csv 形式でデータが受け取られるはずなので、パースして登録する
    const bookIds = this.dataToImport.split(",").map(id => id.trim())
    const bookIdValidation = /^\d{6,}$/
    const invalidBookId = bookIds
      .filter(id => {
        return bookIdValidation.test(id) === false
      })

    // 不正なデータがあったら、処理を終える
    if(invalidBookId.length !== 0) {
      alert(`${invalidBookId.length}件の不正なデータが存在します\n${invalidBookId.join(", ")}`)
      return
    }

    const ok = await addTagObject({
      tagName: this.tagNameToImport,
      bookIds,
    }).catch((e) => {
      console.error(e);
      return false;
    });

    const message = ok
      ? this.$l2(
          "タグのインポートに成功しました",
          "imported tag successfully"
        )
      : this.$l2("タグのインポートに失敗しました", "failed to import tag");

    alert(message);
    this.allTagNames = await retrieveAllTagNames();
    this.isImportModalActive = false
  }

  async changePage(pageNumber: number) {
    await this.$router.push({
      query: {
        tag_keyword: this.$route.query.tag_keyword,
        viewed_book_page: `${pageNumber}`,
        current_tag_name: `${this.currentTagName}`
      },
      hash: "tagged-books"
    })
    this.ss.clear();
    this.searchBooksByTaggedIds();
    VueScrollTo.scrollTo("#tagged-books");

  }
}
