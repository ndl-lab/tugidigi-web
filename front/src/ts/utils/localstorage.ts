const LOCALSTORAGE_VIED_BOOK_HISTORY_KEY = "viewed_book_history";
const LOCALSTORAGE_FULLTEXT_DEFAULT_SORT_KEY = "fulltext_default_sort";
const LOCALSTORAGE_IS_VIEWED_BOOK_HISTORY_DISABLED_KEY =
  "is_viewed_book_history_disabled";
const LOCALSTORAGE_IS_HISTORY_ALLOWED_KEY ="is_history_allowed_key";

const LOCALSTORAGE_IS_TAG_ALLOWED_KEY ="is_tag_allowed_key";

export const VALID_FULLTEXT_SORT_QUERY = [
  "",
  "publishyear:asc",
  "publishyear:desc",
];

export const tryLocalStorageAvailable = (): boolean => {
  try {
    localStorage.setItem("is_available_test", "test");
    localStorage.removeItem("is_available_test");
    return true;
  } catch (e) {
    console.log("localstorage is unavailable");
    return false;
  }
};
export const checkHistoryPermission = (): boolean => {
  try {
    if(localStorage.getItem(LOCALSTORAGE_IS_HISTORY_ALLOWED_KEY))return true;
    else return false;
  } catch (e) {
    console.log("localstorage is unavailable");
    return false;
  }
}
export const setHistoryPermission = (): boolean => {
  try {
    localStorage.setItem(LOCALSTORAGE_IS_HISTORY_ALLOWED_KEY,"true");
    return true;
  } catch (e) {
    console.error(
      `Setting ${LOCALSTORAGE_IS_HISTORY_ALLOWED_KEY} failed`
    );
    console.error(e);
    return false;
  }
}
export const setTagPermission = (): boolean => {
  try {
    localStorage.setItem(LOCALSTORAGE_IS_TAG_ALLOWED_KEY,"true");
    return true;
  } catch (e) {
    console.error(
      `Setting ${LOCALSTORAGE_IS_TAG_ALLOWED_KEY} failed`
    );
    console.error(e);
    return false;
  }
}
export const checkTagPermission = (): boolean => {
  try {
    if(localStorage.getItem(LOCALSTORAGE_IS_TAG_ALLOWED_KEY))return true;
    else return false;
  } catch (e) {
    console.log("localstorage is unavailable");
    return false;
  }
}

export const retreiveViewedBookHistory = (): string[] => {
  if (isViewedBookHistoryDisabled()) return [];
  // 履歴閲覧機能でページが壊れるのはいやなので、コンソールにエラー表示するだけ
  try {
    return (
      localStorage.getItem(LOCALSTORAGE_VIED_BOOK_HISTORY_KEY)?.split(",") || []
    );
  } catch (e) {
    console.error("Retrieving viewed book history failed");
    console.error(e);
    return [];
  }
};

export const insertViewdBookHistory = (bookId: string): boolean => {
  if (isViewedBookHistoryDisabled()) false;
  const viewedBookHistory = retreiveViewedBookHistory();
  viewedBookHistory.unshift(bookId);
  // すでにIDが登録されていたら、重複しちゃうので消す
  const lastBookIndex = viewedBookHistory.lastIndexOf(bookId);
  if (lastBookIndex > 0) {
    viewedBookHistory.splice(lastBookIndex, 1);
  }
  // 閲覧履歴は100件まで
  if (viewedBookHistory.length > 100) {
    viewedBookHistory.splice(100);
  }
  // 履歴閲覧機能でページが壊れるのはいやなので、コンソールにエラー表示するだけ
  try {
    localStorage.setItem(
      LOCALSTORAGE_VIED_BOOK_HISTORY_KEY,
      viewedBookHistory.join(",")
    );
    return true;
  } catch (e) {
    console.error("Setting viewed book history failed");
    console.error(e);
    return false;
  }
};

export const retreiveFulltextDefaultSort = (): string | null => {
  try {
    const defaultSortQuery = localStorage.getItem(
      LOCALSTORAGE_FULLTEXT_DEFAULT_SORT_KEY
    );

    if (VALID_FULLTEXT_SORT_QUERY.includes(defaultSortQuery))
      return defaultSortQuery;

    return null;
  } catch (e) {
    console.error("Retrieving fulltext default sort failed");
    console.error(e);
    return null;
  }
};

export const setFulltextDefaultSort = (_sortQuery: string): boolean => {
  const sortQuery = _sortQuery === undefined ? "" : _sortQuery
  if (VALID_FULLTEXT_SORT_QUERY.includes(sortQuery) === false) {
    console.warn(`Sort Query ${sortQuery} is invalid`);
    return false;
  }
  try {
    localStorage.setItem(LOCALSTORAGE_FULLTEXT_DEFAULT_SORT_KEY, sortQuery);
    return true;
  } catch (e) {
    console.error("Setting fulltext default sort failed");
    console.error(e);
    return false;
  }
};

export const isViewedBookHistoryDisabled = () => {
  try {
    const isDisabled = localStorage.getItem(
      LOCALSTORAGE_IS_VIEWED_BOOK_HISTORY_DISABLED_KEY
    );
    return isDisabled === "1" ? true : false;
  } catch (e) {
    console.error(
      `Retrieving ${LOCALSTORAGE_IS_VIEWED_BOOK_HISTORY_DISABLED_KEY} failed`
    );
    console.error(e);
    return false;
  }
};

export const setIsViewedBookHistoryDisabled = (toDisabled: boolean) => {
  const setValue = toDisabled === true ? "1" : "";

  if (toDisabled === true) {
    try {
      localStorage.removeItem(LOCALSTORAGE_VIED_BOOK_HISTORY_KEY);
    } catch (e) {
      console.error(`Removing ${LOCALSTORAGE_VIED_BOOK_HISTORY_KEY} failed`);
      console.error(e);
    }
  }

  try {
    localStorage.setItem(
      LOCALSTORAGE_IS_VIEWED_BOOK_HISTORY_DISABLED_KEY,
      setValue
    );
    return true;
  } catch (e) {
    console.error(
      `Setting ${LOCALSTORAGE_IS_VIEWED_BOOK_HISTORY_DISABLED_KEY} failed`
    );
    console.error(e);
    return false;
  }
};
