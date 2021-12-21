export * from "./app-table.service"

import "./table.less"
import table from "./app-table";
import tableColumn from "./app-table-column";

export default function (Vue) {
    Vue.component(table.name, table)
    Vue.component(tableColumn.name, tableColumn)
}
