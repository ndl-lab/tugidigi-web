import SearchStore from "components/search/search-store/search-store";
import { MyVue } from "types";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import "./search-detail.scss";
export default interface SearchDetail extends MyVue {}

@Component({
  name: "SearchDetail",
  components: {},
  template: `
    <div class="search-detail">
      <div
        class="search-detail-field"
        v-for="(f,ind) in ss.searchdef.searchFields"
      >
        <div class="search-field-name is-size-7-touch">{{ $ls(f.name) }}</div>
        <div class="search-dimentions">
          <component
            :is="searchFieldComponent(f)"
            :field="f"
            :ss="ss"
          ></component>
        </div>
      </div>
    </div>
  `
})
export default class SearchDetail extends Vue {
  @Prop()
  ss: SearchStore<any>;
}
