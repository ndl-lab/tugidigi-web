// Vue とかより先に読み込む必要がある
import Component from "vue-class-component";
Component.registerHooks([
  'metaInfo'
])

import Vue from "vue";
import FulltextResults from "pages/search/fulltext-search/results-ui/fulltext-results";
import "./fulltext-search.scss";
import { Location } from "vue-router";
import { NdcData, ndcData } from "utils/ndcdata";
import { Watch } from "vue-property-decorator";
import {
  convertChildKeyToPrimaryKey,
  convertTertiaryKeyToSecondaryKey,
  isValidSecondaryKey,
  isValidTertiaryKey,
  retrieveSecondaryItemsByPrimaryKey,
  retrieveTertiaryItemsBySecondaryKey,
} from "utils/ndcdata-util";
import { diffArray, isEqualArray, removeFromArray } from "utils/objects";
import { generateTitle } from "utils/url";
import { retreiveFulltextDefaultSort } from "utils/localstorage";

@Component({
  template: require("./fulltext-search.html"),
  components: {
    FulltextResults,
  },
})
export default class FulltextSearch extends Vue {
  keyword: string = "";
  fulltextflag: boolean = false;
  withoutimgflag:boolean=false;
  withouthighlightflag: boolean = false;
  filteropen: boolean = false;
  ndcOpenedItems: string[] = [];

  title: string = "";
  author: string = "";
  since: string = "";
  until: string = "";
  isClassic: "" | "true" | "false" = ""
  ndcData: NdcData = ndcData;
  ndcPrimaryKeys: string[] = [];
  ndcSecondaryKeys: string[] = [];
  ndcTertiaryKeys: string[] = [];

  beforeMount() {
    const query = Object.assign({}, this.$route.query);
    if (Array.isArray(query["keyword"])) {
      this.keyword = query["keyword"].join(" ");
    } else {
      this.keyword = query["keyword"];
    }
    if (<string>query["searchfield"] == "contentonly") this.fulltextflag = true;
    else this.fulltextflag = false;
    
    if (<string>query["withoutimg"] == "true")
      this.withoutimgflag = true;
    else this.withoutimgflag = false;
    
    if (<string>query["withouthighlight"] == "true")
      this.withouthighlightflag = true;
    else this.withouthighlightflag = false;
    if (query["f-title"]) {
      this.filteropen = true;
      this.title = <string>query["f-title"];
    }
    if (query["f-responsibility"]) {
      this.filteropen = true;
      this.author = <string>query["f-responsibility"];
    }
    if (query["r-publishyear"]) {
      this.filteropen = true;
      this.since = (<string>query["r-publishyear"]).split(",")[0];
      this.until = (<string>query["r-publishyear"]).split(",")[1];
    }
    
    if (query["fc-isClassic"]) {
      this.filteropen = true;
      this.isClassic = query["fc-isClassic"] === "true" ? "true" : "false"
    }

    if (query["f-ndc"]) {
      const ndcQuery = Array.isArray(query["f-ndc"])
        ? query["f-ndc"]
        : [query["f-ndc"]];
      ndcQuery.forEach((key) => {
        if (/^\d\d\d$/.test(key)) this.ndcTertiaryKeys.push(key);
        else if (/^\d\d\*$/.test(key)) {
          const secondaryNumber = `${key.slice(0, 2)}0`;
          this.ndcSecondaryKeys = [...this.ndcSecondaryKeys, secondaryNumber];
        } else if (/^\d\*$/.test(key)) {
          const primaryNumber = `${key.slice(0, 1)}00`;
          this.ndcPrimaryKeys = [...this.ndcPrimaryKeys, primaryNumber];
        }
      });
    }
  }

  search() {
    if (this.keyword === undefined || this.keyword.length < 2) {
      this.$buefy.toast.open({
        duration: 1500,
        message: `2文字以上のキーワードを入力してください`,
        position: "is-top",
        type: "is-danger",
        queue: false
      });
      return;
    }
    this.filterSearch();
  }

  filterSearch() {
    if (!this.keyword) return;

    const pushobj: Location = this.buildBasicLocationObject();
    
    if (this.title) {
      pushobj.query["f-title"] = this.title;
    }
    if (this.author) {
      pushobj.query["f-responsibility"] = this.author;
    }
    const defaultSort = retreiveFulltextDefaultSort()
    if(defaultSort !== null) {
      pushobj.query["sort"] = defaultSort
    }

    if (
      !Number.isNaN(parseInt(this.since)) &&
      !Number.isNaN(parseInt(this.until))
    ) {
      pushobj.query["r-publishyear"] = this.since + "," + this.until;
    }
    if (this.isClassic !== "") {
      pushobj.query["fc-isClassic"] = this.isClassic === "true" ? "true" : "false";
    }

    if (
      this.ndcPrimaryKeys.length ||
      this.ndcSecondaryKeys.length ||
      this.ndcTertiaryKeys.length
    ) {
      const ndcQuery: string[] = [];
      ndcQuery.push(
        ...this.ndcPrimaryKeys.map((primaryItem) => {
          return primaryItem.slice(0, 1) + "*";
        })
      );
      ndcQuery.push(
        ...this.ndcSecondaryKeys
          .filter(
            (secondaryItem) =>
              !this.ndcPrimaryKeys.includes(`${secondaryItem.slice(0, 1)}00`)
          )
          .map((secondaryItem) => {
            return secondaryItem.slice(0, 2) + "*";
          })
      );
      ndcQuery.push(
        ...this.ndcTertiaryKeys.filter(
          (tertiaryItem) =>
            !this.ndcSecondaryKeys.includes(`${tertiaryItem.slice(0, 2)}0`)
        )
      );
      pushobj.query["f-ndc"] = ndcQuery;
    }

    this.$router.push(pushobj);
    this.$router.go(0); //強制リロード
  }

