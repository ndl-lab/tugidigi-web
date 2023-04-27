import Component from 'vue-class-component'
import Vue from 'vue'

import './header.scss';
import { Watch } from 'vue-property-decorator';

@Component({
    template: require("./header.html"),
    components: {
    }
})
export default class Header extends Vue {
    isHamburgerActive: boolean = false

    @Watch("$route.fullPath")
    currentRouteHandler(_newRoute: string) {
        this.isHamburgerActive = false
    }
}