import SearchStore from "components/search/search-store/search-store";
import { Book } from "domain/book";
import { searchNgramBook} from "service/book-service";
import Vue from "vue";
import { Prop, Watch } from "vue-property-decorator";
import Component from "vue-class-component";
import "./ngram-viewer.scss";
import LineChart from './LineChart.js'

var VueScrollTo = require("vue-scrollto");

@Component({
  template: require("./ngram-viewer.html"),
  components: {
    LineChart
  }
})
export default class NgramViewerPage extends Vue {
  @Prop()
  ss: SearchStore<Book>;
  datacollection:any= null;
  dataload:boolean=false;
  fillData () {
    this.$nextTick(() => {
      let labelsarray=Object.keys(this.ss.result.facets[0].counts);
      let dataarray=Object.values(this.ss.result.facets[0].counts);
      this.datacollection = {
        labels: labelsarray,
        datasets: [
          {
            label: 'Publish Year',
            backgroundColor: '#f87979',
            data: dataarray
          }
        ]
      }
    });
  }
  clickbutton(){
    this.fillData();
    this.dataload=true;
  }
}
