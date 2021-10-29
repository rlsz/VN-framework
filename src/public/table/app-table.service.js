import {SimpleClone} from "../base/utils";

export class AppTableService {
    columnsConfig = [] // { renderHeader: (h, data) => html, renderCell: (h, data) => html }; data: { ...app-table-column-props }
    addColumn(opts) {
        this.columnsConfig.push(opts)
    }
}
