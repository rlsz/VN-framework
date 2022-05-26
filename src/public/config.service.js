export class ConfigService {
    static useClass(token) {
        return {
            provide: ConfigService,
            useClass: token
        }
    }

    tablePageSize = 20
    tablePageSizeList = [10, 20, 30, 40, 50, 100]
    tableBorder = true
    tableAlwaysShowPagination = false
    tableDefaultLayout = 'total, prev, pager, next, sizes, jumper, slot'
    dialogDisableClose = false
    headerCellStyle = ''
}
