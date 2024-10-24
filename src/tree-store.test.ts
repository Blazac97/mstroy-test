import { TreeStore } from './tree-store';

describe('TreeStore', () => {
    const items = [
        { id: 1, parent: 'root' },
        { id: 2, parent: 1, type: 'test' },
        { id: 3, parent: 1, type: 'test' },
        { id: 4, parent: 2, type: 'test' },
        { id: 5, parent: 2, type: 'test' },
        { id: 6, parent: 2, type: 'test' },
        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
    ];

    const treeStore = new TreeStore(items);

    it('должен вернуть все объекты', () => {
        expect(treeStore.getAll()).toEqual(items);
    });

    describe('getItem', () => {
        it('возвращает корректный объект по id', () => {
            expect(treeStore.getItem(7)).toEqual({ id: 7, parent: 4, type: null });
        });

        it('корректно обрабатывает несуществующие id', () => {
            expect(treeStore.getItem(9999)).toBeUndefined();
        });
    });

    describe('getChildren', () => {
        it('получает прямых потомков объекта', () => {
            const expectedChildrenOf4 = [{ id: 7, parent: 4, type: null }, { id: 8, parent: 4, type: null }];
            expect(treeStore.getChildren(4)).toEqual(expectedChildrenOf4);
        });

        it('корректно обрабатывает объекты без детей', () => {
            const emptyArray = [];
            expect(treeStore.getChildren(5)).toEqual(emptyArray);
        });

        it('работает для корневых объектов', () => {
            const childrenOf2 = [{ id: 4, parent: 2, type: 'test'}, { id: 5, parent: 2, type: 'test'},
                                { id: 6, parent: 2, type: 'test'}];
            expect(treeStore.getChildren(2)).toEqual(childrenOf2);
        })
    });

    describe('getAllChildren', () => {
        it('извлекает всех потомков, включая вложенные уровни', () => {
            const allDescendantsOf2 = [
                { id: 4, parent: 2, type: 'test' }, 
                { id: 5, parent: 2, type: 'test' },
                { id: 6, parent: 2, type: 'test'},
                { id: 7, parent: 4, type: null },
                { id: 8, parent: 4, type: null }
            ];
            expect(treeStore.getAllChildren(2)).toEqual(allDescendantsOf2);
        });

        it('корректно обрабатывает объекты без детей', () => {
            expect(treeStore.getAllChildren(5)).toHaveLength(0);
        });
    });

    describe('getAllParents', () => {
        it('возвращает родителей  до корневого объекта', () => {
            const parentsOf7 = [
                { id: 4, parent: 2, type: 'test'},
                { id: 2, parent: 1, type: 'test' },
                { id: 1, parent: 'root' }
            ];
            expect(treeStore.getAllParents(7)).toEqual(parentsOf7);
        });

        it('корректно обрабатывает отсутствующих родителей', () => {
            expect(() => treeStore.getAllParents('missing')).not.toThrow();
        });

        it('соблюдается порядок родителей', () => {
            const parentsOf8 = [
                { id: 4, parent: 2, type: 'test' },
                { id: 2, parent: 1, type: 'test' },
                { id: 1, parent: 'root' }
            ];
            expect(treeStore.getAllParents(8)).toEqual(parentsOf8);
        });
    });
});