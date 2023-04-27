const TAGS_AND_BOOKS_OBJECT_STORE_NAME = "tagsAndIds";

export type Tag = {
  tagName: string;
  bookIds: string[];
  updatedAt: Date;
};

export const openIDB = async (): Promise<IDBDatabase> => {
  const openRequest = indexedDB.open("mypage", 1);

  const openRequestPromise: Promise<IDBDatabase> = new Promise(
    (resolve, reject) => {
      // IndexDB の初回起動時とバージョン変更時に発火され、DBの初期化や更新を行う
      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;

        // tagId(name) と bookId を保管する object store
        const tagsAndBooksObjectStore = db.createObjectStore(
          TAGS_AND_BOOKS_OBJECT_STORE_NAME,
          {
            keyPath: "tagName",
          }
        );
        tagsAndBooksObjectStore.createIndex("bookIdIndex", "bookIds", {
          multiEntry: true,
        });
        tagsAndBooksObjectStore.createIndex("updatedAtIndex", "updatedAt");

        // デフォルトタグとして、お気に入り用のタグを追加
        const tagInitObject: Tag = {
          tagName: "like",
          bookIds: [],
          updatedAt: new Date(),
        };
        tagsAndBooksObjectStore.add(tagInitObject);
      };

      openRequest.onsuccess = () => {
        const db = openRequest.result;
        resolve(db);
      };
      openRequest.onerror = () => {
        reject(openRequest.error);
      };
    }
  );

  return openRequestPromise;
};

export const getTagsAndBooksObjectStore = async (
  isWritable: boolean = false
) => {
  const db = await openIDB()
  const transactionMode = isWritable ? "readwrite" : "readonly";
  const tagsAndBooksObjectStore = db
    .transaction(TAGS_AND_BOOKS_OBJECT_STORE_NAME, transactionMode)
    .objectStore(TAGS_AND_BOOKS_OBJECT_STORE_NAME);

  // wait until current transaction is completed
  db.close();
  return tagsAndBooksObjectStore;
};

export const IDBRequestPromise = async <T = unknown>(
  req: IDBRequest
): Promise<T> => {
  const getRequestPromise: Promise<T> = new Promise((resolve, reject) => {
    req.onsuccess = () => {
      const result = req.result;
      resolve(result);
    };
    req.onerror = () => {
      const error = req.error;
      reject(error);
    };
  });
  return getRequestPromise;
};

export const retrieveObjectByTagName = async (tagName: Tag["tagName"]): Promise<Tag | undefined> => {
  const tagsAndBooksObjectStore = await getTagsAndBooksObjectStore();
  const getRequest = tagsAndBooksObjectStore.get(IDBKeyRange.only(tagName));

  return IDBRequestPromise(getRequest);
};

export const putTagObject = async (tag: Omit<Tag, "updatedAt">): Promise<Tag["tagName"]> => {
  (tag as Tag).updatedAt = new Date();

  const tagsAndBooksObjectStore = await getTagsAndBooksObjectStore(true);
  const putRequest = tagsAndBooksObjectStore.put(tag);

  return IDBRequestPromise(putRequest);
};
export const addTagObject = async (tag: Omit<Tag, "updatedAt">): Promise<Tag["tagName"]> => {
  (tag as Tag).updatedAt = new Date();

  const tagsAndBooksObjectStore = await getTagsAndBooksObjectStore(true);
  const addRequest = tagsAndBooksObjectStore.add(tag);

  return IDBRequestPromise(addRequest);
};

export const deleteTagObject = async (tag: Omit<Tag, "updatedAt">): Promise<unknown> => {
  const tagsAndBooksObjectStore = await getTagsAndBooksObjectStore(true);
  const deleteRequest = tagsAndBooksObjectStore.delete(IDBKeyRange.only(tag.tagName))

  return IDBRequestPromise(deleteRequest)
}

export const pushBookIdByTagName = async ({
  bookId,
  tagName,
}: {
  bookId: string;
  tagName: string;
}): Promise<Tag["tagName"] | null> => {
  // TODO: use type guard
  const tag = await retrieveObjectByTagName(tagName);
  // タグが存在しない、あるいはbookがすでに登録されている場合は null を返す
  if (tag === undefined || tag.bookIds.includes(bookId)) return Promise.resolve(null);
  tag.bookIds.push(bookId);
  return putTagObject(tag);
};

export const deleteBookIdByTagName = async ({
  bookId,
  tagName
}: {
  bookId: string;
  tagName: string;
}): Promise<Tag["tagName"]> => {
  const tag = await retrieveObjectByTagName(tagName);
  // 指定のタグがなかった場合
  if (tag === undefined || tag.bookIds.includes(bookId) === false) {
    return Promise.resolve(null);
  }
  
  tag.bookIds = tag.bookIds.filter(taggedBookId => taggedBookId !== bookId)
  if(tag.bookIds.length === 0) {
    deleteTagObject(tag)
  } else {
    return putTagObject(tag)
  }
}


export const retrieveAllObjectByBookId = async (
  bookId: string
): Promise<Tag[]> => {
  const tagsAndBooksObjectStore = await getTagsAndBooksObjectStore();
  const getRequest = tagsAndBooksObjectStore
    .index("bookIdIndex")
    .getAll(IDBKeyRange.only(bookId));
  return IDBRequestPromise(getRequest);
};

export const retrieveAllTagNames = async (): Promise<string[]> => {
  const tagsAndBooksObjectStore = await getTagsAndBooksObjectStore();
  const getRequest = tagsAndBooksObjectStore.getAllKeys();
  return IDBRequestPromise(getRequest);
};

export const renameTagName = async (
  targetTagName: string,
  newTagName: string
): Promise<Promise<Tag["tagName"] | null>> => {
  const tag = await retrieveObjectByTagName(targetTagName);
  if(tag === undefined) return Promise.resolve(null)

  // タグ名が重複することを防ぐ
  const allTagName = await retrieveAllTagNames()
  if(allTagName.includes(newTagName)) {
    return Promise.resolve(null)
  }

  await deleteTagObject(tag)
  const isCreated = await addTagObject({
    ...tag,
    tagName: newTagName
  })

  return isCreated
}