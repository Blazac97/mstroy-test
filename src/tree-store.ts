// Для удобства и скорости будем использовать Map
interface ITreeNode {
  id: Readonly<number | "root">;
  parent: number | string ;
  type?: any;
}


export class TreeStore {
  private readonly itemsById: Map<number | string, any>; // Хранение всех элементов по id
  private readonly childrenByParentId: Map<number | string, any[]>; // Хранение дочерних элементов по id родителя
  
  constructor(items: Array<ITreeNode>) {
    this.itemsById = new Map();
    this.childrenByParentId = new Map();

    for (const item of items) {
      const { id, parent } = item;

      if (!this.itemsById.has(id)) {
        this.itemsById.set(id, item); // Добавляем элемент в хранилище по id
      }

      if (!this.childrenByParentId.has(parent)) {
        this.childrenByParentId.set(parent, []); // Создаем пустую коллекцию для детей
      }

      const children = this.childrenByParentId.get(parent)!;
      children.push(item);
      this.childrenByParentId.set(parent, children); // Обновляем список детей
    }
  }


  public getAll(): Array<ITreeNode> {
    return [...this.itemsById.values()];
  }


  public getItem(id: number | string): ITreeNode {
    return this.itemsById.get(id);
  }

  public getChildren(id: number | string): Array<ITreeNode> {
    return this.childrenByParentId.get(id) || [];
  }

  public getAllChildren(id: number | string): Array<ITreeNode> {
    let result: Array<any> = [];
    const queue: Array<any> = this.getChildren(id);

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      result.push(currentNode);
      const children = this.getChildren(currentNode.id);
      queue.push(...children);
    }

    return result;
  }

  public getAllParents(id: number | string): Array<ITreeNode> {
    const result: Array<any> = [];
    let currentId = id;
    while (currentId && currentId !== "root") {
      const parent = this.getItem(currentId)?.parent;
      if (parent === 'root') break;
      result.push(this.getItem(parent)); // Добавляем родителя
      currentId = parent;
    }
    return result;
  }
}
const items = [
  { id: 1, parent: "root" },
  { id: 2, parent: 1, type: "test" },
  { id: 3, parent: 1, type: "test" },
  { id: 4, parent: 2, type: "test" },
  { id: 5, parent: 2, type: "test" },
  { id: 6, parent: 2, type: "test" },
  { id: 7, parent: 4, type: null },
  { id: 8, parent: 4, type: null },
];

const ts = new TreeStore(items);

console.log("<=============Получаем все объекты:=============>",ts.getAll())
console.log("<=============Получаем объект id=2:=============>",ts.getItem(2))
console.log("<=============Получаем всех детей для id=2 (ищем детей текущего объекта):=============>",ts.getChildren(2))
console.log("<=============Получаем всех детей и ниже по древу для id=2 (идём от детей текущего объекта и ниже):=============>",ts.getAllChildren(2))
console.log("<=============Получаем всех родителей и выше по древу для id=8 (идём от родителей текущего объекта и выше к корневому):=============>",ts.getAllParents(8))