  buildBasicLocationObject(): Location {
    const pushobj: Location = {
      query: {
        keyword: this.keyword.split(/[\s　]+/),
      },
    };

    if (this.fulltextflag) {
      //searchfield
      pushobj["query"]["searchfield"] = "contentonly";
    }
    if (this.withouthighlightflag) {
      pushobj["query"]["withouthighlight"] = "true";
    }
    if (this.withoutimgflag) {
      pushobj["query"]["withoutimg"] = "true";
    }

    return pushobj;
  }

  hasActiveChild(key: string, level: "primary" | "secondary"): boolean {
    if (level === "primary") {
      const reg = new RegExp(`${key.slice(0, 1)}\\d{2}`);
      return !!this.ndcTertiaryKeys.find((item) => reg.test(item));
    } else if ((level = "secondary")) {
      const reg = new RegExp(`${key.slice(0, 2)}\\d{1}`);
      return !!this.ndcTertiaryKeys.find((item) => reg.test(item));
    }
  }

  // deep: trueを設定してるけど、配列を初期化しないとうまく動かないときがある？
  @Watch("ndcPrimaryKeys", { deep: true })
  onPrimaryKeysChanged(
    newPrimaryKeys: string[],
    previousPrimaryKeys: string[]
  ) {
    const { added, deleted } = diffArray(newPrimaryKeys, previousPrimaryKeys);

    added.forEach((primaryKey) => {
      const secondaryItemKeysToAdd = retrieveSecondaryItemsByPrimaryKey(
        primaryKey
      )
        .map((secondaryItem) => secondaryItem.key)
        .filter(
          (secondaryKey) => !this.ndcSecondaryKeys.includes(secondaryKey)
        );

      this.ndcSecondaryKeys = [
        ...this.ndcSecondaryKeys,
        ...secondaryItemKeysToAdd,
      ];
    });

    deleted.forEach((primaryKey) => {
      const secondaryItemKeysToDelete = retrieveSecondaryItemsByPrimaryKey(
        primaryKey
      ).map((secondaryItem) => secondaryItem.key);

      this.ndcSecondaryKeys = this.ndcSecondaryKeys.filter(
        (key) => !secondaryItemKeysToDelete.includes(key)
      );
    });
  }

  @Watch("ndcSecondaryKeys", { deep: true })
  onSecondaryKeysChanged(
    newSecondaryKeys: string[],
    previousSecondaryKeys: string[]
  ) {
    const { added, deleted } = diffArray(
      newSecondaryKeys,
      previousSecondaryKeys
    );

    added.forEach((secondaryKey) => {
      const primaryKey = convertChildKeyToPrimaryKey(secondaryKey);
      const tertiaryItemKeysToAdd = retrieveTertiaryItemsBySecondaryKey(
        secondaryKey
      )
        .map((secondaryItem) => secondaryItem.key)
        .filter((tertiaryItem) => !this.ndcTertiaryKeys.includes(tertiaryItem));

      this.ndcTertiaryKeys.push(...tertiaryItemKeysToAdd);

      const fullSecondaryKeys = retrieveSecondaryItemsByPrimaryKey(
        primaryKey
      ).map((child) => child.key);
      const currentSecondaryKeys = this.ndcSecondaryKeys.filter((key) =>
        isValidSecondaryKey(primaryKey, key)
      );
      const isFilled = isEqualArray(fullSecondaryKeys, currentSecondaryKeys);

      if (isFilled && !this.ndcPrimaryKeys.includes(primaryKey)) {
        this.ndcPrimaryKeys = [...this.ndcPrimaryKeys, primaryKey];
      }
    });

    deleted.forEach((secondaryKey) => {
      const primaryKey = convertChildKeyToPrimaryKey(secondaryKey);

      const tertiaryItemKeysToDelete = retrieveTertiaryItemsBySecondaryKey(
        secondaryKey
      ).map((secondaryItem) => secondaryItem.key);

      this.ndcTertiaryKeys = this.ndcTertiaryKeys.filter(
        (key) => !tertiaryItemKeysToDelete.includes(key)
      );

      removeFromArray(this.ndcPrimaryKeys, primaryKey);
    });
  }

  @Watch("ndcTertiaryKeys", { deep: true })
  onTertiaryKeysChanged(
    newTertiaryKeys: string[],
    previousTertiaryKeys: string[]
  ) {
    const { added, deleted } = diffArray(newTertiaryKeys, previousTertiaryKeys);

    added.forEach((tertiaryKey) => {
      const secondaryKey = convertTertiaryKeyToSecondaryKey(tertiaryKey);

      const fullTertiaryKeys = retrieveTertiaryItemsBySecondaryKey(
        secondaryKey
      ).map((child) => child.key);
      const currentTertiaryKeys = this.ndcTertiaryKeys.filter((key) =>
        isValidTertiaryKey(key, secondaryKey)
      );
      const isFilled = isEqualArray(fullTertiaryKeys, currentTertiaryKeys);

      if (isFilled && !this.ndcSecondaryKeys.includes(secondaryKey)) {
        this.ndcSecondaryKeys = [...this.ndcSecondaryKeys, secondaryKey];
      }
    });

    deleted.forEach((tertiaryKey) => {
      const primaryKey = convertChildKeyToPrimaryKey(tertiaryKey);
      const secondaryKey = convertTertiaryKeyToSecondaryKey(tertiaryKey);

      removeFromArray(this.ndcPrimaryKeys, primaryKey);
      removeFromArray(this.ndcSecondaryKeys, secondaryKey);
    });
  }

  metaInfo() {
    return {
      title: generateTitle({
        subTitle: this.$l2("全文検索", "Keyword search")
      })
    }
  }
}
