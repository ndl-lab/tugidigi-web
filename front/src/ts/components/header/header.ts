import Component from 'vue-class-component'
import Vue from 'vue'

import './header.scss';

@Component({
    template: require("./header.html"),
    components: {
    }
})
export default class Header extends Vue {
}