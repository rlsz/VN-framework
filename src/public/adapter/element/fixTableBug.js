import Tree from './table/src/store/tree';
import {getRowIdentity} from "./table/src/util";

// import Tree from 'element-ui/packages/table/src/store/tree'
// import {getRowIdentity} from "element-ui/packages/table/src/util";
// import aaa from 'element-ui'
// console.log(aaa, aaa.Table.components.TableBody)

function walkTreeNode(root, cb, childrenKey = 'children', lazyKey = 'hasChildren', lazy = false) {
    const isNil = (array) => !(Array.isArray(array) && array.length);

    function _walker(parent, children, level) {
        cb(parent, children, level);
        children.forEach(item => {
            if (lazy && item[lazyKey]) {
                cb(item, null, level + 1);
                return;
            }
            const children = item[childrenKey];
            if (!isNil(children)) {
                _walker(item, children, level + 1);
            }
        });
    }

    root.forEach(item => {
        if (lazy && item[lazyKey]) {
            cb(item, null, 0);
            return;
        }
        const children = item[childrenKey];
        if (!isNil(children)) {
            _walker(item, children, 0);
        }
    });
}
Tree.methods.normalize = function (data) {
    const {
        childrenColumnName,
        lazyColumnIdentifier,
        rowKey,
        lazy
    } = this.states;
    const res = {};
    walkTreeNode(
        data,
        (parent, children, level) => {
            const parentId = getRowIdentity(parent, rowKey);
            if (Array.isArray(children)) {
                res[parentId] = {
                    children: children.map(row => getRowIdentity(row, rowKey)),
                    level
                };
            } else if (lazy) {
                // 当 children 不存在且 lazy 为 true，该节点即为懒加载的节点
                res[parentId] = {
                    children: [],
                    lazy: true,
                    level
                };
            }
        },
        childrenColumnName,
        lazyColumnIdentifier,
        lazy
    );
    return res;
}

export {default as Table} from './table';
